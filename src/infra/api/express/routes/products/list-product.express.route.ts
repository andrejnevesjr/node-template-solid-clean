import { Request, Response } from 'express';
import { HttpMethod, Route } from '../routes';
import {
  ListProductOutputDto,
  ListProductUseCase,
} from '@usecases/product/list-product.usecase';

export type ListProductResponseDto = {
  products: {
    id: string;
    name: string;
    price: number;
  }[];
};

export class ListProductRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listProductService: ListProductUseCase,
  ) {}

  getPath(): string {
    return this.path;
  }
  getMethod(): HttpMethod {
    return this.method;
  }

  public static create(
    listProductService: ListProductUseCase,
  ): ListProductRoute {
    return new ListProductRoute(
      '/products',
      HttpMethod.GET,
      listProductService,
    );
  }

  public getHandler(): (request: Request, response: Response) => Promise<void> {
    return async (request: Request, response: Response) => {
      const output = await this.listProductService.execute();

      const responseBody = this.presentOutput(output);

      response.status(200).json(responseBody).send();
    };
  }

  private presentOutput(input: ListProductOutputDto): ListProductResponseDto {
    const response: ListProductResponseDto = {
      products: input.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
      })),
    };
    return response;
  }
}
