import { NextFunction, Request, Response } from 'express';
import { CreateProductUseCase } from '@usecases/product/create-product.usecase';
import { HttpMethod, Route } from '../routes';
import {
  CreateProductInputDto,
  CreateProductOutputDto,
} from 'types/product.types';
import { errorResponse } from '@package/exceptions-handler/error.response';
import path from 'path';

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
      path.join('/', path.basename(__dirname)),
      HttpMethod.POST,
      createProductService,
    );
  }

  public getHandler(): (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => Promise<void> {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { name, price } = request.body;
      const { token } = request.cookies;

      //validation
      if (!token) {
        return next(new errorResponse('You must Log in!', 401));
      }

      const input: CreateProductInputDto = {
        name,
        price,
        token,
      };

      const output: CreateProductOutputDto =
        await this.createProductService.execute(input);

      this.presentOutput(response, output, next);
    };
  }

  private presentOutput(
    response: Response,
    output: CreateProductOutputDto,
    next: NextFunction,
  ): void {
    if (output.status === false) {
      response.status(401).json(output);
    } else {
      response.status(201).json(output);
    }
    next();
  }
}
