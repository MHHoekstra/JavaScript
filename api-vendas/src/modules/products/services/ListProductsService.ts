import { AppDataSource } from '@shared/typeorm';
import Product from '../typeorm/entities/Product';

class ListProductsService {
  public async execute(): Promise<Product[]> {
    const productsRepository = AppDataSource.getRepository(Product);
    const products = await productsRepository.find();

    return products;
  }
}

export default ListProductsService;
