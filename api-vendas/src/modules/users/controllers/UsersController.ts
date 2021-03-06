import { Request, Response } from 'express';
import CreateUserService from '../services/CreateUserService';
import ListUsersService from '../services/ListUsersService';

export default class UsersController {
  public async index(request: Request, response: Response) {
    const listUsers = new ListUsersService();

    const users = await listUsers.execute();

    return response.json(users);
  }

  public async create(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({ name, email, password });

    return response.json(user);
  }
}
