[![deprecated](http://badges.github.io/stability-badges/dist/deprecated.svg)](https://dat-ecosystem.org/) 

More info on active projects and modules at [dat-ecosystem.org](https://dat-ecosystem.org/) <img src="https://i.imgur.com/qZWlO1y.jpg" width="30" height="30" /> 

---

# dat-json

read &amp; write dat.json files. Uses toiletdb under the hood.

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

## Install

```
npm install dat-json
```

## Usage

```js
var DatJSON = require('dat-json')

var datjson = DatJSON(archive)

await datjson.create({title: 'a dat', description: 'exciting'})

console.log(await datjson.read())
```

Write to a `dat.json` on the file system also:

```js
var DatJSON = require('dat-json')

var datjson = DatJSON(archive, {file: path.join(dat.path, 'dat.json')})

await datjson.create({title: 'a dat', description: 'exciting'})
```

**TODO: replace file option with hyperdrive indexing**

## API

### `var datjson = DatJSON(archive, [opts])`

create a new datJson db

Options:

* `opts.file` - dat.json file path, updates will be written to file system and archive

#### `await datjson.create([data])`

Create a new `dat.json` file in the archive with the default keys (`url`, `title`, `description`). Pass in any additional data to add on initial create.

#### `await datjson.write(key, val)` or `await datjson.write(data)`

Write a single `key` and `value` or an object, `data`, to the `dat.json` file. Use `file` option above to also update the file on the file system.

#### `await datjson.delete(key)`

Delete a `key` from the `dat.json` file.

#### `await datjson.read()`

Read the current `dat.json`.

## License

[MIT](LICENSE.md)

[npm-image]: https://img.shields.io/npm/v/dat-json.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/dat-json
[travis-image]: https://img.shields.io/travis/datproject/dat-json.svg?style=flat-square
[travis-url]: https://travis-ci.org/datproject/dat-json
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard
