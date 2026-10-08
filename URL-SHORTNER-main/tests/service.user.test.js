const jwt = require('jsonwebtoken');

describe('user token service', () => {
  let Getuser;
  let Setuser;

  beforeEach(() => {
    jest.resetModules();
    process.env.JWT_SECRET = 'test-secret';
    ({ Getuser, Setuser } = require('../service/user'));
  });

  test('creates and verifies a token for a user id', async () => {
    const token = await Setuser('user-123');

    await expect(Getuser(token)).resolves.toEqual(expect.objectContaining({ user: 'user-123' }));
  });

  test('returns null when no token is supplied', async () => {
    await expect(Getuser()).resolves.toBeNull();
  });

  test('rejects an invalid token', async () => {
    await expect(Getuser('not-a-token')).rejects.toThrow();
  });

  test('rejects an expired token', async () => {
    const token = jwt.sign({ user: 'user-123' }, 'test-secret', { expiresIn: -1 });

    await expect(Getuser(token)).rejects.toThrow();
  });

  test('uses the default secret when JWT_SECRET is not configured', async () => {
    delete process.env.JWT_SECRET;
    jest.resetModules();
    const service = require('../service/user');
    const token = await service.Setuser('user-456');

    await expect(service.Getuser(token)).resolves.toEqual(expect.objectContaining({ user: 'user-456' }));
  });
});