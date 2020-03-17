'use strict'

const { hapda } = require('./bridge')
const { expect } = require('@hapi/code')
const fetch = require('node-fetch')
const server = require('../test/mock-http')

describe('hapda', () => {
  context('request', () => {
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
})