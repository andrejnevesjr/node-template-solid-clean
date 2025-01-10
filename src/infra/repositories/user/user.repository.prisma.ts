/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoginUserInputDto, UserResponseDto } from 'types/user.types';
import { User, UserProps } from '@domain/users/entity/user';
import { UserGateway } from '@domain/users/gateway/user.gateway';
import Logger from '@package/logger/logger';
import { PrismaClient } from '@prisma/client';

export class UserRepositoryPrisma implements UserGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public async findByEmail(email: string): Promise<User | UserResponseDto> {
    const user = await this.prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      Logger.error('User - Repository - email not found');
      return {
        status: false,
        message: 'Error - Invalid credentials',
      };
    }

    const foundUser = User.with({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      role: user.role,
      active: user.active,
    });

    return foundUser;
  }

  update(user: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(userId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findByName(usermame: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  public static create(prismaClient: PrismaClient): UserRepositoryPrisma {
    return new UserRepositoryPrisma(prismaClient);
  }

  public async save(user: User): Promise<any> {
    const hashedPassword = await user.encryptPassword();

    const newUser: UserProps = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: hashedPassword,
    };

    const userExists = await this.prismaClient.user.findFirst({
      where: {
        email: newUser.email,
      },
    });

    if (userExists) {
      Logger.error('User - Repository - User already exists');
      return null;
    }

    const createdUser = await this.prismaClient.user.create({
      data: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        password: newUser.password,
      },
    });
    return createdUser;
  }

  public async findAll(): Promise<User[]> {
    const users = await this.prismaClient.user.findMany();

    const userList = users.map((p) => {
      const user = User.with({
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        password: p.password,
        role: p.role,
        active: p.active,
      });
      return user;
    });

    return userList;
  }

  public async login(
    foundUser: User,
    userCredentials: LoginUserInputDto,
  ): Promise<UserResponseDto> {
    if (foundUser instanceof User) {
      const isMatch = await foundUser.comparePassword(userCredentials.password);

      if (!isMatch) {
        return {
          status: false,
          message: 'Error - Invalid credentials',
        };
      }

      if (!foundUser.id || !foundUser.role || !('active' in foundUser)) {
        Logger.error('User prop id, active status or role not found');
        throw new Error('User prop not found');
      }

      const token = foundUser.generateToken(foundUser.id);

      return {
        status: true,
        user: {
          id: foundUser.id,
          email: foundUser.email,
          role: foundUser.role,
          active: foundUser.active ?? false,
        },
        token: token,
      };
    }

    return {
      status: false,
      message: 'Invalid user type',
    };
  }

  public async logout(): Promise<UserResponseDto> {
    return await {
      status: true,
      message: 'Info - User logged out',
    };
  }

  public async findById(id: string): Promise<User | UserResponseDto> {
    const user = await this.prismaClient.user.findUnique({
      where: { id },
    });

    if (!user) {
      Logger.error('User - Repository - Id not found');
      return {
        status: false,
        message: 'Error - User not found',
      };
    }

    const foundUser = User.with({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      role: user.role,
      active: user.active,
    });

    return foundUser;
  }

  public async isAuthenticated(token: string): Promise<UserResponseDto> {
    const isTokenValid = User.verifyToken(token);

    if (!isTokenValid.status === true) {
      Logger.error('User - JWT Decoded - User not found');
      return {
        status: false,
      };
    }

    const userFound = await this.prismaClient.user.findUnique({
      where: { id: isTokenValid.decoded?.id },
    });

    if (!userFound) {
      Logger.error('User - JWT Decoded - User not found');
      return {
        status: false,
      };
    }

    return {
      status: true,
      user: {
        id: userFound.id,
        email: userFound.email,
        role: userFound.role,
        active: userFound.active,
      },
    };
  }
}
