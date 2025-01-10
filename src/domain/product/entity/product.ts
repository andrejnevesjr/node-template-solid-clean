export type ProductProps = {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  user_id: string;
};

export class Product {
  private constructor(private readonly props: ProductProps) {}

  public static create(name: string, price: number, user_id: string): Product {
    return new Product({
      name,
      price,
      quantity: 0,
      user_id,
    });
  }

  public static with(props: ProductProps): Product {
    return new Product(props);
  }

  public get name() {
    return this.props.name;
  }

  public get price() {
    return this.props.price;
  }

  public get quantity() {
    return this.props.quantity;
  }

  public get user_id() {
    return this.props.user_id;
  }

  public get id() {
    return this.props.id;
  }
}
