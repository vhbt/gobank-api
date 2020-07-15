import { getRepository, Repository } from 'typeorm';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';
import ICreateTransactionDTO from '@modules/transactions/dtos/ICreateTransactionDTO';
import IListUserTransactionsDTO from '@modules/transactions/dtos/IListUserTransactionsDTO';

import Transaction from '../entities/Transaction';

class TransactionsRepository implements ITransactionsRepository {
  private ormRepository: Repository<Transaction>;

  constructor() {
    this.ormRepository = getRepository(Transaction);
  }

  public async create({
    from_id,
    to_id,
    value,
  }: ICreateTransactionDTO): Promise<Transaction> {
    const transaction = this.ormRepository.create({ from_id, to_id, value });

    await this.ormRepository.save(transaction);

    return transaction;
  }

  public async findAllTransactions({
    user_id,
  }: IListUserTransactionsDTO): Promise<Transaction[]> {
    const transactions = await this.ormRepository.find({
      where: [{ from_id: user_id }, { to_id: user_id }],
      order: { created_at: 'DESC' },
    });

    return transactions;
  }
}

export default TransactionsRepository;
