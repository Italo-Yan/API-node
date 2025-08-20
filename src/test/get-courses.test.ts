import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { expect, test } from 'vitest'
import { server } from '../app.ts'
import { makeCourse } from './factories/make-courses.ts'

test('get course by id', async () => {
  await server.ready()

  const titleId = randomUUID()

  const course = await makeCourse(titleId)

  const response = await request(server.server)
  .get(`/courses?search=${titleId}`)

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    total: 1,
    courses: [
      {
        id: expect.any(String),
        title: titleId,
        enrollments: 0
      }
    ],
  })
})
