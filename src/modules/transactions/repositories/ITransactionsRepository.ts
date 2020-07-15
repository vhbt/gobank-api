import Transaction from '../infra/typeorm/entities/Transaction';
import ICreateTransactionDTO from '../dtos/ICreateTransactionDTO';
import IListUserTransactionsDTO from '../dtos/IListUserTransactionsDTO';

export default interface ITransactionsRepository {
  create(data: ICreateTransactionDTO): Promise<Transaction>;
  findAllTransactions(data: IListUserTransactionsDTO): Promise<Transaction[]>;
}
