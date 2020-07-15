import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeTransactionsRepository from '../repositories/fakes/FakeTransactionsRepository';
import CreateTransactionService from './CreateTransactionService';
import ListUserTransactionsService from './ListUserTransactionsService';

let fakeUsersRepository: FakeUsersRepository;
let fakeTransactionsRepository: FakeTransactionsRepository;
let createTransaction: CreateTransactionService;
let listUserTransactions: ListUserTransactionsService;

describe('CreateTransaction', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeTransactionsRepository = new FakeTransactionsRepository();
    createTransaction = new CreateTransactionService(
      fakeUsersRepository,
      fakeTransactionsRepository,
    );
    listUserTransactions = new ListUserTransactionsService(
      fakeTransactionsRepository,
    );
  });

  it('should be able to list the user transactions', async () => {
    const user1 = await fakeUsersRepository.create({
      full_name: 'User One',
      email: 'userone@example.com',
      password: '12345',
    });

    const user2 = await fakeUsersRepository.create({
      full_name: 'User Two',
      email: 'usertwo@example.com',
      password: '12345',
    });

    const user3 = await fakeUsersRepository.create({
      full_name: 'User Three',
      email: 'userthree@example.com',
      password: '12345',
    });

    const transaction1 = await createTransaction.execute({
      from_id: user1.id,
      to_id: user2.id,
      value: 100000,
    });

    const transaction2 = await createTransaction.execute({
      from_id: user2.id,
      to_id: user3.id,
      value: 100000,
    });

    const transactions_user1 = await listUserTransactions.execute({
      user_id: user1.id,
    });

    const transactions_user2 = await listUserTransactions.execute({
      user_id: user2.id,
    });

    expect(transactions_user1).toEqual([transaction1]);
    expect(transactions_user2).toEqual([transaction1, transaction2]);
  });
});
