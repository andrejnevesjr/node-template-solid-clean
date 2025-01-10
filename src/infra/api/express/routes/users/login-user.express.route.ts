import { NextFunction, Request, Response } from 'express';
import { HttpMethod, Route } from '../routes';
import { errorResponse } from '@package/exceptions-handler/error.response';
import { UserResponseDto, LoginUserInputDto } from 'types/user.types';
import path from 'path';
import { LoginUserUseCase } from '@usecases/user/login-user.usecase';

interface TokenOptions {
  maxAge: number;
  httpOnly: boolean;
  secure?: boolean;
}

export class LoginUserRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly loginUserService: LoginUserUseCase,
  ) {}

  getPath(): string {
    return this.path;
  }
  getMethod(): HttpMethod {
    return this.method;
  }

  public static create(createUserService: LoginUserUseCase): LoginUserRoute {
    return new LoginUserRoute(
      path.join('/', path.basename(__dirname), '/login/'),
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
      const { email, password } = request.body;

      if (!email) {
        return next(new errorResponse('User email is required!', 403));
      }
      if (!password) {
        return next(new errorResponse('User password is required!', 403));
      }

      const input: LoginUserInputDto = {
        email,
        password,
      };

      const output: UserResponseDto =
        await this.loginUserService.execute(input);

      this.presentOutput(response, output);
    };
  }

  private presentOutput(response: Response, output: UserResponseDto): void {
    if (output.status === false) {
      response.status(401).json(output);
    } else {
      const options: TokenOptions = { maxAge: 60 * 60 * 1000, httpOnly: true };

      if (process.env.NODE_ENV === 'production') {
        options.secure = true;
      }
      response.status(200).cookie('token', output.token, options).json({
        success: true,
        user: output.user,
      });
    }
  }
}
