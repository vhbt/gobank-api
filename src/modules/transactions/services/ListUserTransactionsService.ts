import { injectable, inject } from 'tsyringe';

import Transaction from '../infra/typeorm/entities/Transaction';
import IListUserTransactionsDTO from '../dtos/IListUserTransactionsDTO';
import TransactionsRepository from '../repositories/ITransactionsRepository';

@injectable()
class ListUserTransactionsService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: TransactionsRepository,
  ) {}

  public async execute({
    user_id,
  }: IListUserTransactionsDTO): Promise<Transaction[]> {
    const transactions = await this.transactionsRepository.findAllTransactions({
      user_id,
    });

    return transactions;
  }
}

export default ListUserTransactionsService;
