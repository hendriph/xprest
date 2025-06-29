const request = require('supertest');
const app = require('../src/app');

describe('User API', () => {
  const base = '/v1/auth';
  const profileEndpoint = '/v1/user/me';

  const userData = {
    email: 'me@example.com',
    password: 'secret456',
    fullname: 'Protected User'
  };

  let token;

  beforeAll(async () => {
    // register & login to get token
    await request(app).post(`${base}/register`).send(userData);
    const res = await request(app).post(`${base}/login`).send({
      email: userData.email,
      password: userData.password
    });

    token = res.body.data.token;
  });

  it('should access protected profile route with token', async () => {
    const res = await request(app)
      .get(profileEndpoint)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('email', userData.email);
  });

  it('should reject profile access without token', async () => {
    const res = await request(app).get(profileEndpoint);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code');
  });
});
