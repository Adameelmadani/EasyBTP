import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { hashPassword, comparePassword, signToken, publicUser } from "../lib/auth.js";
import { asyncHandler, logActivity } from "../lib/helpers.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

const ROLES = [
  "ADMIN", "MAITRE_OUVRAGE", "ARCHITECTE", "BUREAU_ETUDES", "ENTREPRISE",
  "CONTROLE_TECHNIQUE", "CONDUCTEUR_TRAVAUX", "CHEF_CHANTIER", "VISITEUR",
];

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(ROLES).optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
});

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) return res.status(409).json({ message: "Cet email est déjà utilisé" });

    const user = await prisma.user.create({
      data: {
        ...data,
        role: data.role || "VISITEUR",
        password: await hashPassword(data.password),
      },
    });
    const token = signToken({ sub: user.id, role: user.role });
    await logActivity({ userId: user.id, action: "REGISTER", entity: "User", entityId: user.id, ip: req.ip });
    res.status(201).json({ token, user: publicUser(user) });
  })
);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
    if (!user.isActive) return res.status(403).json({ message: "Compte désactivé" });

    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
    const token = signToken({ sub: user.id, role: user.role });
    await logActivity({ userId: user.id, action: "LOGIN", entity: "User", entityId: user.id, ip: req.ip });
    res.json({ token, user: publicUser(user) });
  })
);

router.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json({ user: publicUser(req.user) });
  })
);

export default router;
