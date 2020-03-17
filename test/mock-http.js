'use strict'

const { once } = require('events')
const http = require('http')

let server
let host

exports.start = async function (endpoint) {
  server = http.createServer(endpoint)
  server.listen(null, '0.0.0.0')
  await once(server, 'listening')
  const { address, port } = server.address()
  host = `http://${address}:${port}`
}

exports.stop = function () {
  server.close()
}

exports.getHost = function () {
  return host
}