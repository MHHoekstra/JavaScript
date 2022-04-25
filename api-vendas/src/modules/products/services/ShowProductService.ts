import AppError from '@shared/errors/AppError';
import { AppDataSource } from '@shared/typeorm';
import Product from '../typeorm/entities/Product';

interface IRequest {
  id: string;
}

class ShowProductService {
  public async execute({ id }: IRequest): Promise<Product> {
    const productsRepository = AppDataSource.getRepository(Product);
    const product = await productsRepository.findOneBy({ id });

    if (!product) {
      throw new AppError(`Product with id ${id} not found`);
    }

    return product;
  }
}

export default ShowProductService;
