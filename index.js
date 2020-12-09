const PORT = process.env.PORT || 9999;
const app = require('./app')

app.listen(PORT, console.log(`Listening to http://localhost:${PORT}`));

module.exports = app