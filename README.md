# SWF.js [![Build Status](https://travis-ci.org/uupaa/SWF.js.png)](http://travis-ci.org/uupaa/SWF.js)

[![npm](https://nodei.co/npm/uupaa.swf.js.png?downloads=true&stars=true)](https://nodei.co/npm/uupaa.swf.js/)

SWF file parser

## Document

- [SWF.js wiki](https://github.com/uupaa/SWF.js/wiki/SWF)
- [WebModule](https://github.com/uupaa/WebModule)
    - [Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html)
    - [Development](https://github.com/uupaa/WebModule/wiki/Development)

## Run on

### Browser and node-webkit

```js
<script src="lib/SWF.js"></script>
<script>
SWF.load("a.swf", function(buffer) {
    var swfParseDataObject = SWF.parse(buffer);
});
</script>
```

### WebWorkers

```js
importScripts("lib/SWF.js");

```

### Node.js

```js
require("lib/SWF.js");

```


