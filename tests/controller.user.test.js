jest.mock('../models/user', () => ({
  create: jest.fn(),
  findOne: jest.fn(),
}));
jest.mock('../models/url', () => ({ find: jest.fn() }));
jest.mock('../service/user', () => ({ Setuser: jest.fn() }));
jest.mock('uuid', () => ({ v4: jest.fn() }));

const User = require('../models/user');
const Item = require('../models/url');
const { Setuser } = require('../service/user');
const { createUser, findUserByEmailAndPassword } = require('../controller/user');

const response = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.send = jest.fn(() => res);
  res.cookie = jest.fn(() => res);
  res.render = jest.fn(() => res);
  return res;
};

describe('user controller', () => {
  beforeEach(() => jest.clearAllMocks());

  test('creates a user and renders the login page', async () => {
    User.create.mockResolvedValue({});
    const res = response();

    await createUser({ body: { name: 'Ada', email: 'ada@example.com', password: 'secret' } }, res);

    expect(User.create).toHaveBeenCalledWith({
      name: 'Ada', email: 'ada@example.com', password: 'secret',
    });
    expect(res.render).toHaveBeenCalledWith('login', { message: 'User created successfully' });
  });

  test('returns 404 when login credentials do not match', async () => {
    User.findOne.mockResolvedValue(null);
    const res = response();

    await findUserByEmailAndPassword({ body: { email: 'missing@example.com', password: 'bad' } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: 'User not found' });
    expect(Setuser).not.toHaveBeenCalled();
  });

  test('sets a cookie and renders the user URLs after login', async () => {
    const user = { _id: 'user-1' };
    User.findOne.mockResolvedValue(user);
    Setuser.mockResolvedValue('signed-token');
    Item.find.mockResolvedValue([{ orgurl: 'https://example.com', shortId: 'abc' }]);
    const res = response();

    await findUserByEmailAndPassword({ body: { email: 'ada@example.com', password: 'secret' } }, res);

    expect(res.cookie).toHaveBeenCalledWith('uid', 'signed-token', expect.objectContaining({
      httpOnly: true,
      domain: 'localhost',
    }));
    expect(res.render).toHaveBeenCalledWith('index', {
      array: [{ orgurl: 'https://example.com', shortId: 'http://localhost:8001/abc' }],
    });
  });

  test('renders an empty URL list when the user has no shortened URLs', async () => {
    User.findOne.mockResolvedValue({ _id: 'user-1' });
    Setuser.mockResolvedValue('signed-token');
    Item.find.mockResolvedValue([]);
    const res = response();

    await findUserByEmailAndPassword({ body: { email: 'ada@example.com', password: 'secret' } }, res);

    expect(res.render).toHaveBeenCalledWith('index', { array: [] });
  });

  test('propagates a failure while loading URLs after login', async () => {
    User.findOne.mockResolvedValue({ _id: 'user-1' });
    Setuser.mockResolvedValue('signed-token');
    Item.find.mockRejectedValue(new Error('database unavailable'));

    await expect(findUserByEmailAndPassword(
      { body: { email: 'ada@example.com', password: 'secret' } },
      response(),
    )).rejects.toThrow('database unavailable');
  });

  test('propagates a signup database failure', async () => {
    User.create.mockRejectedValue(new Error('duplicate email'));

    await expect(createUser({ body: {} }, response())).rejects.toThrow('duplicate email');
  });
});