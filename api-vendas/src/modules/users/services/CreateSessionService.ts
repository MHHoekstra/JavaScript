import AppError from '@shared/errors/AppError';
import { AppDataSource } from '@shared/typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import User from '../typeorm/entities/Users';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  token: string;
}

class CreateSessionService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = AppDataSource.getRepository(User);

    const user = await usersRepository.findOneBy({ email });

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const passwordConfirmed = await compare(password, user.password);

    if (!passwordConfirmed) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { token };
  }
}

export default CreateSessionService;
