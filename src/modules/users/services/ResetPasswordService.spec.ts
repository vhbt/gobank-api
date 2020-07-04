import { uuid } from 'uuidv4';

import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset password if the token is valid', async () => {
    const user = await fakeUsersRepository.create({
      full_name: 'Vitor Hariel',
      email: 'vitorhariel@example.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      password: '654321',
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('654321');
    expect(updatedUser?.password).toBe('654321');
  });

  it('should not be able to reset password if token is invalid', async () => {
    await fakeUsersRepository.create({
      full_name: 'Vitor Hariel',
      email: 'vitorhariel@example.com',
      password: '123456',
    });

    await expect(
      resetPasswordService.execute({
        password: '654321',
        token: uuid(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password if user is inexistent', async () => {
    const inexistentUserId = uuid();

    const { token } = await fakeUserTokensRepository.generate(inexistentUserId);

    await expect(
      resetPasswordService.execute({
        password: '654321',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not ble able to reset password if token is more than 2 hours old', async () => {
    const user = await fakeUsersRepository.create({
      full_name: 'Vitor Hariel',
      email: 'vitorhariel@example.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        password: '654321',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
