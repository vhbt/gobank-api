import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Transaction from '@modules/transactions/infra/typeorm/entities/Transaction';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ITransactionsRepository from '../repositories/ITransactionsRepository';

interface Request {
  from_id: string;
  to_id: string;
  value: number;
}

@injectable()
class CreateTransactionService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,
  ) {}

  public async execute({
    from_id,
    to_id,
    value,
  }: Request): Promise<Transaction> {
    const sender = await this.usersRepository.findById(from_id);
    const receiver = await this.usersRepository.findById(to_id);

    if (!sender) {
      throw new AppError('Sender user does not exist.');
    }

    if (!receiver) {
      throw new AppError('Receiver user does not exist.');
    }

    if (sender.id === receiver.id) {
      throw new AppError("You can't send a transaction to yourself.");
    }

    if (value <= 0) {
      throw new AppError('Invalid transaction value.');
    }

    if (sender.balance < value) {
      throw new AppError('Balance is not enough for this transaction.');
    }

    sender.balance -= value;
    receiver.balance += value;

    await this.usersRepository.save(sender);
    await this.usersRepository.save(receiver);

    const transaction = await this.transactionsRepository.create({
      from_id,
      to_id,
      value,
    });

    return transaction;
  }
}

export default CreateTransactionService;
