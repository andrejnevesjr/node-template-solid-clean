import { Product } from '../entity/product';

export interface ProductGateway {
  save(product: Product): Promise<boolean>;
  update(product: Product): Promise<void>;
  delete(productId: string): Promise<void>;
  findById(productId: string): Promise<Product | null>;
  findByName(productName: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
}
