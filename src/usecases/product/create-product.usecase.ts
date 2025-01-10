import { Product } from '@domain/product/entity/product';
import { ProductGateway } from '@domain/product/gateway/product.gateway';
import { Usecase } from '../usecase';
import {
  CreateProductInputDto,
  CreateProductOutputDto,
} from 'types/product.types';
import { UserGateway } from '@domain/users/gateway/user.gateway';
import { UserResponseDto } from 'types/user.types';
import { User } from '@domain/users/entity/user';

export class CreateProductUseCase
  implements Usecase<CreateProductInputDto, CreateProductOutputDto>
{
  private constructor(
    private readonly productGateway: ProductGateway,
    private readonly userGateway: UserGateway,
  ) {
    this.productGateway = productGateway;
    this.userGateway = userGateway;
  }

  public static create(
    productGateway: ProductGateway,
    userGateway: UserGateway,
  ): CreateProductUseCase {
    return new CreateProductUseCase(productGateway, userGateway);
  }

  public async execute({
    name,
    price,

    token,
  }: CreateProductInputDto): Promise<CreateProductOutputDto | UserResponseDto> {
    const checkAuthUser = await this.userGateway.isAuthenticated(token);

    if (checkAuthUser.status === false) {
      return {
        status: false,
        message:
          'Something went wrong while checking your credentials, please try again!',
      };
    } else {
      if (!checkAuthUser.user) {
        return {
          status: false,
          message: 'User not found',
        };
      }

      const isUserFound = await this.userGateway.findById(
        checkAuthUser.user.id,
      );

      if (!(isUserFound instanceof User)) {
        return isUserFound;
      }

      const product = Product.create(name, price, isUserFound.id as string);

      const aProduct = await this.productGateway.save(product);

      if (aProduct.status === false) {
        return {
          status: false,
          message: 'Product already exists',
        };
      }
      return aProduct;
    }
  }
}
