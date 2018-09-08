import mongoose from 'mongoose';
import app from '@/app';
import request from 'supertest';

const signinValidPayload = {
  email: 'signintestuser@test.com',
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
      JSON.stringify(Object.assign(signinValidPayload, {name: 'fist last'}))
    );
});

afterAll(async () => {
  await mongoose.disconnect();
});

/**
 * @param {Object} payload this will get stringified!
 * @return {Object}
 */
function callsigninRoute(payload) {
  return request(app)
    .post('/api/auth/signin')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send(JSON.stringify(payload));
}

describe('signin Flow', () => {
  it('Logs user in given correct credentials.', (done) => {
    callsigninRoute(signinValidPayload)
      .then((res) => {
        expect(res.body).toBe(true);
        expect(/token=.+;/i.test(res.header['set-cookie'])).toBe(true);
        done();
      });
  });

  it('Rejects a signin w/ incorrect email.', (done) => {
    callsigninRoute({
      email: 'doesntexist@test.com',
      password: 'validpassword!',
    })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.messages).toBeInstanceOf(Array);
        done();
      });
  });

  it('Rejects a signin w/ incorrect password & correct email.', (done) => {
    callsigninRoute({
      email: 'signintestuser@test.com',
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
      .get('/api/auth/signout')
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
