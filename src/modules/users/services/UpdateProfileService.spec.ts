import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update email', async () => {
    const user = await fakeUsersRepository.create({
      full_name: 'Vitor Hariel',
      email: 'vitorhariel@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      email: 'vitor@gobank.com.br',
    });

    expect(updatedUser).toMatchObject({
      email: 'vitor@gobank.com.br',
    });
  });

  it('should not be able to update email to already existent one', async () => {
    await fakeUsersRepository.create({
      full_name: 'Vitor Hariel B. Tubino',
      email: 'vitor@gobank.com.br',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      full_name: 'Vitor Hariel',
      email: 'vitorhariel@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'vitor@gobank.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      full_name: 'Vitor Hariel',
      email: 'vitorhariel@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      email: 'vitor@gobank.com.br',
      old_password: '123456',
      password: '654321',
    });

    expect(updatedUser).toMatchObject({
      email: 'vitor@gobank.com.br',
      password: '654321',
    });
  });

  it('should not be able to update password without old password', async () => {
    const user = await fakeUsersRepository.create({
      full_name: 'Vitor Hariel',
      email: 'vitorhariel@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'vitor@gobank.com.br',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      full_name: 'Vitor Hariel',
      email: 'vitorhariel@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        old_password: 'wrong-old-password',
        email: 'vitor@gobank.com.br',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update profile ofinexistent user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'inexistent-id',
        old_password: '123456',
        email: 'vitor@gobank.com.br',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
