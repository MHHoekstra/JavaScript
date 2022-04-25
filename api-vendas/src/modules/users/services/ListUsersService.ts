import { AppDataSource } from '@shared/typeorm';
import User from '../typeorm/entities/Users';

class ListUsersService {
  public async execute(): Promise<User[]> {
    const usersRepository = AppDataSource.getRepository(User);
    const users = await usersRepository.find();

    return users;
  }
}

export default ListUsersService;
