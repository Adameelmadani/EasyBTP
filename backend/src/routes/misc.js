import { Router } from "express";
import prisma from "../lib/prisma.js";
import { asyncHandler } from "../lib/helpers.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

// ── Notifications ──
router.get(
  "/notifications",
  asyncHandler(async (req, res) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json(notifications);
  })
);

router.patch(
  "/notifications/:id/read",
  asyncHandler(async (req, res) => {
    const n = await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } });
    res.json(n);
  })
);

router.patch(
  "/notifications/read-all",
  asyncHandler(async (req, res) => {
    await prisma.notification.updateMany({ where: { userId: req.user.id, read: false }, data: { read: true } });
    res.json({ message: "Toutes les notifications sont lues" });
  })
);

// ── Journal d'activité (5.1 journalisation) ──
router.get(
  "/activity",
  asyncHandler(async (req, res) => {
    const { entity, userId } = req.query;
    const where = {};
    if (entity) where.entity = entity;
    if (userId) where.userId = userId;
    const logs = await prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { user: { select: { firstName: true, lastName: true, role: true } } },
    });
    res.json(logs);
  })
);

export default router;
