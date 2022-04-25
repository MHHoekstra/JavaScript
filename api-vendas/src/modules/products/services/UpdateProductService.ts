import AppError from '@shared/errors/AppError';
import { AppDataSource } from '@shared/typeorm';
import Product from '../typeorm/entities/Product';

interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

class UpdateProductService {
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IRequest): Promise<Product> {
    const productsRepository = AppDataSource.getRepository(Product);
    const product = await productsRepository.findOneBy({ id });

    if (!product) {
      throw new AppError(`Product with ${id} not found`);
    }

    const productExists = await productsRepository.findOneBy({ name });

    if (productExists && name === product.name) {
      throw new AppError('There is already one product with this name');
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.quantity = quantity ?? product.quantity;

    await productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
