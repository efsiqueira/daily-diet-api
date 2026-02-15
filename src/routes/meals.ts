import z from "zod"
import { prisma } from "@/lib/prisma"
import type { FastifyInstance } from "fastify"
import { checkSessionIdExists } from "@/middlewares/check-session-id-exists"

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', {
    preHandler: [checkSessionIdExists]
  }, async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      isOnDiet: z.boolean()
    })

    const { name, description, date, isOnDiet } = createMealBodySchema.parse(
      request.body
    )

    const currentUserId = String(request.user?.id)

    await prisma.meal.create({
      data: {
        name,
        description,
        date: new Date(date),
        is_on_diet: isOnDiet,
        user_id: currentUserId
      }
    })

    reply.status(201).send()
  })

  app.put('/:id', {
    preHandler: [checkSessionIdExists]
  }, async (request, reply) => {
    const updateMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      isOnDiet: z.boolean()
    })

    const updateMealParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = updateMealParamsSchema.parse(request.params)

    await prisma.meal.findFirstOrThrow({
      where: {
        id,
        user_id: String(request.user?.id)
      }
    })

    const { name, description, date, isOnDiet } = updateMealBodySchema.parse(
      request.body
    )

    await prisma.meal.update({
      where: {
        id,
        user_id: String(request.user?.id)
      },
      data: {
        name,
        description,
        date: new Date(date),
        is_on_diet: isOnDiet
      }
    })

    reply.status(204).send()
  })

  app.delete('/:id', {
    preHandler: [checkSessionIdExists]
  }, async (request, reply) => {
    const deleteMealParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = deleteMealParamsSchema.parse(request.params)

    await prisma.meal.findFirstOrThrow({
      where: {
        id,
        user_id: String(request.user?.id)
      }
    })

    await prisma.meal.delete({
      where: {
        id,
        user_id: String(request.user?.id)
      }
    })

    reply.status(204).send()
  })

  app.get('/metrics', {
    preHandler: [checkSessionIdExists]
  }, async (request) => {
    const totalMealsRegistered = await prisma.meal.findMany({
      where: {
        user_id: String(request.user?.id)
      },
      orderBy: {
        date: 'desc'
      }
    })

    const totalMealsOnDiet = await prisma.meal.count({
      where: {
        user_id: String(request.user?.id),
        is_on_diet: true
      }
    })

    const totalMealsOffDiet = await prisma.meal.count({
      where: {
        user_id: String(request.user?.id),
        is_on_diet: false
      }
    })

    const { longestSequenceOnDiet } = totalMealsRegistered.reduce((acc, meal) => {
      if (meal.is_on_diet) {
        acc.currentSequence += 1
      } else {
        acc.currentSequence = 0
      }

      if (acc.currentSequence > acc.longestSequenceOnDiet) {
        acc.longestSequenceOnDiet = acc.currentSequence
      }

      return acc
    }, { longestSequenceOnDiet: 0, currentSequence: 0 })

    return {
      totalMealsRegistered: totalMealsRegistered.length,
      totalMealsOnDiet,
      totalMealsOffDiet,
      longestSequenceOnDiet
    }
  })
}