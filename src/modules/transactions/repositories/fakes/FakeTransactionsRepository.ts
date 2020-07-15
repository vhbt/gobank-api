import { uuid } from 'uuidv4';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';
import ICreateTransactionDTO from '@modules/transactions/dtos/ICreateTransactionDTO';
import IListUserTransactionsDTO from '@modules/transactions/dtos/IListUserTransactionsDTO';

import Transaction from '../../infra/typeorm/entities/Transaction';

class TransactionsRepository implements ITransactionsRepository {
  private transactions: Transaction[] = [];

  public async create({
    from_id,
    to_id,
    value,
  }: ICreateTransactionDTO): Promise<Transaction> {
    const transaction = new Transaction();

    Object.assign(transaction, { id: uuid(), from_id, to_id, value });

    this.transactions.push(transaction);

    return transaction;
  }

  public async findAllTransactions({
    user_id,
  }: IListUserTransactionsDTO): Promise<Transaction[]> {
    const transactions = this.transactions.filter(
      transaction =>
        transaction.from_id === user_id || transaction.to_id === user_id,
    );

    return transactions;
  }
}

export default TransactionsRepository;
