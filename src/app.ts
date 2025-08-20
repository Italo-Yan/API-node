import { fastifySwagger } from '@fastify/swagger'
import scalarAPIReference from '@scalar/fastify-api-reference'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createCoursesRoute } from './routes/create-course.ts'
import { deleteCoursesByIdRoute } from './routes/delete-course-by-id.ts'
import { getCoursesRoute } from './routes/get-course.ts'
import { getCoursesByIdRoute } from './routes/get-course-by-id.ts'
import { patchCoursesRoute } from './routes/patch-course.ts'

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>()

if (process.env.NODE_ENV === 'development') {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Desafio Node.js',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  })

  server.register(scalarAPIReference, {
    routePrefix: '/docs',
  })
}

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(createCoursesRoute)
server.register(getCoursesByIdRoute)
server.register(getCoursesRoute)
server.register(patchCoursesRoute)
server.register(deleteCoursesByIdRoute)

export { server }