## Hapda

Define Hapi route handlers for serverless, lambda (req, res) endpoints.

### Features

* Full access to the Hapi API and ecosystem
* Uses shot.inject rather than running a real Hapi instance, meaning no extra TCP overhead, no extra HTTP overhead
* Clean and concise, doesn't get in your way
* Leverage entire existing Hapi ecosystem, validation, plugins, caching, architecture
* Build battle-tested serverless handlers instead of hacking together raw http endpoints

### What is it?

If like me, you like the idea of serverless but dislike the lambda / node http / express / polka API format, and prefer Hapi's routing, this allows you to do the following:

```js
const { hapda } = require('hapda')

module.exports = hapda({
  method: 'GET',
  path: '/foo/bar',
  handler: () => {
    return { baz: 'qux' }
  }
})
```

and then publish your serverless function as normal.

### How do I use plugins?

You can access the entire Hapi instance by passing a method which is given the Hapi instance as a parameter.

```js
const myMethod = async server => {
  server.plugins(...) // or routes, handlers, anything you can do with Hapi at all.
}

module.exports = hapda(myRoute, myMethod)
```

#### An example with some caching and auth

The following example does two things:

* Sets up authentication in basic mode (with a super secure password ;))
* Sets up a cached server-function whose value is cached for 15 seconds

```js
const validate = async (request, username, password, h) => {
  const isValid = username === 'admin' && password === 'admin123'
  return { isValid, credentials: { id: 123, username } }
}

async function setupServer (server) {
  await server.register(require('@hapi/basic'))
  server.auth.strategy('simple', 'basic', { validate })
  server.auth.default('simple')

  server.method(
    'time',
    () => new Date(),
    {
      cache: {
        expiresIn: 15000,
        generateTimeout: 100
      }
    }
  )
}

const route = {
  method: 'PUT',
  path: '/foo/bar',
  handler: () => {
    return { lastCachedTime: server.methods.time() }
  }
}

module.exports = hapda(route, setupServer)
```

### Troubleshooting

#### Caching / Plugin X doesn't work.

For reasons of speed, Hapda doesn't call `initialize()` on bootstrap. Normally, this function would be called by `server.start()` but because we don't call that, or bind to a port or listen for HTTP connections, it never gets called. If you find that you need to call `initialize()` to finalize plugin registration or start caching, you can do so using the server setup method:


```js
async function setupServer (server) {
  await server.register(someComplexPlugin)
  await server.initialize()
}

const route = {
  method: 'GET',
  path: '/foo/bar',
  handler: () => {
    return { foo: 'bar' }
  }
}

module.exports = hapda(route, setupServer)
```