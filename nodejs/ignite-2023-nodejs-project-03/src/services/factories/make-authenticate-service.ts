import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateService } from '../authenticate'

export function makeAuthenticateService() {
  const userRepository = new PrismaUsersRepository()
  const service = new AuthenticateService(userRepository)

  return service
}
