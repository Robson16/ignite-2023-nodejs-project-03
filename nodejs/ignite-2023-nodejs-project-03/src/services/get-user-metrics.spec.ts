import { FakeCheckInsRepository } from '@/repositories/fake/fake-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserMetricsService } from './get-user-metrics'

let checkInsRepository: FakeCheckInsRepository
let sut: GetUserMetricsService // Subject Under Test

describe('Get User MEtrics Service', () => {
  beforeEach(async () => {
    checkInsRepository = new FakeCheckInsRepository()
    sut = new GetUserMetricsService(checkInsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-02',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
