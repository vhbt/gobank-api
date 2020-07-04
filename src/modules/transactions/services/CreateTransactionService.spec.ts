import { uuid } from 'uuidv4';
import FakeTransactionsRepository from '../repositories/fakes/FakeTransactionsRepository';
import CreateTransactionService from './CreateTransactionService';

describe('CreateTransaction', () => {
  it('should be able to create a new transaction', async () => {
    const fakeTransactionsRepository = new FakeTransactionsRepository();

    const createTransaction = new CreateTransactionService(
      fakeTransactionsRepository,
    );

    const transactionData = {
      from_id: uuid(),
      to_id: uuid(),
      value: 100000,
    };

    const transaction = await createTransaction.execute(transactionData);

    expect(transaction).toMatchObject(transactionData);
  });
});
