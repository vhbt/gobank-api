import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeTransactionsRepository from '../repositories/fakes/FakeTransactionsRepository';
import CreateTransactionService from './CreateTransactionService';

let fakeTransactionsRepository: FakeTransactionsRepository;
let fakeUsersRepository: FakeUsersRepository;
let createTransaction: CreateTransactionService;

describe('CreateTransaction', () => {
  beforeEach(() => {
    fakeTransactionsRepository = new FakeTransactionsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    createTransaction = new CreateTransactionService(
      fakeUsersRepository,
      fakeTransactionsRepository,
    );
  });

  it('should be able to create a new transaction', async () => {
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

    const transaction = await createTransaction.execute({
      from_id: user1.id,
      to_id: user2.id,
      value: 100000,
    });

    expect(transaction).toMatchObject({
      from_id: user1.id,
      to_id: user2.id,
      value: 100000,
    });
  });

  it('should not be able to create a new transaction if the value is invalid', async () => {
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

    await expect(
      createTransaction.execute({
        from_id: user1.id,
        to_id: user2.id,
        value: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new transaction if user does not exist', async () => {
    const user = await fakeUsersRepository.create({
      full_name: 'User',
      email: 'user@example.com',
      password: '12345',
    });

    await expect(
      createTransaction.execute({
        from_id: 'inexistent-id',
        to_id: user.id,
        value: 1000,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createTransaction.execute({
        from_id: user.id,
        to_id: 'inexistent-id',
        value: 1000,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new transaction to yourself', async () => {
    const user = await fakeUsersRepository.create({
      full_name: 'User Two',
      email: 'usertwo@example.com',
      password: '12345',
    });

    await expect(
      createTransaction.execute({
        from_id: user.id,
        to_id: user.id,
        value: 1000,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new transaction if value is higher than users balance', async () => {
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

    jest
      .spyOn(fakeUsersRepository, 'findById')
      .mockResolvedValueOnce({ ...user1, balance: 50000 });

    await expect(
      createTransaction.execute({
        from_id: user1.id,
        to_id: user2.id,
        value: 100000,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
