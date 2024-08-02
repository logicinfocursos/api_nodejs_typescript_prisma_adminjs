
Vamos criar um projeto de API em Node.js com TypeScript usando Prisma com SQLite para manipular uma tabela de nome products com os campos id e name. Além disso, integraremos o AdminJS para gerenciar a aplicação. Aqui está o passo a passo:

Passo 1: Configurar o Ambiente de Desenvolvimento
Instalar o Node.js: Certifique-se de ter o Node.js e npm instalados em seu sistema. Você pode verificar isso executando:

sh
Copiar código
node -v
npm -v
Criar um Diretório para o Projeto:

sh
Copiar código
mkdir shop-api
cd shop-api
Inicializar um Projeto Node.js:

sh
Copiar código
npm init -y
Passo 2: Configurar o TypeScript
Instalar as Dependências do TypeScript:

sh
Copiar código
npm install typescript ts-node @types/node --save-dev
Inicializar o TypeScript:

sh
Copiar código
npx tsc --init
Configurar o tsconfig.json:
No arquivo tsconfig.json, ajuste as configurações conforme necessário. Um exemplo básico pode ser:

json
Copiar código
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src"]
}
Passo 3: Configurar o Prisma
Instalar as Dependências do Prisma:

sh
Copiar código
npm install @prisma/client
npm install prisma --save-dev
Inicializar o Prisma:

sh
Copiar código
npx prisma init
Configurar o schema.prisma:
No arquivo prisma/schema.prisma, configure o banco de dados SQLite e defina o modelo Product:

prisma
Copiar código
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Product {
  id   Int    @id @default(autoincrement())
  name String
}
Executar a Migração do Prisma:

sh
Copiar código
npx prisma migrate dev --name init
Passo 4: Configurar o Projeto com Express
Instalar as Dependências do Express:

sh
Copiar código
npm install express
npm install @types/express --save-dev
Criar a Estrutura do Projeto:

src/app.ts: Arquivo principal do aplicativo Express.
src/routes/product.ts: Definir as rotas de CRUD para Product.
Configurar o src/app.ts:

typescript
Copiar código
import express from 'express';
import { PrismaClient } from '@prisma/client';
import productRouter from './routes/product';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/products', productRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
Configurar o src/routes/product.ts:

typescript
Copiar código
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
Passo 5: Configurar o AdminJS
Instalar as Dependências do AdminJS:

sh
Copiar código
npm install adminjs @adminjs/express @adminjs/prisma
Configurar o AdminJS:

src/admin.ts: Configurar o AdminJS.
typescript
Copiar código
import { PrismaClient } from '@prisma/client';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource } from '@adminjs/prisma';

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
Integrar o AdminJS com o Express:

Atualizar src/app.ts para incluir o AdminJS.
typescript
Copiar código
import express from 'express';
import { PrismaClient } from '@prisma/client';
import productRouter from './routes/product';
import { admin, adminRouter } from './admin';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/products', productRouter);
app.use(admin.options.rootPath, adminRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`AdminJS is running on http://localhost:${port}${admin.options.rootPath}`);
});
Passo 6: Executar a Aplicação
Compilar e Executar o Projeto:

sh
Copiar código
npx tsc
node dist/app.js
Acessar a API e o AdminJS:

API: http://localhost:3000/products
AdminJS: http://localhost:3000/admin
Isso configura uma API básica em Node.js com TypeScript usando Prisma e SQLite, além de integrar o AdminJS como backend para gerenciar a tabela products.

<pre>
shop-api/
├── dist/
│   └── (arquivos compilados)
├── src/
│   ├── routes/
│   │   └── product.ts
│   ├── admin.ts
│   └── app.ts
├── tsconfig.json
└── package.json
</pre>