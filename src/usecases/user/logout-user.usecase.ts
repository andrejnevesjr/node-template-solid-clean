import { Usecase } from '../usecase';
import { UserGateway } from '@domain/users/gateway/user.gateway';
import { CreateUserInputDto, UserResponseDto } from 'types/user.types';

export class LogoutUserUseCase
  implements Usecase<CreateUserInputDto, UserResponseDto>
{
  private constructor(private readonly userGateway: UserGateway) {
    this.userGateway = userGateway;
  }

  public static create(userGateway: UserGateway): LogoutUserUseCase {
    return new LogoutUserUseCase(userGateway);
  }

  public async execute(): Promise<UserResponseDto> {
    const logoutResponse = await this.userGateway.logout();

    return logoutResponse;
  }
}
