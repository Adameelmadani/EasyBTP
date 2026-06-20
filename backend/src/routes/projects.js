import { Router } from "express";
import prisma from "../lib/prisma.js";
import { asyncHandler, logActivity } from "../lib/helpers.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

const memberSelect = {
  members: { include: { user: { select: { id: true, firstName: true, lastName: true, role: true, avatar: true, email: true } } } },
};

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { status, q } = req.query;
    const where = {};
    if (status) where.status = status;
    if (q) where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { reference: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
    ];
    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        ...memberSelect,
        _count: { select: { reserves: true, documents: true, photos: true, tasks: true, lots: true } },
      },
    });
    res.json(projects);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        ...memberSelect,
        lots: { orderBy: { createdAt: "asc" } },
        _count: { select: { reserves: true, documents: true, photos: true, tasks: true, meetings: true, finances: true } },
      },
    });
    if (!project) return res.status(404).json({ message: "Projet introuvable" });
    res.json(project);
  })
);

const editors = ["MAITRE_OUVRAGE", "ARCHITECTE", "BUREAU_ETUDES", "CONDUCTEUR_TRAVAUX", "ENTREPRISE"];

router.post(
  "/",
  authorize(...editors),
  asyncHandler(async (req, res) => {
    const b = req.body;
    const project = await prisma.project.create({
      data: {
        name: b.name,
        reference: b.reference,
        description: b.description,
        address: b.address,
        latitude: b.latitude != null ? Number(b.latitude) : null,
        longitude: b.longitude != null ? Number(b.longitude) : null,
        surface: b.surface != null ? Number(b.surface) : null,
        budget: b.budget != null ? Number(b.budget) : null,
        marketAmount: b.marketAmount != null ? Number(b.marketAmount) : null,
        clientName: b.clientName,
        status: b.status || "PLANIFIE",
        startDate: b.startDate ? new Date(b.startDate) : null,
        expectedEndDate: b.expectedEndDate ? new Date(b.expectedEndDate) : null,
      },
    });
    // Le créateur devient membre
    await prisma.projectMember.create({
      data: { projectId: project.id, userId: req.user.id, roleLabel: "Créateur" },
    });
    await logActivity({ userId: req.user.id, action: "CREATE", entity: "Project", entityId: project.id, ip: req.ip });
    res.status(201).json(project);
  })
);

router.put(
  "/:id",
  authorize(...editors),
  asyncHandler(async (req, res) => {
    const b = req.body;
    const data = {
      name: b.name, reference: b.reference, description: b.description, address: b.address,
      clientName: b.clientName, status: b.status,
      latitude: b.latitude != null ? Number(b.latitude) : undefined,
      longitude: b.longitude != null ? Number(b.longitude) : undefined,
      surface: b.surface != null ? Number(b.surface) : undefined,
      budget: b.budget != null ? Number(b.budget) : undefined,
      marketAmount: b.marketAmount != null ? Number(b.marketAmount) : undefined,
      startDate: b.startDate ? new Date(b.startDate) : undefined,
      expectedEndDate: b.expectedEndDate ? new Date(b.expectedEndDate) : undefined,
    };
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
    const project = await prisma.project.update({ where: { id: req.params.id }, data });
    await logActivity({ userId: req.user.id, action: "UPDATE", entity: "Project", entityId: project.id, ip: req.ip });
    res.json(project);
  })
);

router.delete(
  "/:id",
  authorize("MAITRE_OUVRAGE"),
  asyncHandler(async (req, res) => {
    await prisma.project.delete({ where: { id: req.params.id } });
    await logActivity({ userId: req.user.id, action: "DELETE", entity: "Project", entityId: req.params.id, ip: req.ip });
    res.json({ message: "Projet supprimé" });
  })
);

// ── Membres / intervenants ──
router.post(
  "/:id/members",
  authorize(...editors),
  asyncHandler(async (req, res) => {
    const { userId, roleLabel } = req.body;
    const member = await prisma.projectMember.create({
      data: { projectId: req.params.id, userId, roleLabel },
      include: { user: { select: { id: true, firstName: true, lastName: true, role: true, email: true } } },
    });
    res.status(201).json(member);
  })
);

router.delete(
  "/:id/members/:memberId",
  authorize(...editors),
  asyncHandler(async (req, res) => {
    await prisma.projectMember.delete({ where: { id: req.params.memberId } });
    res.json({ message: "Intervenant retiré" });
  })
);

export default router;
