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
    
    let { payload, statusCode, headers } = await server.inject({
      headers: req.headers,
      method: req.method,
      url: req.url,
      payload: req.body
    })
    res.statusCode = statusCode
    Object.entries(headers).forEach(([ name, value ]) => res.setHeader(name, value))
    return res.end(payload)
  }
}
