'use strict'

const { hapda } = require('./bridge')
const { expect } = require('@hapi/code')
const fetch = require('node-fetch')
const server = require('../test/mock-http')

describe('hapda', () => {
  context('path', () => {
    beforeEach(async () => {
      const endpoint = await hapda({
        method: 'GET',
        path: '/foo/bar',
        handler: () => {
          return { baz: 'qux' }
        }
      })

      await server.start(endpoint)
    })

    afterEach(() => {
      server.stop()
    })

    it('returns expected response', async () => {
      const res = await fetch(`${server.getHost()}/foo/bar`)
      const { baz } = await res.json()
      expect(baz).to.equal('qux')
    })
  })

  context('headers', () => {
    beforeEach(async () => {
      const endpoint = await hapda({
        method: 'GET',
        path: '/foo/bar',
        handler: request => {
          return request.headers
        }
      })

      await server.start(endpoint)
    })

    afterEach(() => {
      server.stop()
    })

    it('returns expected response', async () => {
      const headers = {
        quux: 'garply'
      }

      const res = await fetch(`${server.getHost()}/foo/bar`, {
        headers
      })
      const payload = await res.json()
      expect(payload).to.include(headers)
    })

    it('has hapi content-type header', async () => {
      const res = await fetch(`${server.getHost()}/foo/bar`)
      expect(res.headers.get('content-type')).to.equal('application/json; charset=utf-8')
    })
  })
})