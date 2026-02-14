import type { FastifyInstance } from 'fastify'
import z from 'zod'
import { prisma } from '../lib/prisma'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    const { name, email } = createUserBodySchema.parse(
      request.body
    )

    await prisma.user.create({
      data: {
        name,
        email
      }
    })

    return reply.status(201).send()
  })

  app.get('/', async (request, reply) => {
    const users = await prisma.user.findMany()

    return reply.status(200).send(users)
  })
}