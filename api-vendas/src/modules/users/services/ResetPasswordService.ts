import AppError from '@shared/errors/AppError';
import { AppDataSource } from '@shared/typeorm';
import { hash } from 'bcryptjs';
import { isAfter, addHours } from 'date-fns';
import User from '../typeorm/entities/Users';
import UserToken from '../typeorm/entities/UserToken';

interface IRequest {
  token: string;
  password: string;
}

class ResetPasswordService {
  public async execute({ password, token }: IRequest): Promise<User> {
    const usersRepository = AppDataSource.getRepository(User);
    const userTokenRepository = AppDataSource.getRepository(UserToken);

    const userToken = await userTokenRepository.findOneBy({ token });

    if (!userToken) {
      throw new AppError('User Token does not exists');
    }

    const user = await usersRepository.findOneBy({
      id: userToken.user_id,
    });

    if (!user) {
      throw new AppError('User does not exists');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired');
    }
    const encryptedPass = await hash(password, 8);

    user.password = encryptedPass;

    await userTokenRepository.remove(userToken);
    await usersRepository.save(user);

    return user;
  }
}

export default ResetPasswordService;
