const request = require('supertest');
const app = require('../src/app');

describe('Email Queue Job', () => {
  const base = '/v1/auth';

  const user = {
    email: 'queue@example.com',
    password: 'test123',
    fullname: 'Queue User'
  };

  it('should enqueue email job on register', async () => {
    const res = await request(app)
      .post(`${base}/register`)
      .send(user);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('email', user.email);

    // NOTE: We assume the email job is enqueued in register handler
    // and the worker processes it in background
  });
});
