import { app } from "@/app"
import request from 'supertest'
import { execSync } from "child_process"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"

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

  it('should be able to create a new user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Eduardo',
        email: 'eduardo@gmail.com'
      })
      .expect(201)

    const cookies = userResponse.get('Set-Cookie') || []

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('sessionId')]),
    )
  })
})