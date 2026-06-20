import { verifyToken } from "../lib/auth.js";
import prisma from "../lib/prisma.js";

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Authentification requise" });

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Compte invalide ou désactivé" });
    }
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Jeton invalide ou expiré" });
  }
}

// Restriction par rôle. ADMIN passe toujours.
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Authentification requise" });
    if (req.user.role === "ADMIN") return next();
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé pour votre rôle" });
    }
    next();
  };
}
