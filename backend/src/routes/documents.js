import { Router } from "express";
import prisma from "../lib/prisma.js";
import { asyncHandler, logActivity } from "../lib/helpers.js";
import { authenticate } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();
router.use(authenticate);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { projectId, category, q } = req.query;
    const where = {};
    if (projectId) where.projectId = projectId;
    if (category) where.category = category;
    if (q) where.name = { contains: q, mode: "insensitive" };
    const docs = await prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { uploadedBy: { select: { firstName: true, lastName: true } }, project: { select: { id: true, name: true } } },
    });
    res.json(docs);
  })
);

// Upload fichier (multipart) OU enregistrement par URL
router.post(
  "/",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const b = req.body;
    let url = b.url;
    let size = b.size ? Number(b.size) : null;
    let mimeType = b.mimeType || null;
    let name = b.name;

    if (req.file) {
      url = `/uploads/${req.file.filename}`;
      size = req.file.size;
      mimeType = req.file.mimetype;
      name = name || req.file.originalname;
    }

    // Gestion des versions: même nom + même projet => version + 1
    const previous = await prisma.document.findFirst({
      where: { projectId: b.projectId, name },
      orderBy: { version: "desc" },
    });

    const doc = await prisma.document.create({
      data: {
        projectId: b.projectId,
        name,
        category: b.category || "RAPPORT",
        version: previous ? previous.version + 1 : 1,
        url,
        size,
        mimeType,
        uploadedById: req.user.id,
      },
      include: { uploadedBy: { select: { firstName: true, lastName: true } } },
    });
    await logActivity({ userId: req.user.id, action: "UPLOAD", entity: "Document", entityId: doc.id, ip: req.ip });
    res.status(201).json(doc);
  })
);

router.patch(
  "/:id/sign",
  asyncHandler(async (req, res) => {
    const doc = await prisma.document.update({ where: { id: req.params.id }, data: { signed: true } });
    await logActivity({ userId: req.user.id, action: "SIGN", entity: "Document", entityId: doc.id, ip: req.ip });
    res.json(doc);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.document.delete({ where: { id: req.params.id } });
    res.json({ message: "Document supprimé" });
  })
);

export default router;
