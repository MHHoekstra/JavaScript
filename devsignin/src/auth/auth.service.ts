import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/entities/user.entity';
import { Model } from 'mongoose';
import { sign } from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  public async createAccessToken(userId: string): Promise<string> {
    return sign({ userId }, 'a', { expiresIn: '1d' });
  }

  public async validateUser(userId: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  public returnJwtExtractor(): (request: Request) => string {
    return this.jtwExtractor;
  }

  private jtwExtractor(request: Request): string {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No Authorization Header');
    }

    const [, token] = authHeader.split(' ');

    return token;
  }
}
