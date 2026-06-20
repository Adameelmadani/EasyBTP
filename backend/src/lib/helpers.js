import prisma from "./prisma.js";

// Journalisation des actions (exigence 5.1)
export async function logActivity({ userId, action, entity, entityId, details, ip }) {
  try {
    if (!userId) return;
    await prisma.activityLog.create({
      data: { userId, action, entity, entityId, details, ip },
    });
  } catch (e) {
    // ne jamais bloquer la requête sur un échec de log
    console.error("logActivity failed", e.message);
  }
}

export async function notify({ userId, type = "INFO", title, message, link }) {
  try {
    if (!userId) return;
    await prisma.notification.create({
      data: { userId, type, title, message, link },
    });
  } catch (e) {
    console.error("notify failed", e.message);
  }
}

// Recalcule l'avancement global d'un projet à partir des lots pondérés
export async function recomputeProjectProgress(projectId) {
  const lots = await prisma.lot.findMany({ where: { projectId } });
  if (lots.length === 0) return;
  const totalWeight = lots.reduce((s, l) => s + (l.weight || 0), 0);
  let progress = 0;
  if (totalWeight > 0) {
    progress = lots.reduce((s, l) => s + (l.actualProgress || 0) * (l.weight || 0), 0) / totalWeight;
  } else {
    progress = lots.reduce((s, l) => s + (l.actualProgress || 0), 0) / lots.length;
  }
  await prisma.project.update({
    where: { id: projectId },
    data: { progress: Math.round(progress * 10) / 10 },
  });
  return progress;
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
