import mongoose from 'mongoose';
import UserModel from '@/db/models/User';
import app from '@/app';
import request from 'supertest';
import * as ERROR_MESSAGES from '@/lib/error-messages';

beforeAll(async () => {
  await mongoose.connect(global.__MONGO_URI__)
});

afterAll(async () => {
  await mongoose.disconnect();
});

/**
 * @param {Object} payload this will get stringified! 
 * @return {Object}
 */
function callSignupRoute(payload) {
  return request(app)
    .post('/api/auth/signup')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send(JSON.stringify(payload));
}

describe('User Signup Flow', () => {
  it('Creates user given valid data.', (done) => {
    const signupPayload = {
      email: 'email@domain.com',
      password: 'password',
      name: 'first last',
    };

    callSignupRoute(signupPayload)
      .then((res) => {
        expect(/token=.+;/i.test(res.header['set-cookie'])).toBe(true);
        expect(/httpOnly/i.test(res.header['set-cookie'])).toBe(true);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
          newUser: expect.any(Boolean)
        }))
        done();
      });
  });

  it('Does not create duplicate users.', async (done) => {
    const signupPayload = {
      email: 'email@domain.com', // same email
      password: 'thisdoesntmatterforthistest',
      name: 'first last',
    };

    // verify we have the user in the db
    const user = await UserModel.find({email: signupPayload.email})
    expect(user.length).toBe(1)

    callSignupRoute(signupPayload)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.messages).toEqual([ERROR_MESSAGES.NON_UNIQUE_EMAIL]);
        done();
      });
  });

  it('Doesn\'t create a user given invalid email.', (done) => {
    const signupPayload = {
      email: 'emaildomain.com', // no "@""
      password: 'password',
      name: 'first last',
    };

    callSignupRoute(signupPayload)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.messages).toBeDefined();
        done();
      });
  });

  it('Doesn\'t create a user given invalid password.', (done) => {
    const signupPayload = {
      email: 'different@domain.com',
      password: '2short',
      name: 'first last',
    };

    callSignupRoute(signupPayload)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.messages).toEqual([ERROR_MESSAGES.INVALID_PASSWORD]);
        done();
      });
  });
});
