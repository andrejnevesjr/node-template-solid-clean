import { Product } from '@domain/product/entity/product';
import { ProductGateway } from '@domain/product/gateway/product.gateway';
import { Usecase } from '../usecase';

export type ListProductInputDto = void;

export type ListProductOutputDto = {
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
};

export class ListProductUseCase
  implements Usecase<ListProductInputDto, ListProductOutputDto>
{
  private constructor(private readonly productGateway: ProductGateway) {
    this.productGateway = productGateway;
  }

  public static create(productGateway: ProductGateway): ListProductUseCase {
    return new ListProductUseCase(productGateway);
  }

  public async execute(): Promise<ListProductOutputDto> {
    const products = await this.productGateway.findAll();

    const output = this.presentOutput(products);

    return output;
  }

  private presentOutput(products: Product[]): ListProductOutputDto {
    const productList = {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
      })),
    };

    return productList;
  }
}
