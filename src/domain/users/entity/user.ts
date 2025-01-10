import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import Logger from '@package/logger/logger';
import { Role } from '@prisma/client';

export type UserProps = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: Role;
  active?: boolean;
  resetPasswordToken?: string | null;
  resetPasswordExpire?: Date | null;
};

interface DecodedToken {
  id: string;
}

export interface IUser {
  comparePassword: (enteredPassword: string) => Promise<boolean>;
  generateToken: (id: string) => string;
  getResetPasswordToken: () => string;
}

export class User implements IUser {
  private constructor(private readonly props: UserProps) {}

  public static create(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): User {
    return new User({
      firstName,
      lastName,
      email,
      password,
      role: Role.USER,
      active: false,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    });
  }

  public static with(props: UserProps): User {
    return new User(props);
  }

  public get firstName() {
    return this.props.firstName;
  }

  public get lastName() {
    return this.props.lastName;
  }

  public get email() {
    return this.props.email;
  }

  public get role() {
    return this.props.role;
  }

  public get active() {
    return this.props.active;
  }

  public get id() {
    return this.props.id;
  }

  public async encryptPassword(): Promise<string> {
    return await bcrypt.hash(this.props.password, 10);
  }

  public async comparePassword(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.props.password);
  }

  public generateToken(id: string): string {
    const secretKey = process.env.JWT_SECRET_KEY;
    const expirationKeyTime = Number(process.env.JWT_EXPIRATION_TIME);
    if (!secretKey) {
      Logger.error('JWT_SECRET_KEY is not defined');
      throw new Error('JWT_SECRET_KEY is not defined');
    }
    const accessToken = jwt.sign({ id: id }, secretKey, {
      expiresIn: expirationKeyTime,
    });

    return accessToken;
  }

  public getResetPasswordToken(): string {
    //generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    //hash token and set to resetPasswordToken
    this.props.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    //set expire
    this.props.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
  }

  public static verifyToken(token: string): {
    status: boolean;
    decoded?: DecodedToken;
    error?: Error;
  } {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string,
      ) as DecodedToken;
      return {
        status: true,
        decoded,
      };
    } catch (error: unknown) {
      return {
        status: false,
        error: error as Error,
      };
    }
  }
}
