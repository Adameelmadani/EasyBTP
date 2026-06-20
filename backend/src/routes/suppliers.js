import { Router } from "express";
import prisma from "../lib/prisma.js";
import { asyncHandler, logActivity } from "../lib/helpers.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { materials: true, orders: true } } },
    });
    res.json(suppliers);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const supplier = await prisma.supplier.findUnique({
      where: { id: req.params.id },
      include: { materials: true, orders: { orderBy: { date: "desc" }, take: 10 } },
    });
    if (!supplier) return res.status(404).json({ message: "Fournisseur introuvable" });
    res.json(supplier);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const b = req.body;
    const supplier = await prisma.supplier.create({
      data: {
        name: b.name, contactName: b.contactName, email: b.email, phone: b.phone, address: b.address,
        ratingDelay: Number(b.ratingDelay) || 0,
        ratingQuality: Number(b.ratingQuality) || 0,
        ratingPrice: Number(b.ratingPrice) || 0,
      },
    });
    await logActivity({ userId: req.user.id, action: "CREATE", entity: "Supplier", entityId: supplier.id, ip: req.ip });
    res.status(201).json(supplier);
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const b = req.body;
    const data = { name: b.name, contactName: b.contactName, email: b.email, phone: b.phone, address: b.address };
    if (b.ratingDelay != null) data.ratingDelay = Number(b.ratingDelay);
    if (b.ratingQuality != null) data.ratingQuality = Number(b.ratingQuality);
    if (b.ratingPrice != null) data.ratingPrice = Number(b.ratingPrice);
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
    const supplier = await prisma.supplier.update({ where: { id: req.params.id }, data });
    res.json(supplier);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.supplier.delete({ where: { id: req.params.id } });
    res.json({ message: "Fournisseur supprimé" });
  })
);

export default router;
