import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

interface Request {
  user_id: string;
}

interface Response {
  balance: number;
}

@injectable()
class ShowUserBalanceService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: Request): Promise<Response> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    return { balance: user.balance };
  }
}

export default ShowUserBalanceService;
