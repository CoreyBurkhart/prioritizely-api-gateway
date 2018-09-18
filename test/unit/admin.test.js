import mongoose from 'mongoose';
import app from '@/app';
import request from 'supertest';

const userCredentials = {
  name: 'some name',
  email: 'admintestuser@test.com',
  password: 'elephantsarecool!',
};

let userId, token;

beforeAll(async () => {
  await mongoose.connect(global.__MONGO_URI__);

  /**
   * Create an account via signup path
   */
  await request(app)
    .post('/api/auth/signup')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send(JSON.stringify(userCredentials))
    .then(res => {
      token = res.header['set-cookie'][0];
      userId = res.body.id;
    })
});

afterAll(async () => {
  await mongoose.disconnect();
});

// function callRoute(endpoint, payload) {
//   return request(app)
//     .post(endpoint)
//     .set('Content-Type', 'application/json')
//     .set('Accept', 'application/json')
//     .send(JSON.stringify(payload));
// }

describe('User Administration', () => {
  it('Deletes a user.', (done) => {
    request(app)
      .delete(`/api/admin`)
      .set('Accept', 'application/json')
      .set('cookie', token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      })
  })
})