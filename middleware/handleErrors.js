module.exports = (error, request, response, next) => {
  console.error(error)

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'Id used is malformed' }).end()
  } else {
    response.status(500).end()
  }
}
