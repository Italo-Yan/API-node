import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../database/client.ts'
import { courses } from '../database/schema.ts'
import z from 'zod'

export const createCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/courses', {
    schema: {
      tags: ['Courses'],
      summary: 'Create a new course',
      description: 'This route receives a title and creates a course',
      body: z.object({
        title: z.string().min(5, 'Title must be at least 5 characters long'),
      }),
      response: {
        201: z.object({ courseId: z.uuid()}).describe('Course created successfully')
      }
    },
  }, async (request, reply) => {
    const courseTitle = request.body.title
  
    const result = await db
    .insert(courses)
    .values({ title: courseTitle})
    .returning()
  
    return reply.status(201).send({ courseId: result[0].id }) 
  })
}