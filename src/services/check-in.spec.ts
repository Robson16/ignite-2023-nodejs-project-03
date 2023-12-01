import { FakeCheckInsRepository } from '@/repositories/fake/fake-check-ins-repository'
import { FakeGymsRepository } from '@/repositories/fake/fake-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInService } from './check-in'
import { MaxNumbersOfCheckInsError } from './errors/max-numbers-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: FakeCheckInsRepository
let gymsRepository: FakeGymsRepository
let sut: CheckInService // Subject Under Test

describe('Check-In Service', () => {
  beforeEach(async () => {
    checkInsRepository = new FakeCheckInsRepository()
    gymsRepository = new FakeGymsRepository()
    sut = new CheckInService(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Test Gym',
      description: '',
      phone: '',
      latitude: -23.169926,
      longitude: -46.8946919,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.169926,
      userLongitude: -46.8946919,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.169926,
      userLongitude: -46.8946919,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -23.169926,
        userLongitude: -46.8946919,
      }),
    ).rejects.toBeInstanceOf(MaxNumbersOfCheckInsError)
  })

  it('should be able to check in twice, but on different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.169926,
      userLongitude: -46.8946919,
    })

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.169926,
      userLongitude: -46.8946919,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on a distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Test Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.1726508),
      longitude: new Decimal(-23.1726508),
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: -23.169926,
        userLongitude: -46.8946919,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
