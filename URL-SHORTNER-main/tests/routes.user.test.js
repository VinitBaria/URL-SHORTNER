const express = require('express');
const request = require('supertest');

jest.mock('../controller/user', () => ({
  createUser: (req, res) => res.status(201).json({ created: true }),
  findUserByEmailAndPassword: (req, res) => res.status(200).json({ loggedIn: true }),
}));

const userRoutes = require('../routes/user');
const app = express();
app.set('view engine', 'ejs');
app.set('views', require('path').resolve(__dirname, '../view'));
app.use(express.urlencoded({ extended: true }));
app.use('/user', userRoutes);

describe('user routes', () => {
  test('renders signup and login pages', async () => {
    await request(app).get('/user/signup').expect(200);
    await request(app).get('/user/login').expect(200);
  });

  test('accepts signup and login submissions', async () => {
    await request(app).post('/user/signup').send('name=Ada&email=ada%40example.com&password=secret')
      .expect(201, { created: true });
    await request(app).post('/user/login').send('email=ada%40example.com&password=secret')
      .expect(200, { loggedIn: true });
  });
});