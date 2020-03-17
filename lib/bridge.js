'use strict'

const Hapi = require('@hapi/hapi')

async function bootstrap (route, fn) {
  let server = Hapi.server()
  server.route(route)
  fn && await fn(server)
  return server
}

exports.hapda = async function (route, fn) {
  let server = await bootstrap(route, fn)
  return async (req, res) => {
    let { payload, statusCode } = await server.inject({
      method: req.method,
      url: req.url,
      payload: req.body
    })
    res.statusCode = statusCode
    return res.end(payload)
  }
}
