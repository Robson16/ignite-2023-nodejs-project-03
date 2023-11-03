import { FakeGymsRepository } from '@/repositories/fake/fake-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsService } from './fetch-nearby-gyms'

let gymsRepository: FakeGymsRepository
let sut: FetchNearbyGymsService // Subject Under Test

describe('Search Gyms Service', () => {
  beforeEach(async () => {
    gymsRepository = new FakeGymsRepository()
    sut = new FetchNearbyGymsService(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: 'A test gym',
      phone: '+551198888777',
      latitude: -23.169926,
      longitude: -46.8946919,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: 'A test gym',
      phone: '+551198888777',
      latitude: -23.2073001,
      longitude: -46.7917379,
    })

    const { gyms } = await sut.execute({
      userLatitude: -23.169926,
      userLongitude: -46.8946919,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
