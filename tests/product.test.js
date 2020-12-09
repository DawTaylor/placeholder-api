const request = require('supertest')
const app = require('../app')
const { VALID_AUTH } = require('../middlewares/auth')

const VALID_PRODUCT_ID = '5099999'

const getRequest = (productId, auth) => {
  if(!auth) { 
    return request(app).get(`/product/${productId}`)
  }

  return request(app).get(`/product/${productId}`).set({ authorization: `Basic ${auth}`})
}

describe('GET:/product/:productId', () => {
  test('Should return 401 if no authorization is provided', async () => {
    const response = await getRequest(VALID_PRODUCT_ID)

    expect(response.statusCode).toBe(401)
  })
  
  test('Should return 403 if provided authorization is invalid', async () => {
    const response = await getRequest(VALID_PRODUCT_ID, 'invalid')

    expect(response.statusCode).toBe(403)
  })

  test('Should return 200 if provided authorization is valid', async () => {
    const response = await getRequest(VALID_PRODUCT_ID, VALID_AUTH)

    expect(response.statusCode).toBe(200)
  })

  test(`Should return product data for productId: ${VALID_PRODUCT_ID}`, async () => {
    const response = await getRequest(VALID_PRODUCT_ID, VALID_AUTH)

    expect(response.statusCode).toBe(200)
    expect(response.body.sku).toBe(VALID_PRODUCT_ID)
  })

  test('Should return 404 for invalid productId', async () => {
    const response = await getRequest('invalid', VALID_AUTH)

    expect(response.statusCode).toBe(404)
  })
})