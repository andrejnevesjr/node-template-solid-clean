import dotenv from 'dotenv';
dotenv.config();
import { CreateProductRoute } from '@infra/api/express/routes/products/create-product.express.route';
import { ListProductRoute } from '@infra/api/express/routes/products/list-product.express.route';
import { ProductRepositoryPrisma } from '@infra/repositories/product/product.repository.prisma';
import prisma from '@package/prisma/prisma';
import { CreateProductUseCase } from '@usecases/product/create-product.usecase';
import { ListProductUseCase } from '@usecases/product/list-product.usecase';
import { ApiExpress } from '@infra/api/express/api.express';

function main() {
  const aRepository = ProductRepositoryPrisma.create(prisma);
  const createProductUseCase = CreateProductUseCase.create(aRepository);
  const listProductUseCase = ListProductUseCase.create(aRepository);

  const createRoute = CreateProductRoute.create(createProductUseCase);
  const listRoute = ListProductRoute.create(listProductUseCase);

  const API = ApiExpress.create([createRoute, listRoute]);
  const PORT = Number(process.env.API_PORT) || 3000;
  API.start(PORT);
}

main();
