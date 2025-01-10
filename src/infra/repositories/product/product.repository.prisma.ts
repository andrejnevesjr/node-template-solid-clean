/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';
import { ProductGateway } from '@domain/product/gateway/product.gateway';
import { Product, ProductProps } from '@domain/product/entity/product';
import Logger from '@package/logger/logger';
import { CreateProductOutputDto } from 'types/product.types';

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

  public async save(product: Product): Promise<CreateProductOutputDto> {
    const newProduct: ProductProps = {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      user_id: product.user_id,
    };

    const productExists = await this.prismaClient.product.findFirst({
      where: {
        name: newProduct.name,
      },
    });

    if (productExists) {
      Logger.error('Product - Repository - Product already exists');
      return {
        status: false,
        message: 'Product already exists',
      };
    }

    const createdProduct = await this.prismaClient.product.create({
      data: newProduct,
    });
    return {
      status: true,
      product: {
        id: createdProduct.id,
        name: createdProduct.name,
        price: createdProduct.price,
        quantity: createdProduct.quantity,
        user_id: createdProduct.user_id,
      },
    };
  }

  public async list(): Promise<Product[]> {
    const products = await this.prismaClient.product.findMany();

    const productList = products.map((p) => {
      const product = Product.with({
        name: p.name,
        price: p.price,
        quantity: p.quantity,
        user_id: p.user_id,
      });
      return product;
    });

    return productList;
  }
}
