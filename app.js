const Express = require('express');
const bodyParser = require('body-parser');

const { similarRouter } = require('./routes/similar');
const { authMiddleware } = require('./middlewares/auth');

const app = new Express();

app.use(bodyParser.json());

app.get('/', (_, res) => res.json({ status: 'ok' }));

app.use(authMiddleware);
app.use(similarRouter);

module.exports = app;
