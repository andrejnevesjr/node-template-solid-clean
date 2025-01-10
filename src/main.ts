import dotenv from 'dotenv';
dotenv.config();
import { CreateProductRoute } from '@infra/api/express/routes/products/create-product.express.route';
import { ListProductRoute } from '@infra/api/express/routes/products/list-product.express.route';
import { ProductRepositoryPrisma } from '@infra/repositories/product/product.repository.prisma';
import prisma from '@package/prisma/prisma';
import { CreateProductUseCase } from '@usecases/product/create-product.usecase';
import { ListProductUseCase } from '@usecases/product/list-product.usecase';
import { ApiExpress } from '@infra/api/express/api.express';
import { CreateUserUseCase } from '@usecases/user/create-user.usecase';
import { UserRepositoryPrisma } from '@infra/repositories/user/user.repository.prisma';
import { CreateUserRoute } from '@infra/api/express/routes/users/create-user.express.route';
import { LoginUserUseCase } from '@usecases/user/login-user.usecase';
import { LoginUserRoute } from '@infra/api/express/routes/users/login-user.express.route';
import { LogoutUserUseCase } from '@usecases/user/logout-user.usecase';
import { LogoutUserRoute } from '@infra/api/express/routes/users/logout-user.express.route';

function main() {
  //prisma repopsitories
  const aProductRepository = ProductRepositoryPrisma.create(prisma);
  const aUserRepository = UserRepositoryPrisma.create(prisma);

  //Products use cases
  const createProductUseCase = CreateProductUseCase.create(
    aProductRepository,
    aUserRepository,
  );
  const listProductUseCase = ListProductUseCase.create(aProductRepository);

  // Users use cases
  const createUserUseCase = CreateUserUseCase.create(aUserRepository);
  const loginUserUseCase = LoginUserUseCase.create(aUserRepository);
  const logoutUserUseCase = LogoutUserUseCase.create(aUserRepository);

  //routes
  const createProductRoute = CreateProductRoute.create(createProductUseCase);
  const listProductRoute = ListProductRoute.create(listProductUseCase);
  const createUserRoute = CreateUserRoute.create(createUserUseCase);
  const loginUserRoute = LoginUserRoute.create(loginUserUseCase);
  const logoutUserRoute = LogoutUserRoute.create(logoutUserUseCase);

  //app
  const API = ApiExpress.create([
    createProductRoute,
    listProductRoute,
    createUserRoute,
    loginUserRoute,
    logoutUserRoute,
  ]);
  const PORT = Number(process.env.PORT_SERVER) || 3000;
  API.start(PORT);
}

main();
