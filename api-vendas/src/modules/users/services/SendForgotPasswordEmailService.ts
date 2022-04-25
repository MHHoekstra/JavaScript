import EtherealMail from '@config/EtherealMail';
import AppError from '@shared/errors/AppError';
import { AppDataSource } from '@shared/typeorm';
import User from '../typeorm/entities/Users';
import UserToken from '../typeorm/entities/UserToken';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const usersRepository = AppDataSource.getRepository(User);
    const userTokenRepository = AppDataSource.getRepository(UserToken);

    const user = await usersRepository.findOneBy({ email });

    if (!user) {
      throw new AppError('User does not exists');
    }

    const userToken = userTokenRepository.create();
    userToken.user_id = user.id;

    const savedToken = await userTokenRepository.save(userToken);
    await EtherealMail.sendMail({
      to: user.email,
      body: `Solicitaçao de recuperaçao de senha recebida: ${savedToken.token}`,
    });
  }
}

export default SendForgotPasswordEmailService;
