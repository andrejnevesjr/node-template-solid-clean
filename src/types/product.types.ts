export type ProductResponseDto = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  user_id: string;
};

export type CreateProductInputDto = {
  name: string;
  price: number;
  token: string;
};

export type CreateProductOutputDto = {
  status: boolean;
  message?: string;
  product?: ProductResponseDto;
  user_id?: string;
};

export type ListProductResponseDto = {
  products: {
    name: string;
    price: number;
    user_id: string;
  }[];
};
