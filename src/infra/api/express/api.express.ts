/* eslint-disable @typescript-eslint/no-explicit-any */
import { Api } from '../api';
import express, { Express } from 'express';
import { Route } from './routes/routes';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookierParser from 'cookie-parser';
import cors from 'cors';
import morganMiddleware from '@package/morgan/morgan.middleware';
import rateLimit from 'express-rate-limit';

export class ApiExpress implements Api {
  private app: Express;

  private constructor(routes: Route[]) {
    this.app = express();
    this.app.use(express.json());
    // Use Helmet to secure Express app by setting various HTTP headers
    this.app.use(helmet());
    // Limit Size of Request Body
    this.app.use(bodyParser.json({ limit: '5mb' }));
    this.app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
    // Cookier Parser
    this.app.use(cookierParser());
    // Enable CORS with various options
    this.app.use(cors());
    // Use Morgan middleware for logging requests
    this.app.use(morganMiddleware);

    // Rate Limiting
    this.app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      }),
    );

    this.addRoutes(routes);
  }

  public getApp(): Express {
    return this.app;
  }

  public static create(routes: Route[]): ApiExpress {
    return new ApiExpress(routes);
  }

  private addRoutes(routes: Route[]) {
    routes.forEach((route) => {
      const path = route.getPath();
      const method = route.getMethod();
      const handler = route.getHandler();

      this.app[method](path, handler);
    });
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      this.listRoutes();
    });
  }

  private listRoutes() {
    const routes = this.app._router.stack
      .filter((r: any) => r.route)
      .map((r: any) => {
        return {
          path: r.route.path,
          method: r.route.stack[0].method,
        };
      });
    console.log('Routes:', routes);
  }
}
