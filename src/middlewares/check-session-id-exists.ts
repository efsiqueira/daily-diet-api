import { prisma } from "@/lib/prisma"
import type { FastifyReply, FastifyRequest } from "fastify"

export async function checkSessionIdExists(request: FastifyRequest, reply: FastifyReply) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized'
    })
  }

  const currentUser = await setCurrentUser(sessionId)

  if (!currentUser) {
    return reply.status(401).send({
      error: 'Unauthorized'
    })
  }

  request.user = currentUser
}

function setCurrentUser(sessionId: string) {
  return prisma.user.findFirst({
    where: {
      session_id: sessionId
    }
  })
} 