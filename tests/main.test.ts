import request from 'supertest';
import { ApiExpress } from '../src/infra/api/express/api.express';
import { CreateProductRoute } from '../src/infra/api/express/routes/products/create-product.express.route';
import { ListProductRoute } from '../src/infra/api/express/routes/products/list-product.express.route';
import { CreateProductUseCase } from '../src/usecases/product/create-product.usecase';
import { ListProductUseCase } from '../src/usecases/product/list-product.usecase';
import { ProductRepositoryPrisma } from '../src/infra/repositories/product/product.repository.prisma';
import { UserRepositoryPrisma } from '../src/infra/repositories/user/user.repository.prisma';

import { prismaMock } from './singleton';
import { CreateUserRoute } from '../src/infra/api/express/routes/users/create-user.express.route';
import { LoginUserRoute } from '../src/infra/api/express/routes/users/login-user.express.route';
import { LogoutUserRoute } from '../src/infra/api/express/routes/users/logout-user.express.route';
import { CreateUserUseCase } from '../src/usecases/user/create-user.usecase';
import { LoginUserUseCase } from '../src/usecases/user/login-user.usecase';
import { LogoutUserUseCase } from '../src/usecases/user/logout-user.usecase';

describe('API Tests', () => {
  let api: ApiExpress;
  const products = {
    products: [
      {
        id: '0e170931-c121-4c7b-aeba-d9f27e958339',
        name: 'Curso do Zé',
        price: 9.99,
        quantity: 10,
        user_id: 'default_user',
      },
      {
        id: '8a1f7b42-d795-4703-adcd-9b5c4a185f8c',
        name: 'Curso do João',
        price: 1009.99,
        quantity: 5,
        user_id: 'user1',
      },
      {
        id: '8a1f7b42-d795-4703-adcd-9b5c4a185f8c',
        name: 'Curso do João',
        price: 1009.99,
        quantity: 5,
        user_id: 'user2',
      },
    ],
  };

  beforeAll(() => {
    const aProductRepository = ProductRepositoryPrisma.create(prismaMock);
    const aUserRepository = UserRepositoryPrisma.create(prismaMock);

    const createProductUseCase = CreateProductUseCase.create(
      aProductRepository,
      aUserRepository,
    );
    const listProductUseCase = ListProductUseCase.create(aProductRepository);
    const createUserUseCase = CreateUserUseCase.create(aUserRepository);
    const loginUserUseCase = LoginUserUseCase.create(aUserRepository);
    const logoutUserUseCase = LogoutUserUseCase.create(aUserRepository);

    const createProductRoute = CreateProductRoute.create(createProductUseCase);
    const listProductRoute = ListProductRoute.create(listProductUseCase);
    const createUserRoute = CreateUserRoute.create(createUserUseCase);
    const loginUserRoute = LoginUserRoute.create(loginUserUseCase);
    const logoutUserRoute = LogoutUserRoute.create(logoutUserUseCase);

    api = ApiExpress.create([
      createProductRoute,
      listProductRoute,
      createUserRoute,
      loginUserRoute,
      logoutUserRoute,
    ]);
  });

  it('should logout a user', async () => {
    const response = await request(api.getApp())
      .post('/users/logout')
      .set('Cookie', 'token=123456');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'logged out',
    });
  });

  it('should fail when attempt to create a product', async () => {
    const response = await request(api.getApp())
      .post('/products')
      .send({ name: 'Test Product', price: 100 });

    expect(response.status).toBe(401);
  });

  it('should list products', async () => {
    prismaMock.product.findMany.mockResolvedValue(products.products);
    const response = await request(api.getApp())
      .get('/products')
      .set('Cookie', 'token=123456');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        products: expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            price: expect.any(Number),
            user_id: expect.any(String),
          }),
        ]),
      }),
    );
  });
});
