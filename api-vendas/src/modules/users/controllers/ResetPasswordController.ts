import { Request, Response } from 'express';
import ResetPasswordService from '../services/ResetPasswordService';

export default class ResetPasswordController {
  public async reset(request: Request, response: Response) {
    const { password, token } = request.body;

    const resetPassword = new ResetPasswordService();

    const user = await resetPassword.execute({ password, token });

    return response.json(user);
  }
}
