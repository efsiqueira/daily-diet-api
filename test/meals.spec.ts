import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'child_process'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npx prisma migrate reset --force')
    execSync('npx prisma db seed')
  })

  it('should be able to create a new meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@gmail.com' })
      .expect(201)

    const cookies = userResponse.get('Set-Cookie') || []

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'Description for meal 1',
        date: '2026-02-15T08:00:00Z',
        isOnDiet: true
      })
      .expect(201)

  })

  it('should be able to delete a meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@gmail.com' })
      .expect(201)

    const cookies = userResponse.get('Set-Cookie') || []

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'Description for meal 1',
        date: '2026-02-15T08:00:00Z',
        isOnDiet: true
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(204)
  })

  it('should be able to update a meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@gmail.com' })
      .expect(201)

    const cookies = userResponse.get('Set-Cookie') || []

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'Description for meal 1',
        date: '2026-02-15T08:00:00Z',
        isOnDiet: true
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        name: 'Updated Meal 1',
        description: 'Updated description for meal 1',
        date: '2026-02-14T08:00:00Z',
        isOnDiet: false
      })
      .expect(204)
  })

  it('should be able to list all meals', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@gmail.com' })
      .expect(201)

    const cookies = userResponse.get('Set-Cookie') || []

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'Description for meal 1',
        date: '2026-02-15T08:00:00Z',
        isOnDiet: true
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 2',
        description: 'Description for meal 2',
        date: '2026-02-15T12:00:00Z',
        isOnDiet: false
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toHaveLength(2)
  })

  it('should be able to get a meal by id', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@gmail.com' })
      .expect(201)

    const cookies = userResponse.get('Set-Cookie') || []

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'Description for meal 1',
        date: '2026-02-15T08:00:00.000Z',
        isOnDiet: true
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'Meal 1',
        description: 'Description for meal 1',
        is_on_diet: true,
        date: '2026-02-15T08:00:00.000Z',
      }),
    )
  })

  it('should be able to get the metrics', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@gmail.com' })
      .expect(201)

    const cookies = userResponse.get('Set-Cookie') || []

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'Description for meal 1',
        date: '2026-02-15T08:00:00.000Z',
        isOnDiet: true
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 2',
        description: 'Description for meal 2',
        date: '2026-02-15T12:00:00.000Z',
        isOnDiet: true
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 4',
        description: 'Description for meal 4',
        date: '2026-02-15T20:00:00.000Z',
        isOnDiet: true
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 3',
        description: 'Description for meal 3',
        date: '2026-02-15T16:00:00.000Z',
        isOnDiet: false
      })
      .expect(201)

    const metricsResponse = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookies)
      .expect(200)

    expect(metricsResponse.body).toEqual({
      totalMealsRegistered: 4,
      totalMealsOnDiet: 3,
      totalMealsOffDiet: 1,
      longestSequenceOnDiet: 2
    })
  })
})