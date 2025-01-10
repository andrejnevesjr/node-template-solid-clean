import { NextFunction, Request, Response } from 'express';
import { HttpMethod, Route } from '../routes';
import {
  ListProductOutputDto,
  ListProductUseCase,
} from '@usecases/product/list-product.usecase';
import path from 'path';
import { errorResponse } from '@package/exceptions-handler/error.response';
import { ListProductResponseDto } from 'types/product.types';

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
      path.join('/', path.basename(__dirname)),
      HttpMethod.GET,
      listProductService,
    );
  }

  public getHandler(): (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => Promise<void> {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { token } = request.cookies;

      //validation
      if (!token) {
        return next(new errorResponse('You must Log in!', 401));
      }

      const output = await this.listProductService.execute();

      const responseBody = this.presentOutput(output);

      response.status(200).json(responseBody).send();
    };
  }

  private presentOutput(input: ListProductOutputDto): ListProductResponseDto {
    const response: ListProductResponseDto = {
      products: input.products.map((product) => ({
        name: product.name,
        price: product.price,
        user_id: product.user_id,
      })),
    };
    return response;
  }
}
