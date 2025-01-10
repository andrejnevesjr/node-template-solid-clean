import { NextFunction, Request, Response } from 'express';
import { HttpMethod, Route } from '../routes';
import { errorResponse } from '@package/exceptions-handler/error.response';
import { CreateUserUseCase } from '@usecases/user/create-user.usecase';
import { CreateUserInputDto, UserResponseDto } from 'types/user.types';
import path from 'path';

export class CreateUserRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createUserService: CreateUserUseCase,
  ) {}

  getPath(): string {
    return this.path;
  }
  getMethod(): HttpMethod {
    return this.method;
  }

  public static create(createUserService: CreateUserUseCase): CreateUserRoute {
    return new CreateUserRoute(
      path.join('/', path.basename(__dirname), '/register/'),
      HttpMethod.POST,
      createUserService,
    );
  }

  public getHandler(): (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => Promise<void> {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { firstName, lastName, email, password } = request.body;

      //validation
      if (!firstName) {
        return next(new errorResponse('User firstName is required!', 403));
      }
      if (!lastName) {
        return next(new errorResponse('User lastName is required!', 403));
      }
      if (!email) {
        return next(new errorResponse('User email is required!', 403));
      }
      if (!password) {
        return next(new errorResponse('User password is required!', 403));
      }

      const input: CreateUserInputDto = {
        firstName,
        lastName,
        email,
        password,
      };

      const output: UserResponseDto =
        await this.createUserService.execute(input);

      this.presentOutput(response, output);
    };
  }

  private presentOutput(response: Response, output: UserResponseDto): void {
    if (output.status === false) {
      response.status(401).json(output);
    } else {
      response.status(201).json(output);
    }
  }
}
