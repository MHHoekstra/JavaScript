import AppError from '@shared/errors/AppError';
import { AppDataSource } from '@shared/typeorm';
import Product from '../typeorm/entities/Product';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

class CreateProductService {
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productsRepository = AppDataSource.getRepository(Product);
    const productExists = await productsRepository.findOneBy({ name });

    if (productExists) {
      throw new AppError('There is already one product with this name');
    }

    const product = productsRepository.create({ name, price, quantity });

    await productsRepository.save(product);

    return product;
  }
}

export default CreateProductService;
