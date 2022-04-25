import AppError from '@shared/errors/AppError';
import { AppDataSource } from '@shared/typeorm';
import { hash } from 'bcryptjs';
import User from '../typeorm/entities/Users';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: IRequest): Promise<User> {
    const usersRepository = AppDataSource.getRepository(User);
    const userExists = await usersRepository.findOneBy({ email });

    if (userExists) {
      throw new AppError('There is already one user with this email');
    }
    const encryptedPass = await hash(password, 8);
    const user = usersRepository.create({
      name,
      email,
      password: encryptedPass,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
