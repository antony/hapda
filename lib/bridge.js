'use strict'

const Hapi = require('@hapi/hapi')

async function bootstrap (route, fn) {
  let server = Hapi.server()
  fn && await fn(server)
  server.route(route)
  return server
}

exports.hapda = function (route, fn) {
  let server

  return async (req, res) => {
    if (!server) {
      server = await bootstrap(route, fn)
    }
    
    let { payload, statusCode } = await server.inject({
      method: req.method,
      url: req.url,
      payload: req.body
    })
    res.statusCode = statusCode
    return res.end(payload)
  }
}
