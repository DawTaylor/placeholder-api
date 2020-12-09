const VALID_AUTH = 'VGVzdGU6bG85OzhxNjdld2ZyZ3RydGY='

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers

  if(!authorization) {
    return res.status(401).end()
  }

  if(authorization.split(' ')[1] !== VALID_AUTH) {
    return res.status(403).end()
  }

  return next()
}

module.exports = { authMiddleware, VALID_AUTH }