import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const userData = {
      full_name: 'Vitor Hariel',
      email: 'vitorhariel@example.com',
      password: '123456',
    };

    const user = await createUser.execute(userData);

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with email already in use', async () => {
    const firstUserData = {
      full_name: 'Vitor Hariel',
      email: 'vitorhariel@example.com',
      password: '123456',
    };

    const secondUserData = {
      full_name: 'Keanus Reeves',
      email: 'vitorhariel@example.com',
      password: '123456',
    };

    await createUser.execute(firstUserData);

    await expect(createUser.execute(secondUserData)).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
