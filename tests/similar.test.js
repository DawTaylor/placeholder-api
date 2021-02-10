const request = require('supertest');
const app = require('../app');
const { VALID_AUTH } = require('../middlewares/auth');

const getRequestPath = (path, limit) => {
  if (!limit) return path;

  return `${path}?limit=${limit}`;
};

const getRequest = (data, auth, limit) => {
  const productId = '123123123';
  if (!auth) {
    return request(app).post(`/similar/${productId}`, data);
  }

  return request(app).post(getRequestPath(`/similar/${productId}`, limit)).send(data).set({ authorization: `Basic ${auth}` });
};

describe('GET:/similar/:productId', () => {
  test('Should return 401 if no authorization header is provided', async () => {
    const response = await getRequest({});

    expect(response.statusCode).toBe(401);
  });

  test('Should return 403 if provided authorization header is invalid', async () => {
    const response = await getRequest({}, 'invalidAUTH');

    expect(response.statusCode).toBe(403);
  });

  test('Should return 200 if provided authorization header is valid', async () => {
    const response = await getRequest({ price: 71.99 }, VALID_AUTH);

    expect(response.statusCode).toBe(200);
  });

  test('Should return 404 for price ', async () => {
    const response = await getRequest({}, VALID_AUTH);

    expect(response.statusCode).toBe(404);
  });

  test('Should return 1 similar product for price 71.99 ', async () => {
    const response = await getRequest({ price: 71.99 }, VALID_AUTH);

    expect(response.statusCode).toBe(200);
    expect(response.body.similar.length).toBe(1);
  });

  test('Should return 3 similar products for price 99.99', async () => {
    const response = await getRequest({ price: 99.99 }, VALID_AUTH);

    expect(response.statusCode).toBe(200);
    expect(response.body.similar.length).toBe(3);
  });

  test('Should return 0 similar products for and price 9.99', async () => {
    const response = await getRequest({ price: 9.99 }, VALID_AUTH);

    expect(response.statusCode).toBe(200);
    expect(response.body.similar.length).toBe(0);
  });

  test('Should return 1 similar product for price 99.99 and limit: 1', async () => {
    const response = await getRequest({ price: 99.99 }, VALID_AUTH, 1);

    expect(response.statusCode).toBe(200);
    expect(response.body.similar.length).toBe(1);
  });

  test('Should return 3 similar products for price 99.99 and limit: 10', async () => {
    const response = await getRequest({ price: 99.99 }, VALID_AUTH, 10);

    expect(response.statusCode).toBe(200);
    expect(response.body.similar.length).toBe(3);
  });
});
