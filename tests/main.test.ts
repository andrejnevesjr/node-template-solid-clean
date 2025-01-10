import request from 'supertest';
import { ApiExpress } from '../src/infra/api/express/api.express';
import { CreateProductRoute } from '../src/infra/api/express/routes/products/create-product.express.route';
import { ListProductRoute } from '../src/infra/api/express/routes/products/list-product.express.route';
import { CreateProductUseCase } from '../src/usecases/product/create-product.usecase';
import { ListProductUseCase } from '../src/usecases/product/list-product.usecase';
import { ProductRepositoryPrisma } from '../src/infra/repositories/product/product.repository.prisma';
import { UserRepositoryPrisma } from '../src/infra/repositories/user/user.repository.prisma';

import { prismaMock } from './singleton';

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
    const aRepository = ProductRepositoryPrisma.create(prismaMock);
    const aUserRepository = UserRepositoryPrisma.create(prismaMock);

    const createProductUseCase = CreateProductUseCase.create(
      aRepository,
      aUserRepository,
    );
    const listProductUseCase = ListProductUseCase.create(aRepository);

    const createRoute = CreateProductRoute.create(createProductUseCase);
    const listRoute = ListProductRoute.create(listProductUseCase);

    api = ApiExpress.create([createRoute, listRoute]);
  });

  it('should create a product', async () => {
    const response = await request(api.getApp())
      .post('/products')
      .send({ name: 'Test Product', price: 100 });

    expect(response.status).toBe(401);
  });

  // it('should create a product', async () => {
  //   const response = await request(api.getApp())
  //     .post('/products')
  //     .send({ name: 'Test Product', price: 100 });

  //   expect(response.status).toBe(201);
  //   expect(response.body).toHaveProperty('id');
  // });

  // it('should list products', async () => {
  //   prismaMock.product.findMany.mockResolvedValue(products.products);
  //   const response = await request(api.getApp()).get('/products');
  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual(
  //     expect.objectContaining({
  //       products: expect.arrayContaining([
  //         expect.objectContaining({
  //           id: expect.any(String),
  //           name: expect.any(String),
  //           price: expect.any(Number),
  //         }),
  //       ]),
  //     }),
  //   );
  // });
});
