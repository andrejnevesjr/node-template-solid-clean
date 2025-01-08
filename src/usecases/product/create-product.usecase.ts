import { Product } from '@domain/product/entity/product';
import { ProductGateway } from '@domain/product/gateway/product.gateway';
import { Usecase } from '../usecase';

export type CreateProductInputDto = {
  name: string;
  price: number;
};

export type CreateProductOutputDto = {
  id?: string;
  message?: string;
};

export class CreateProductUseCase
  implements Usecase<CreateProductInputDto, CreateProductOutputDto>
{
  private constructor(private readonly productGateway: ProductGateway) {
    this.productGateway = productGateway;
  }

  public static create(productGateway: ProductGateway): CreateProductUseCase {
    return new CreateProductUseCase(productGateway);
  }

  public async execute({
    name,
    price,
  }: CreateProductInputDto): Promise<CreateProductOutputDto> {
    const product = Product.create(name, price);
    const isProductCreated: boolean = await this.productGateway.save(product);

    const output = this.presentOutput(product, isProductCreated);
    return output;
  }

  private presentOutput(
    product: Product,
    isProductCreated: boolean,
  ): CreateProductOutputDto {
    if (!isProductCreated) {
      return {
        message: 'Product already exists',
      };
    }

    const output: CreateProductOutputDto = {
      id: product.id,
    };
    return output;
  }
}
