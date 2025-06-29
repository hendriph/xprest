const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('xprest is running!');
  });
});
