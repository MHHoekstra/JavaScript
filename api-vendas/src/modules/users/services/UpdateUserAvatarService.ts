import AppError from '@shared/errors/AppError';
import { AppDataSource } from '@shared/typeorm';
import path from 'path';
import User from '../typeorm/entities/Users';
import uploadConfig from '@config/upload';
import fs from 'fs';

interface IRequest {
  userId: string;
  avatarFilename: string | undefined;
}

class UpdateUserAvatarService {
  public async execute({ avatarFilename, userId }: IRequest): Promise<User> {
    const usersRepository = AppDataSource.getRepository(User);

    if (!avatarFilename) {
      throw new AppError('Filename not found');
    }

    const user = await usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new AppError('User not found');
    }

    if (user.avatar) {
      const userAvatarFilepath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilepath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilepath);
      }
    }
    user.avatar = avatarFilename;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
