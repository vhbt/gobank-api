import { injectable, inject } from 'tsyringe';

import Transaction from '@modules/transactions/infra/typeorm/entities/Transaction';
import ITransactionsRepository from '../repositories/ITransactionsRepository';

interface Request {
  from_id: string;
  to_id: string;
  value: number;
}

@injectable()
class CreateTransactionService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,
  ) {}

  public async execute({
    from_id,
    to_id,
    value,
  }: Request): Promise<Transaction> {
    const transaction = this.transactionsRepository.create({
      from_id,
      to_id,
      value,
    });

    return transaction;
  }
}

export default CreateTransactionService;
