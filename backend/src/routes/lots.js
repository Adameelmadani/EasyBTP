import { Router } from "express";
import prisma from "../lib/prisma.js";
import { asyncHandler, logActivity, recomputeProjectProgress } from "../lib/helpers.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

const editors = ["CONDUCTEUR_TRAVAUX", "CHEF_CHANTIER", "ENTREPRISE", "BUREAU_ETUDES"];

// Lots d'un projet
router.get(
  "/project/:projectId",
  asyncHandler(async (req, res) => {
    const lots = await prisma.lot.findMany({
      where: { projectId: req.params.projectId },
      orderBy: { createdAt: "asc" },
      include: {
        updates: { orderBy: { date: "desc" }, take: 5, include: { user: { select: { firstName: true, lastName: true } } } },
      },
    });
    res.json(lots);
  })
);

router.post(
  "/",
  authorize(...editors),
  asyncHandler(async (req, res) => {
    const { projectId, name, category, weight, plannedProgress, amount } = req.body;
    const lot = await prisma.lot.create({
      data: {
        projectId, name, category,
        weight: weight != null ? Number(weight) : 0,
        plannedProgress: plannedProgress != null ? Number(plannedProgress) : 0,
        amount: amount != null ? Number(amount) : null,
      },
    });
    await recomputeProjectProgress(projectId);
    await logActivity({ userId: req.user.id, action: "CREATE", entity: "Lot", entityId: lot.id, ip: req.ip });
    res.status(201).json(lot);
  })
);

router.put(
  "/:id",
  authorize(...editors),
  asyncHandler(async (req, res) => {
    const { name, category, weight, plannedProgress, actualProgress, amount } = req.body;
    const data = { name, category };
    if (weight != null) data.weight = Number(weight);
    if (plannedProgress != null) data.plannedProgress = Number(plannedProgress);
    if (actualProgress != null) data.actualProgress = Number(actualProgress);
    if (amount != null) data.amount = Number(amount);
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
    const lot = await prisma.lot.update({ where: { id: req.params.id }, data });
    await recomputeProjectProgress(lot.projectId);
    res.json(lot);
  })
);

router.delete(
  "/:id",
  authorize(...editors),
  asyncHandler(async (req, res) => {
    const lot = await prisma.lot.delete({ where: { id: req.params.id } });
    await recomputeProjectProgress(lot.projectId);
    res.json({ message: "Lot supprimé" });
  })
);

// ── Mises à jour d'avancement (saisie quotidienne) ──
router.post(
  "/:id/progress",
  asyncHandler(async (req, res) => {
    const { percentage, quantityExecuted, note } = req.body;
    const lot = await prisma.lot.findUnique({ where: { id: req.params.id } });
    if (!lot) return res.status(404).json({ message: "Lot introuvable" });

    const update = await prisma.progressUpdate.create({
      data: {
        lotId: lot.id,
        userId: req.user.id,
        percentage: Number(percentage),
        quantityExecuted: quantityExecuted != null ? Number(quantityExecuted) : null,
        note,
      },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
    await prisma.lot.update({ where: { id: lot.id }, data: { actualProgress: Number(percentage) } });
    await recomputeProjectProgress(lot.projectId);
    await logActivity({ userId: req.user.id, action: "PROGRESS", entity: "Lot", entityId: lot.id, details: `${percentage}%`, ip: req.ip });
    res.status(201).json(update);
  })
);

// Validation hiérarchique d'une mise à jour
router.patch(
  "/progress/:updateId/validate",
  authorize("CONDUCTEUR_TRAVAUX", "BUREAU_ETUDES", "CONTROLE_TECHNIQUE"),
  asyncHandler(async (req, res) => {
    const update = await prisma.progressUpdate.update({
      where: { id: req.params.updateId },
      data: { validated: true, validatedBy: req.user.id },
    });
    res.json(update);
  })
);

router.get(
  "/:id/history",
  asyncHandler(async (req, res) => {
    const updates = await prisma.progressUpdate.findMany({
      where: { lotId: req.params.id },
      orderBy: { date: "desc" },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
    res.json(updates);
  })
);

export default router;
