export function notFound(req, res) {
  res.status(404).json({ message: `Route introuvable: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  // Erreurs Zod
  if (err.name === "ZodError") {
    return res.status(400).json({ message: "Données invalides", errors: err.errors });
  }
  // Contrainte unique Prisma
  if (err.code === "P2002") {
    return res.status(409).json({
      message: `Conflit: la valeur du champ ${err.meta?.target} existe déjà`,
    });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ message: "Ressource introuvable" });
  }
  res.status(err.status || 500).json({ message: err.message || "Erreur serveur" });
}
