import AppError from '@shared/errors/AppError';
import { AppDataSource } from '@shared/typeorm';
import Product from '../typeorm/entities/Product';

interface IRequest {
  id: string;
}

class DeleteProductService {
  public async execute({ id }: IRequest): Promise<void> {
    const productsRepository = AppDataSource.getRepository(Product);
    const product = await productsRepository.findOneBy({ id });

    if (!product) {
      throw new AppError(`Product with ${id} not found`);
    }

    await productsRepository.remove(product);
  }
}

export default DeleteProductService;
