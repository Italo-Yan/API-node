import request from 'supertest'
import { expect, test } from 'vitest'
import { server } from '../app.ts'
import { makeCourse } from './factories/make-courses.ts'

test('get course by id', async () => {
  await server.ready()

  const course = await makeCourse()

  const response = await request(server.server).get(`/courses/${course.id}`)

  console.log(response.body)

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    course: {
      id: expect.any(String),
      title: expect.any(String),
      description: null,
    }
  })
})
