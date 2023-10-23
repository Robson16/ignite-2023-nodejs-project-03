import { FakeUsersRepository } from '@/repositories/fake/fake-user-repository'
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { RegisterService } from './register'

describe('Register Service', () => {
  it('should be able to register', async () => {
    const usersRepository = new FakeUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new FakeUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should nor be able to register with email already in use', async () => {
    const usersRepository = new FakeUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const email = 'johndoe@example.com'

    await registerService.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      registerService.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
