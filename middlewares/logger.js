const logger = (req, res, next) => {
  const { headers, url } = req
  console.log(JSON.stringify({ headers, url }, null, 2))

  return next()
}

module.exports = { logger }