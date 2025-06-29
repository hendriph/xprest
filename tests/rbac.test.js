const request = require('supertest');
const app = require('../src/app');

describe('RBAC Protected Routes', () => {
  const base = '/v1/auth';

  const adminUser = {
    email: 'admin@example.com',
    password: 'admin123',
    fullname: 'Admin User',
    role: 'admin' // pastikan role ini di-assign saat register (by seeder atau auto-promote)
  };

  const regularUser = {
    email: 'user@example.com',
    password: 'user123',
    fullname: 'Regular User'
  };

  let adminToken, userToken;

  beforeAll(async () => {
    await request(app).post(`${base}/register`).send(adminUser);
    await request(app).post(`${base}/register`).send(regularUser);

    const resAdmin = await request(app).post(`${base}/login`).send({
      email: adminUser.email,
      password: adminUser.password
    });
    adminToken = resAdmin.body.data.token;

    const resUser = await request(app).post(`${base}/login`).send({
      email: regularUser.email,
      password: regularUser.password
    });
    userToken = resUser.body.data.token;
  });

  it('should allow admin to access admin-only route', async () => {
    const res = await request(app)
      .get('/v1/user/admin-area')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should deny regular user to access admin-only route', async () => {
    const res = await request(app)
      .get('/v1/user/admin-area')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });
});
