export type CreateUserInputDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type CreateUserOutputDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
};

export type CreateUserDataDto = {
  id: string;
  email: string;
  role: string;
  active: boolean;
};

export type UserResponseDto = {
  status: boolean;
  message?: string;
  user?: CreateUserDataDto;
  token?: string;
};

export type LoginUserInputDto = {
  email: string;
  password: string;
};
