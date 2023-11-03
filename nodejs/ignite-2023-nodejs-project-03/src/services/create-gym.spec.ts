import { FakeGymsRepository } from '@/repositories/fake/fake-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymService } from './create-gym'

let gymsRepository: FakeGymsRepository
let sut: CreateGymService // Subject Under Test

describe('Create Gym Service', () => {
  beforeEach(() => {
    gymsRepository = new FakeGymsRepository()
    sut = new CreateGymService(gymsRepository)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'Test Gym',
      description: 'A test gym',
      phone: '+551198888777',
      latitude: -23.169926,
      longitude: -46.8946919,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
