import { Router } from "express";
import prisma from "../lib/prisma.js";
import { hashPassword, publicUser } from "../lib/auth.js";
import { asyncHandler, logActivity } from "../lib/helpers.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

// Liste des utilisateurs (tous les rôles authentifiés peuvent voir l'annuaire)
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true, email: true, firstName: true, lastName: true, role: true,
        phone: true, company: true, avatar: true, isActive: true, lastLogin: true, createdAt: true,
      },
    });
    res.json(users);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(publicUser(user));
  })
);

// Création par un administrateur
router.post(
  "/",
  authorize("ADMIN"),
  asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, role, phone, company } = req.body;
    const user = await prisma.user.create({
      data: {
        email, firstName, lastName, role: role || "VISITEUR", phone, company,
        password: await hashPassword(password || "password123"),
      },
    });
    await logActivity({ userId: req.user.id, action: "CREATE", entity: "User", entityId: user.id, ip: req.ip });
    res.status(201).json(publicUser(user));
  })
);

router.put(
  "/:id",
  authorize("ADMIN"),
  asyncHandler(async (req, res) => {
    const { email, firstName, lastName, role, phone, company, isActive, password } = req.body;
    const data = { email, firstName, lastName, role, phone, company, isActive };
    if (password) data.password = await hashPassword(password);
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
    const user = await prisma.user.update({ where: { id: req.params.id }, data });
    await logActivity({ userId: req.user.id, action: "UPDATE", entity: "User", entityId: user.id, ip: req.ip });
    res.json(publicUser(user));
  })
);

router.delete(
  "/:id",
  authorize("ADMIN"),
  asyncHandler(async (req, res) => {
    await prisma.user.delete({ where: { id: req.params.id } });
    await logActivity({ userId: req.user.id, action: "DELETE", entity: "User", entityId: req.params.id, ip: req.ip });
    res.json({ message: "Utilisateur supprimé" });
  })
);

export default router;
