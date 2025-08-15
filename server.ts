import { fastifySwagger } from '@fastify/swagger'
import fastify from 'fastify'
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { createCoursesRoute } from './src/routes/create-course.ts'
import { getCoursesRoute } from './src/routes/get-course.ts'
import { getCoursesByIdRoute } from './src/routes/get-course-by-id.ts'
import { patchCoursesRoute } from './src/routes/patch-course.ts'
import { deleteCoursesByIdRoute } from './src/routes/delete-course-by-id.ts'
import scalarAPIReference from '@scalar/fastify-api-reference'

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

server.listen({ port: 3333 }).then(() => {
  console.log('Server is running on http://localhost:3333')
})