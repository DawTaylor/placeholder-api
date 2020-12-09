const Express = require('express');

const { Router } = Express;

const mocks = require('../mocks/products.js');
const validProducts = require('../mocks/validProducts');

const similarRouter = new Router();

similarRouter.get('/similar/:productId', (req, res) => {
  const { productId } = req.params;
  const { limit } = req.query;

  if (!validProducts.includes(productId)) {
    return res.status(404).end();
  }

  const products = mocks[productId] || [];

  if (limit && limit < products.length) {
    const limitedQuantityProducts = products.slice(limit);
    return res.json({ similar: limitedQuantityProducts });
  }

  return res.json({ similar: products });
});

module.exports = { similarRouter };
