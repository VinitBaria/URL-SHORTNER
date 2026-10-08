jest.mock('../models/url', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
}));
jest.mock('shortid', () => jest.fn(() => 'short-123'));

const Item = require('../models/url');
const {
  generateShortUrl,
  getAllUrls,
  redirectToOriginalUrl,
  getUrlStats,
  admidviewroute,
} = require('../controller/url');

const response = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.send = jest.fn(() => res);
  res.json = jest.fn(() => res);
  res.render = jest.fn(() => res);
  res.redirect = jest.fn(() => res);
  return res;
};

describe('URL controller', () => {
  beforeEach(() => jest.clearAllMocks());

  test('rejects a missing request body', async () => {
    const res = response();

    await generateShortUrl({ body: undefined }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: 'Body is missing' });
    expect(Item.create).not.toHaveBeenCalled();
  });

  test('creates a short URL and redirects home', async () => {
    Item.create.mockResolvedValue({});
    const res = response();

    await generateShortUrl(
      { body: { orgurl: 'https://example.com' }, user: { _id: 'user-1' } },
      res,
    );

    expect(Item.create).toHaveBeenCalledWith({
      shortId: 'short-123',
      orgurl: 'https://example.com',
      createdby: 'user-1',
    });
    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  test('propagates a short URL persistence failure', async () => {
    Item.create.mockRejectedValue(new Error('database unavailable'));

    await expect(generateShortUrl(
      { body: { orgurl: 'https://example.com' }, user: { _id: 'user-1' } },
      response(),
    )).rejects.toThrow('database unavailable');
  });

  test('lists only URLs belonging to the current user', async () => {
    Item.find.mockResolvedValue([{ orgurl: 'https://example.com', shortId: 'abc' }]);
    const res = response();

    await getAllUrls({ user: { _id: 'user-1' } }, res);

    expect(Item.find).toHaveBeenCalledWith({ createdby: 'user-1' });
    expect(res.render).toHaveBeenCalledWith('index', {
      array: [{ orgurl: 'https://example.com', shortId: 'http://localhost:8001/abc' }],
    });
  });

  test('records a click and redirects to the original URL', async () => {
    Item.findOneAndUpdate.mockResolvedValue({});
    Item.findOne.mockResolvedValue({ orgurl: 'https://example.com' });
    const res = response();

    await redirectToOriginalUrl({ params: { shortId: 'abc' } }, res);

    expect(Item.findOneAndUpdate).toHaveBeenCalledWith(
      { shortId: 'abc' },
      { $push: { visitedhistory: expect.any(Number) } },
      { new: true },
    );
    expect(res.redirect).toHaveBeenCalledWith('https://example.com');
  });

  test('propagates a click-history persistence failure', async () => {
    Item.findOneAndUpdate.mockRejectedValue(new Error('database unavailable'));

    await expect(redirectToOriginalUrl({ params: { shortId: 'abc' } }, response()))
      .rejects.toThrow('database unavailable');
  });

  test('returns 404 for an unknown short URL', async () => {
    Item.findOneAndUpdate.mockResolvedValue({});
    Item.findOne.mockResolvedValue(null);
    const res = response();

    await redirectToOriginalUrl({ params: { shortId: 'missing' } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: 'Short URL not found' });
  });

  test('returns click statistics', async () => {
    const history = [new Date('2026-01-01')];
    Item.findOne.mockResolvedValue({
      orgurl: 'https://example.com',
      shortId: 'abc',
      visitedhistory: history,
    });
    const res = response();

    await getUrlStats({ params: { shortId: 'abc' } }, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      orgurl: 'https://example.com',
      shortId: 'http://localhost:8001/abc',
      totalClicks: 1,
      visitedhistory: history,
    });
  });

  test('returns 404 statistics for an unknown short URL', async () => {
    Item.findOne.mockResolvedValue(null);
    const res = response();

    await getUrlStats({ params: { shortId: 'missing' } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: 'Short URL not found' });
  });

  test('returns an empty list when the user has no URLs', async () => {
    Item.find.mockResolvedValue([]);
    const res = response();

    await getAllUrls({ user: { _id: 'user-1' } }, res);

    expect(res.render).toHaveBeenCalledWith('index', { array: [] });
  });

  test('propagates a statistics database failure', async () => {
    Item.findOne.mockRejectedValue(new Error('database unavailable'));

    await expect(getUrlStats({ params: { shortId: 'abc' } }, response()))
      .rejects.toThrow('database unavailable');
  });

  test('renders all URLs for the admin view', async () => {
    Item.find.mockResolvedValue([
      { orgurl: 'https://example.com', shortId: 'abc', createdby: 'user-1' },
    ]);
    const res = response();

    await admidviewroute({}, res);

    expect(Item.find).toHaveBeenCalledWith({});
    expect(res.render).toHaveBeenCalledWith('index', {
      array: [{
        orgurl: 'https://example.com',
        shortId: 'http://localhost:8001/abc',
        createdby: 'user-1',
      }],
    });
  });

  test('propagates database failures to Express error handling', async () => {
    Item.find.mockRejectedValue(new Error('database unavailable'));

    await expect(getAllUrls({ user: { _id: 'user-1' } }, response()))
      .rejects.toThrow('database unavailable');
  });
});