import type { FastifyInstance } from 'fastify'
import z from 'zod'
import { prisma } from '../lib/prisma'
import { checkSessionIdExists } from '@/middlewares/check-session-id-exists'
import { randomUUID } from 'node:crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    const { name, email, } = createUserBodySchema.parse(
      request.body
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    const resp = await prisma.user.create({
      data: {
        name,
        email,
        session_id: sessionId
      }
    })

    return reply.status(201).send()
  })

  app.get('/', {
    preHandler: [checkSessionIdExists]
  }, async (request) => {
    const sessionId = String(request.cookies.sessionId)

    const users = await prisma.user.findMany({
      where: {
        session_id: sessionId
      }
    })

    return { users }
  })
}