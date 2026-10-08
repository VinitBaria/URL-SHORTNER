const express = require('express');
const request = require('supertest');

jest.mock('../middleware/auth', () => ({
  authenticateUser: (req, res, next) => next(),
  restrictToRoles: () => (req, res, next) => next(),
}));
jest.mock('../controller/url', () => ({
  generateShortUrl: (req, res) => res.status(201).json({ created: true }),
  getAllUrls: (req, res) => res.status(200).json({ listed: true }),
  redirectToOriginalUrl: (req, res) => res.redirect('/original'),
  getUrlStats: (req, res) => res.status(200).json({ shortId: req.params.shortId }),
  admidviewroute: (req, res) => res.status(200).json({ admin: true }),
}));

const urlRoutes = require('../routes/url');
const app = express();
app.use(express.json());
app.use('/', urlRoutes);

describe('URL API routes', () => {
  test('supports creating a short URL', async () => {
    await request(app).post('/').send({ orgurl: 'https://example.com' }).expect(201, { created: true });
  });

  test('lists URLs for the current user', async () => {
    await request(app).get('/').expect(200, { listed: true });
  });

  test('routes statistics before the generic short-id redirect', async () => {
    await request(app).get('/abc/stats').expect(200, { shortId: 'abc' });
  });

  test('redirects a short id', async () => {
    await request(app).get('/abc').expect(302).expect('Location', '/original');
  });

  test('exposes the admin route', async () => {
    await request(app).get('/admin').expect(200, { admin: true });
  });

  test('returns 404 for an unsupported URL method', async () => {
    await request(app).delete('/').expect(404);
  });

  test('returns 404 for an unknown URL route', async () => {
    await request(app).get('/abc/unknown/path').expect(404);
  });

  test('rejects malformed JSON requests', async () => {
    await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send('{invalid-json')
      .expect(400);
  });
});