jest.mock('../service/user', () => ({ Getuser: jest.fn() }));
jest.mock('../models/user', () => ({ findById: jest.fn() }));

const { Getuser } = require('../service/user');
const User = require('../models/user');
const { authenticateUser, restrictToRoles } = require('../middleware/auth');

const response = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.send = jest.fn(() => res);
  res.render = jest.fn(() => res);
  res.redirect = jest.fn(() => res);
  return res;
};

describe('authentication middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  test('asks unauthenticated requests to log in', async () => {
    const res = response();
    const next = jest.fn();

    await authenticateUser({ cookies: {} }, res, next);

    expect(res.render).toHaveBeenCalledWith('login', { message: 'Please login first' });
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects an invalid session token', async () => {
    Getuser.mockRejectedValue(new Error('invalid token'));
    const res = response();

    await authenticateUser({ cookies: { uid: 'bad-token' } }, res, jest.fn());

    expect(res.render).toHaveBeenCalledWith('login', { message: 'Invalid session. Please login again.' });
  });

  test('rejects a session whose user no longer exists', async () => {
    Getuser.mockResolvedValue({ user: 'missing-user' });
    User.findById.mockResolvedValue(null);
    const res = response();

    await authenticateUser({ cookies: { uid: 'token' } }, res, jest.fn());

    expect(res.render).toHaveBeenCalledWith('login', { message: 'User not found. Please login again.' });
  });

  test('rejects a token with no user payload', async () => {
    Getuser.mockResolvedValue({});
    const res = response();

    await authenticateUser({ cookies: { uid: 'token' } }, res, jest.fn());

    expect(res.render).toHaveBeenCalledWith('login', { message: 'Please login first' });
  });

  test('handles a user lookup failure as an invalid session', async () => {
    Getuser.mockResolvedValue({ user: 'user-1' });
    User.findById.mockRejectedValue(new Error('database unavailable'));
    const res = response();

    await authenticateUser({ cookies: { uid: 'token' } }, res, jest.fn());

    expect(res.render).toHaveBeenCalledWith('login', { message: 'Invalid session. Please login again.' });
  });

  test('attaches the full user and continues for a valid session', async () => {
    const user = { _id: 'user-1', Role: 'Normal' };
    Getuser.mockResolvedValue({ user: 'user-1' });
    User.findById.mockResolvedValue(user);
    const req = { cookies: { uid: 'token' } };
    const next = jest.fn();

    await authenticateUser(req, response(), next);

    expect(req.user).toBe(user);
    expect(next).toHaveBeenCalled();
  });
});

describe('role middleware', () => {
  test('redirects a user with no role', () => {
    const res = response();
    restrictToRoles(['Admin'])({ user: {} }, res, jest.fn());

    expect(res.redirect).toHaveBeenCalledWith('/login');
  });

  test('uses the default empty role allowlist', () => {
    const res = response();
    restrictToRoles()({ user: { Role: 'Normal' } }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('returns forbidden for a disallowed role', () => {
    const res = response();
    restrictToRoles(['Admin'])({ user: { Role: 'Normal' } }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({ message: 'Access denied' });
  });

  test('continues for an allowed role', () => {
    const next = jest.fn();
    restrictToRoles(['Admin'])({ user: { Role: 'Admin' } }, response(), next);

    expect(next).toHaveBeenCalled();
  });
});