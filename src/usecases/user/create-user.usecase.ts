import { Usecase } from '../usecase';
import { UserGateway } from '@domain/users/gateway/user.gateway';
import {
  CreateUserInputDto,
  CreateUserOutputDto,
  UserResponseDto,
} from 'types/user.types';
import { User } from '@domain/users/entity/user';

export class CreateUserUseCase
  implements Usecase<CreateUserInputDto, UserResponseDto>
{
  private constructor(private readonly userGateway: UserGateway) {
    this.userGateway = userGateway;
  }

  public static create(userGateway: UserGateway): CreateUserUseCase {
    return new CreateUserUseCase(userGateway);
  }

  public async execute({
    firstName,
    lastName,
    email,
    password,
  }: CreateUserInputDto): Promise<UserResponseDto> {
    const user = User.create(firstName, lastName, email, password);
    const aUser = await this.userGateway.save(user);

    const output = this.presentOutput(aUser);
    return output;
  }

  private presentOutput(user: CreateUserOutputDto | null): UserResponseDto {
    if (!user) {
      return {
        status: false,
        message: 'E-mail already in use',
      };
    }
    return {
      status: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        active: user.active,
      },
    };
  }
}
