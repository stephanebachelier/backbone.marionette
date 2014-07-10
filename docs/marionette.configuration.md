# Marionette Configuration

Marionette has a few globally configurable settings that will
change how the system works. While many of these subjects are covered
in other docs, this configuration doc should provide a list of the
most common items to change.

## Documentation Index

* [Marionette.Deferred](#deferred)
* [Marionnette in AMD](#amd)

## Marionette.Deferred <a name="deferred"></a>

By default, Marionette makes use of `Backbone.$.Deferred` to create
thenable objects. All that is needed is a Deferred that has the
following properties:

1. `promise`: a Promises/A+ thenable, or a function that returns one
2. `resolve`: a function that resolves the provided promise with a value

For example:

```js
var deferred = Marionette.Deferred();

_.result(deferred, 'promise').then(function (target) {
    console.log("Hello, " + target + "!");
});

deferred.resolve("world"); // asynchronous "Hello, world!"
```

If you wish to use a specific promise library, you can override the default via:

```js
Marionette.Deferred = myDeferredLib;
```

## Marionette in AMD <a name="amd"></a>

Marionette is defined as an anonymous module, which makes it portable. It exists in two distribution forms: 
 * the bundled one which gives you `Backbone.Marionette`, `Backbone.Wreqr` and `Backbone.Babysitter` in one file, `lib/backbone.marionette.js`
 * the core one which gives you `Backbone.Marionette` only in a single file, `lib/core/backbone.marionette.js`.

Choosing one is really a matter of choice.

### Marionette as a bundle
If you don't need `Backbone.Wreqr` or `Backbone.Babysitter` in any other modules you have, then you can choose the bundled form.
But if your use case impose the choice of the bundle one, or if you don't want to manage dependencies you may use the bundle with RequireJS 2.1.10+. The 2.1.10 version introduced the concept of [bundles](http://requirejs.org/docs/api.html#config-bundles) which is exactly this purpose. But you will have to provide additional config to RequireJS.

### Marionette as a single file

You can look at the UMD wrapper, which for the AMD part looks like:

```js
  // bundled version includ Backbone.Babysitter and Backbone.Wreqr which means that it has only Backbone and Underscore dependencies
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore'], function(Backbone, _) {
      return (root.Marionette = factory(root, Backbone, _));
    });
  }
```

It means Marionette only needs `Backbone` and `underscore` as dependencies.

### How to define a dependency to Marionette

Marionette being defined as an anonymous module, which means that the definition of the package don't impose an ID, you have lots of opportunities. It is a good thing as it is portable.

Thus, which name your modules will need to ask for marionette dependency is up to you. It will really depends on the layout of your project.

#### Everything in the same place

If all your 3rd parties files are in the same place, the name of the file will matters, as it will be used by RequireJS as the module ID. Thus the name of the file will be `backbone.marionette.js`. 
Provided `backbone.marionette.js` is in the `scripts` directory which is the base url for all yours scripts, then you can simply require the Marionette dependency as `backbone.marionette`. 

```js
require.config({
  // ...
  baseUrl: 'scripts',
  // marionette file will be in ./backbone.marionette.js'

  // ...
});
```

If you require the dependency `marionette`, it will fail as the file `scripts/marionette.js` does not exist.

As a final note to this example, this is not a good practice as you will have to manually add all your dependencies and update them manually which may be a nightmare.

#### Using a package manager, Bower for example

If you use a package manager like bower you will use the [paths](http://requirejs.org/docs/api.html#config-paths) configuration, as you will have to tell RequireJS where to find the dependencies. It's a like a map where the key is the module ID while the value is the full path from the [baseUrl](http://requirejs.org/docs/api.html#config-baseUrl) where to find the module.

First you need to install the `Backbone.Marionette`:
```bash
$ bower install (--save or -S|--save-dev or -D) backbone.marionette
```

then in your RequireJS configuration you will have:

```js
require.config({
  // ...
  paths: {
    // single file
    marionette: 'path/to/backbone.marionette/lib/core/backbone.marionette'
    // OR
    // bundle
    
  },
  // ...
});
```


#### Using RequireJS [map](http://requirejs.org/docs/api.html#config-map) configuration

This one is for an advanced usage. It basically permits to map a module ID to another value, which means you can map a module name eg `foo` to another different name say `bar` and when you require `bar` you will be served `foo`.

In our context it means if you register `Marionette` under the name `marionette` but you need to require `backbone.marionette` at some place you can use the following RequireJS configuration: 

```js
requirejs.config({
  // ...
  map: {
    '*': {
      'marionette': 'backbone.marionette'
  },
  // ...
```

The `*` stands for all the module which basically means the default mapping. When you will require `marionette`, you will be served `backbone.marionette.js` file.


### Example

In this example Marionette is registered as `marionette`, which means that you must have something like this in the requirejs configuration paths:
 
 ```js
 require.config({
   // ...
   paths: {
     marionette: 'path/to/backbone.marionette/lib/core/backbone.marionette'
   },
   // ...
 });
 ```
 
 If you set the path to marionette library to `backbone.marionette`, then you must change the import in the example above to:
 
 ```js
 define(['backbone.marionette', 'lib/tooltip'], function(Marionette, Tooltip) {
 ```
