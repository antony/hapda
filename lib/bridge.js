'use strict'

const Hapi = require('@hapi/hapi')

async function bootstrap (route, fn) {
  let server = Hapi.server()
  server.route(route)
  fn && await fn(server)
  return server
}

exports.hapda = function (route, fn) {
  let server

  return async (req, res) => {
    server || await bootstrap(route, fn)
    let { payload, statusCode } = await server.inject({
      method: req.method,
      url: req.url,
      payload: req.body
    })
    res.statusCode = statusCode
    return res.end(payload)
  }
}
