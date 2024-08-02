import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { PrismaClient } from '@prisma/client';

const Database = (await import('@adminjs/prisma')).Database;
const Resource = (await import('@adminjs/prisma')).Resource;

AdminJS.registerAdapter({ Database, Resource });

const prisma = new PrismaClient();
const adminOptions = {
  resources: [
    {
      resource: { model: prisma.product, client: prisma },
      options: {}
    }
  ],
};

const admin = new AdminJS(adminOptions);
const adminRouter = AdminJSExpress.buildRouter(admin);

export { admin, adminRouter };
