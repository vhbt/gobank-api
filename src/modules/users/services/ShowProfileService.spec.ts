import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      full_name: 'Vitor Hariel',
      email: 'vitorhariel@example.com',
      password: '123456',
    });

    const showProfile = await showProfileService.execute({
      user_id: user.id,
    });

    expect(showProfile).toMatchObject({
      full_name: 'Vitor Hariel',
      email: 'vitorhariel@example.com',
    });
  });

  it('should not be able to show the profile of inexistent user', async () => {
    await expect(
      showProfileService.execute({
        user_id: 'inexistent-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
