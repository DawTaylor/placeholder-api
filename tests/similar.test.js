const request = require('supertest');
const app = require('../app');
const { VALID_AUTH } = require('../middlewares/auth');
const validProducts = require('../mocks/validProducts');

const VALID_PRODUCT_ID = validProducts[1];

const getRequestPath = (path, limit) => {
  if (!limit) return path;

  return `${path}?limit=${limit}`;
};

const getRequest = (productId, auth, limit) => {
  if (!auth) {
    return request(app).get(`/similar/${productId}`);
  }

  return request(app).get(getRequestPath(`/similar/${productId}`, limit)).set({ authorization: `Basic ${auth}` });
};

describe('GET:/similar/:productId', () => {
  test('Should return 401 if no authorization header is provided', async () => {
    const response = await getRequest(VALID_PRODUCT_ID);

    expect(response.statusCode).toBe(401);
  });

  test('Should return 403 if provided authorization header is invalid', async () => {
    const response = await getRequest(VALID_PRODUCT_ID, 'invalidAUTH');

    expect(response.statusCode).toBe(403);
  });

  test('Should return 200 if provided authorization header is valid', async () => {
    const response = await getRequest(VALID_PRODUCT_ID, VALID_AUTH);

    expect(response.statusCode).toBe(200);
  });

  test('Should return 404 for invalid productId', async () => {
    const response = await getRequest('invalid', VALID_AUTH);

    expect(response.statusCode).toBe(404);
  });

  test(`Should return 1 similar product for productId: ${VALID_PRODUCT_ID}`, async () => {
    const response = await getRequest(VALID_PRODUCT_ID, VALID_AUTH);

    expect(response.statusCode).toBe(200);
    expect(response.body.similar.length).toBe(1);
  });

  test(`Should return 2 similar products for productId: ${validProducts[0]}`, async () => {
    const response = await getRequest(validProducts[0], VALID_AUTH);

    expect(response.statusCode).toBe(200);
    expect(response.body.similar.length).toBe(2);
  });

  test(`Should return 0 similar products for productId: ${validProducts[2]}`, async () => {
    const response = await getRequest(validProducts[2], VALID_AUTH);

    expect(response.statusCode).toBe(200);
    expect(response.body.similar.length).toBe(0);
  });

  test(`Should return 1 similar product for productId: ${validProducts[0]} and limit: 1`, async () => {
    const response = await getRequest(validProducts[0], VALID_AUTH, 1);

    expect(response.statusCode).toBe(200);
    expect(response.body.similar.length).toBe(1);
  });

  test(`Should return 2 similar products for productId: ${validProducts[0]} and limit: 10`, async () => {
    const response = await getRequest(validProducts[0], VALID_AUTH, 10);

    expect(response.statusCode).toBe(200);
    expect(response.body.similar.length).toBe(2);
  });
});
