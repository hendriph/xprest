const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {
  const base = '/v1/auth';
  const userData = {
    email: 'test@example.com',
    password: 'secret123',
    fullname: 'Test User'
  };

  it('should register a user', async () => {
    const res = await request(app)
      .post(`${base}/register`)
      .send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('email', userData.email);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post(`${base}/login`)
      .send({
        email: userData.email,
        password: userData.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should reject invalid login', async () => {
    const res = await request(app)
      .post(`${base}/login`)
      .send({
        email: userData.email,
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code', 'AUTH_INVALID');
  });
});
