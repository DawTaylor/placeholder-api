const Express = require('express');
const {
  whereEq, filter,
} = require('ramda');

const { Router } = Express;

const mocks = require('../mocks/products.js');

const similarRouter = new Router();

const ensureSimilar = (conditions) => whereEq(conditions);

similarRouter.post('/similar/:productId', (req, res) => {
  const { price, candidateProductId: sku } = req.body;
  const { limit } = req.query;

  const conditions = filter(Boolean, { price, sku });

  const isSimilar = ensureSimilar(conditions);

  const validProducts = mocks.filter(isSimilar);

  if (!validProducts.length) {
    return res.status(404).end();
  }

  if (limit && limit < validProducts.length) {
    const limitedQuantityProducts = validProducts.slice(limit);
    return res.json({ similar: limitedQuantityProducts });
  }

  return res.json({ similar: validProducts });
});

module.exports = { similarRouter };
