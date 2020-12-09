const Express = require('express');

const { Router } = Express;

const mocks = require('../mocks/products');

const productRouter = new Router();

const flatProducts = Object.keys(mocks).reduce((acc, key) => ([...acc, ...mocks[key]]), []);

productRouter.get('/product/:productId', (req, res) => {
  const { productId } = req.params;

  const product = flatProducts.find((p) => p.sku === productId);

  if (!product) {
    return res.status(404).end();
  }

  return res.json(product);
});

module.exports = { productRouter };
