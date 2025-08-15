import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../database/client.ts'
import { courses } from '../database/schema.ts'
import { eq } from 'drizzle-orm'
import z from 'zod'

export const deleteCoursesByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete('/courses/:id', {
    schema: {
      tags: ['Courses'],
      summary: 'Delete a course by id',
      description: 'This route deletes a course by id',
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }).describe('Course deleted successfully'),
        404: z.object({
          error: z.string(),
        }).describe('Course not found'),
      },
    },
  }, async (request, reply) => {
    const courseId = request.params.id
  
    const result = await db
      .delete(courses)
      .where(eq(courses.id, courseId))
      .returning()
    if (result.length === 0) {
      return reply.status(404).send({ error: 'Course not found' })
    }
    return reply.status(200).send({ message: 'Course deleted successfully' })
  })
}