import { FakeGymsRepository } from '@/repositories/fake/fake-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsService } from './search-gyms'

let gymsRepository: FakeGymsRepository
let sut: SearchGymsService // Subject Under Test

describe('Search Gyms Service', () => {
  beforeEach(async () => {
    gymsRepository = new FakeGymsRepository()
    sut = new SearchGymsService(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'JavaScript Gym',
      description: 'A test gym',
      phone: '+551198888777',
      latitude: -23.169926,
      longitude: -46.8946919,
    })

    await gymsRepository.create({
      title: 'TypeScript Gym',
      description: 'A test gym',
      phone: '+551198888777',
      latitude: -23.169926,
      longitude: -46.8946919,
    })

    const { gyms } = await sut.execute({
      query: 'JavaScript Gym',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript Gym' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Gym ${i}`,
        description: 'A test gym',
        phone: '+551198888777',
        latitude: -23.169926,
        longitude: -46.8946919,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym 21' }),
      expect.objectContaining({ title: 'Gym 22' }),
    ])
  })
})
