import { Usecase } from '../usecase';
import { UserGateway } from '@domain/users/gateway/user.gateway';
import {
  CreateUserInputDto,
  UserResponseDto,
  LoginUserInputDto,
} from 'types/user.types';
import { User } from '@domain/users/entity/user';

export class LoginUserUseCase
  implements Usecase<CreateUserInputDto, UserResponseDto>
{
  private constructor(private readonly userGateway: UserGateway) {
    this.userGateway = userGateway;
  }

  public static create(userGateway: UserGateway): LoginUserUseCase {
    return new LoginUserUseCase(userGateway);
  }

  public async execute({
    email,
    password,
  }: LoginUserInputDto): Promise<UserResponseDto> {
    const user = { email, password };

    const foundUser = await this.userGateway.findByEmail(user.email);

    if (!(foundUser instanceof User)) {
      return foundUser;
    }
    const loginResponse = await this.userGateway.login(foundUser, user);

    return loginResponse;
  }
}
