import { Request, Response } from 'express';
import {
  CreateProductInputDto,
  CreateProductOutputDto,
  CreateProductUseCase,
} from '@usecases/product/create-product.usecase';
import { HttpMethod, Route } from '../routes';

export type CreateProductResponseDto = {
  id?: string;
};

export class CreateProductRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createProductService: CreateProductUseCase,
  ) {}

  getPath(): string {
    return this.path;
  }
  getMethod(): HttpMethod {
    return this.method;
  }

  public static create(
    createProductService: CreateProductUseCase,
  ): CreateProductRoute {
    return new CreateProductRoute(
      '/products',
      HttpMethod.POST,
      createProductService,
    );
  }

  public getHandler(): (request: Request, response: Response) => Promise<void> {
    return async (request: Request, response: Response) => {
      const { name, price } = request.body;

      const input: CreateProductInputDto = {
        name,
        price,
      };

      const output: CreateProductOutputDto =
        await this.createProductService.execute(input);

      if (output.message) {
        response.status(400).json({ message: output.message });
        return;
      }
      const responseDto = this.presentOutput(output);

      response.status(201).json(responseDto);
    };
  }

  private presentOutput(
    output: CreateProductOutputDto,
  ): CreateProductResponseDto {
    const response = { id: output.id };
    return response;
  }
}
