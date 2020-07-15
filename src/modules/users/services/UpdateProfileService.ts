import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface Request {
  user_id: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    email,
    old_password,
    password,
  }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exist.');
    }

    const userWithEmail = await this.usersRepository.findByEmail(email);

    if (userWithEmail && userWithEmail.id !== user_id) {
      throw new AppError('Email already in use.');
    }

    if (password) {
      if (!old_password) {
        throw new AppError('Current password was not informed.');
      }

      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Wrong current password.');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    user.email = email;

    return this.usersRepository.save(user);
  }
}

export default UpdateUserAvatarService;
