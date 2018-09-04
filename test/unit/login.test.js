import mongoose from 'mongoose';
import app from '@/app';
import request from 'supertest';

const LoginValidPayload = {
  email: 'logintestuser@test.com',
  password: 'elephantsarecool!',
};

beforeAll(async () => {
  await mongoose.connect(global.__MONGO_URI__);

  /**
   * Create an account via signup path
   */
  await request(app)
    .post('/api/auth/signup')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send(
      JSON.stringify(Object.assign(LoginValidPayload, {name: 'fist last'}))
    );
});

afterAll(async () => {
  await mongoose.disconnect();
});

/**
 * @param {Object} payload this will get stringified!
 * @return {Object}
 */
function callLoginRoute(payload) {
  return request(app)
    .post('/api/auth/login')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send(JSON.stringify(payload));
}

describe('Login Flow', () => {
  it('Logs user in given correct credentials.', (done) => {
    callLoginRoute(LoginValidPayload)
      .then((res) => {
        expect(res.body).toBe(true);
        expect(/token=.+;/i.test(res.header['set-cookie'])).toBe(true);
        done();
      });
  });

  it('Rejects a login w/ incorrect email.', (done) => {
    callLoginRoute({
      email: 'doesntexist@test.com',
      password: 'validpassword!',
    })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.messages).toBeInstanceOf(Array);
        done();
      });
  });

  it('Rejects a login w/ incorrect password & correct email.', (done) => {
    callLoginRoute({
      email: 'logintestuser@test.com',
      password: 'validpassword!',
    })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.messages).toBeInstanceOf(Array);
        done();
      });
  });

  it('Logs us out correctly.', (done) => {
    request(app)
      .get('/api/auth/logout')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send()
      .then((res) => {
        expect(res.status).toBe(302);
        expect(/token/i.test(res.header['set-cookie'])).toBe(true);
        done();
      });
  });
});
