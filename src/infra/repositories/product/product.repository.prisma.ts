/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';
import { ProductGateway } from '@domain/product/gateway/product.gateway';
import { Product } from '@domain/product/entity/product';
import Logger from '@package/logger/logger';

export class ProductRepositoryPrisma implements ProductGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}
  update(product: Product): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(productId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findById(productId: string): Promise<Product | null> {
    throw new Error('Method not implemented.');
  }
  findByName(productName: string): Promise<Product | null> {
    throw new Error('Method not implemented.');
  }

  public static create(prismaClient: PrismaClient): ProductRepositoryPrisma {
    return new ProductRepositoryPrisma(prismaClient);
  }

  public async save(product: Product): Promise<boolean> {
    const newProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    };

    const productExists = await this.prismaClient.product.findFirst({
      where: {
        name: newProduct.name,
      },
    });

    if (productExists) {
      Logger.error('Product already exists');
      return false;
    }

    await this.prismaClient.product.create({ data: newProduct });
    return true;
  }

  public async findAll(): Promise<Product[]> {
    const products = await this.prismaClient.product.findMany();

    const productList = products.map((p) => {
      const product = Product.with({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: p.quantity,
      });
      return product;
    });

    return productList;
  }
}
