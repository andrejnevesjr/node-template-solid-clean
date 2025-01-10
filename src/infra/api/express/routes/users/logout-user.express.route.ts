import { NextFunction, Request, Response } from 'express';
import { HttpMethod, Route } from '../routes';
import path from 'path';
import { LogoutUserUseCase } from '@usecases/user/logout-user.usecase';

export class LogoutUserRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly logoutUserService: LogoutUserUseCase,
  ) {}

  getPath(): string {
    return this.path;
  }
  getMethod(): HttpMethod {
    return this.method;
  }

  public static create(logoutUserService: LogoutUserUseCase): LogoutUserRoute {
    return new LogoutUserRoute(
      path.join('/', path.basename(__dirname), '/logout/'),
      HttpMethod.POST,
      logoutUserService,
    );
  }

  public getHandler(): (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => Promise<void> {
    return async (request: Request, response: Response) => {
      this.presentOutput(response);
    };
  }

  private presentOutput(response: Response): void {
    response.clearCookie('token');
    response.status(200);
    response.json({
      success: true,
      message: 'logged out',
    });
  }
}
