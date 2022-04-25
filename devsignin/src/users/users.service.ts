import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { SigninDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (userExists) {
      throw new UnauthorizedException('Email already in use');
    }
    const user = new this.userModel(createUserDto);
    user.password = await bcrypt.hash(user.password, 10);
    return user.save();
  }

  async signin(
    signinDto: SigninDto,
  ): Promise<{ name: string; jwtToken: string; email: string }> {
    const user = await this.userModel.findOne({ email: signinDto.email });
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    const match = await bcrypt.compare(signinDto.password, user.password);
    if (!match) {
      throw new NotFoundException('Invalid credentials');
    }

    const jwtToken = await this.authService.createAccessToken(
      user._id.toString(),
    );

    return { name: user.name, jwtToken, email: user.email };
  }

  async findAll() {
    return this.userModel.find();
  }
}
