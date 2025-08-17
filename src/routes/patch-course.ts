import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../database/client.ts'
import { courses } from '../database/schema.ts'

export const patchCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.patch(
    '/courses/:id',
    {
      schema: {
        tags: ['Courses'],
        summary: 'Update a course by id',
        description: 'This route updates a course by id',
        params: z.object({
          id: z.uuid(),
        }),
        body: z.object({
          title: z.string().min(1, 'Title is required'),
        }),
        response: {
          200: z
            .object({
              updatedCourse: z.object({
                id: z.uuid(),
                title: z.string(),
              }),
            })
            .describe('Course updated successfully'),
          400: z
            .object({
              error: z.string(),
            })
            .describe('Title is required'),
          404: z
            .object({
              error: z.string(),
            })
            .describe('Course not found'),
        },
      },
    },
    async (request, reply) => {
      const courseId = request.params.id
      const courseTitle = request.body.title

      const result = await db
        .update(courses)
        .set({ title: courseTitle })
        .where(eq(courses.id, courseId))
        .returning()

      if (result.length === 0) {
        return reply.status(404).send({ error: 'Course not found' })
      }

      const updatedCourse = result[0]
      if (!updatedCourse.title) {
        return reply.status(400).send({ error: 'Title is required' })
      }

      return reply.status(200).send({ updatedCourse })
    },
  )
}
