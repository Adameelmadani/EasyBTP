import { Router } from "express";
import prisma from "../lib/prisma.js";
import { asyncHandler } from "../lib/helpers.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

// Tableau de bord global (4.3)
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const [
      projects, reservesOpen, reservesTotal, materials, recentPhotos,
      finances, projectsByStatus, recentActivity, lateTasks,
    ] = await Promise.all([
      prisma.project.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.reserve.count({ where: { status: { in: ["OUVERTE", "EN_COURS"] } } }),
      prisma.reserve.count(),
      prisma.material.findMany(),
      prisma.photo.findMany({ orderBy: { takenAt: "desc" }, take: 6, include: { project: { select: { name: true } } } }),
      prisma.financeRecord.findMany({ where: { status: { in: ["VALIDEE", "PAYEE"] } } }),
      prisma.project.groupBy({ by: ["status"], _count: true }),
      prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { user: { select: { firstName: true, lastName: true } } } }),
      prisma.task.findMany({ where: { status: "EN_RETARD" }, take: 5, include: { project: { select: { name: true } } } }),
    ]);

    const activeProjects = projects.filter((p) => p.status === "EN_COURS").length;
    const avgProgress = projects.length
      ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length)
      : 0;
    const lowStock = materials.filter((m) => m.stockAvailable <= m.stockMin);
    const stockValue = materials.reduce((s, m) => s + m.stockAvailable * m.unitPrice, 0);
    const billed = finances.reduce((s, f) => s + f.amount, 0);
    const totalMarket = projects.reduce((s, p) => s + (p.marketAmount || 0), 0);

    res.json({
      kpis: {
        totalProjects: projects.length,
        activeProjects,
        avgProgress,
        reservesOpen,
        reservesTotal,
        lowStockCount: lowStock.length,
        stockValue,
        billed,
        totalMarket,
      },
      projectsByStatus: projectsByStatus.map((g) => ({ status: g.status, count: g._count })),
      projects: projects.slice(0, 6).map((p) => ({
        id: p.id, name: p.name, reference: p.reference, status: p.status,
        progress: p.progress, expectedEndDate: p.expectedEndDate, marketAmount: p.marketAmount,
      })),
      lowStock: lowStock.slice(0, 5),
      recentPhotos,
      recentActivity,
      lateTasks,
    });
  })
);

export default router;
