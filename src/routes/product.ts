import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({ where: { id: Number(id) } });
  res.json(product);
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  const newProduct = await prisma.product.create({ data: { name } });
  res.json(newProduct);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const updatedProduct = await prisma.product.update({
    where: { id: Number(id) },
    data: { name }
  });
  res.json(updatedProduct);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id: Number(id) } });
  res.sendStatus(204);
});

export default router;
