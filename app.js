const Express = require('express');
const PORT = process.env.PORT || 9999;

const { similarRouter } = require('./routes/similar');
const { productRouter } = require('./routes/product');
const { authMiddleware } = require('./middlewares/auth');

const app = new Express();

app.get('/', (_, res) => res.json({ status: 'ok' }));

app.use(authMiddleware)
app.use(similarRouter);
app.use(productRouter);

module.exports = app