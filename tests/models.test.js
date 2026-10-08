const User = require('../models/user');
const Item = require('../models/url');

describe('Mongoose model contracts', () => {
  test('requires the user fields and defaults the role', () => {
    const user = new User();

    expect(user.validateSync().errors).toEqual(expect.objectContaining({
      name: expect.any(Object),
      email: expect.any(Object),
      password: expect.any(Object),
    }));
    expect(user.Role).toBe('Normal');
    expect(User.schema.path('email').options.unique).toBe(true);
    expect(User.schema.path('Role').enumValues).toEqual(['Admin', 'Normal']);
  });

  test('accepts an admin user with valid URL ownership data', () => {
    const user = new User({ name: 'Admin', email: 'admin@example.com', password: 'secret', Role: 'Admin' });
    const item = new Item({
      shortId: 'abc123',
      orgurl: 'https://example.com',
      createdby: user._id,
    });

    expect(user.validateSync()).toBeUndefined();
    expect(item.validateSync()).toBeUndefined();
    expect(Item.schema.path('shortId').options.unique).toBe(true);
    expect(Item.schema.path('createdby').options.ref).toBe('User');
  });

  test('rejects a URL record without its required fields', () => {
    const errors = new Item().validateSync().errors;

    expect(errors).toEqual(expect.objectContaining({
      shortId: expect.any(Object),
      orgurl: expect.any(Object),
      createdby: expect.any(Object),
    }));
  });
});