import {
  CreateUserOutputDto,
  LoginUserInputDto,
  UserResponseDto,
} from 'types/user.types';
import { User } from '../entity/user';

export interface UserGateway {
  save(user: User): Promise<CreateUserOutputDto | null>;

  update(user: User): Promise<void>;

  delete(userId: string): Promise<void>;

  findByEmail(email: string): Promise<User | UserResponseDto>;

  findById(id: string): Promise<User | UserResponseDto>;

  findByName(firstName: string): Promise<User | null>;

  login(
    foundUser: User,
    userCredentials: LoginUserInputDto,
  ): Promise<UserResponseDto>;

  logout(): Promise<UserResponseDto>;

  isAuthenticated(token: string): Promise<UserResponseDto>;
}
