import express from 'express';
import { PrismaClient } from '@prisma/client';
import router from './routes/product';
import { admin, adminRouter } from './admin';
//import productRouter from './routes/product'; 
//import { admin, adminRouter } from './admin';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/products', router);
app.use(admin.options.rootPath, adminRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`AdminJS is running on http://localhost:${port}${admin.options.rootPath}`);
});