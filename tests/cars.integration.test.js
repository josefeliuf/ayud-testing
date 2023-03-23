const request = require('supertest');
const { app } = require('../server');

it('Gets a car with id 1', async () => {
  await request(app)
    .get('/cars/1')
    .expect('Content-Type', /json/)
    .expect(200, {
      id: 1,
      name: 'Ford F-150',
    });
});

it('Gets a car with invalid id', async () => {
  await request(app).get('/cars/4').expect('Content-Type', /json/).expect(404);
});

it('Creates a car', async () => {
  await request(app)
    .post('/cars/create')
    .send({ name: 'Audi R8' })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, { id: 3, name: 'Audi R8' });
});
