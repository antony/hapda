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
exports.someRoute = hapda({
  method: 'GET',
  path: '/foo/bar',
  handler: () => {
    return { baz: 'qux' }
  }
})
```

and then publish your serverless function as normal.

#### How do I use plugins?

You can access the entire Hapi instance by passing a method which is given the Hapi instance as a parameter.

```js
const myMethod = async server => {
  server.plugins(...) // or routes, handlers, anything you can do with Hapi at all.
}

exports.someRoute = hapda(myRoute, myMethod)
```
