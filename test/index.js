var fs = require('fs')
var path = require('path')
var test = require('tape')
var hyperdrive = require('hyperdrive')
var ram = require('random-access-memory')
var DatJSON = require('..')

test('Default dat.json', function (t) {
  var archive = hyperdrive(ram)
  archive.ready(async function () {
    var datjson = DatJSON(archive)
    try {
      await datjson.read()
    } catch (e) {
      t.ok(e, 'error read before write')
    }

    try {
      await datjson.create({ name: 'test' })
      const data = await datjson.read()
      t.ok(data, 'has metadata')
      t.same(data.url, `dat://${archive.key.toString('hex')}`)
      t.same(data.name, 'test', 'has name value')
    } catch (e) {
      t.ifErr(e)
    }
    t.end()
  })
})

test('Write dat.json to archive', function (t) {
  var archive = hyperdrive(ram)
  archive.ready(async function () {
    var datjson = DatJSON(archive)
    try {
      await datjson.create()
      await datjson.write({ specialVal: 'cat' })

      var data = await datjson.read()
      t.ok(data, 'has metadata')
      t.same(data.url, `dat://${archive.key.toString('hex')}`, 'url ok')
      t.same(data.specialVal, 'cat', 'has special value')
    } catch (e) {
      t.error(e, 'no error')
    }
    t.end()
  })
})

test('.create with no writable archive errors', async function (t) {
  var archive = { writable: false }
  var datjson = DatJSON(archive)
  try {
    await datjson.create()
  } catch (err) {
    t.is(err.message, 'Archive not writable', 'should error')
  }
  t.end()
})

test('.write with key/value and no writable archive errors', async function (t) {
  var archive = { writable: false }
  var datjson = DatJSON(archive)
  try {
    await datjson.write('key', 'value')
  } catch (e) {
    t.is(e.message, 'Archive not writable', 'should error')
  }
  t.end()
})

test('.write with data object and no writable archive errors', async function (t) {
  var archive = { writable: false }
  var datjson = DatJSON(archive)
  try {
    await datjson.write({ specialVal: 'cat' })
  } catch (e) {
    t.is(e.message, 'Archive not writable', 'should error')
  }
  t.end()
})

test('Write dat.json to file and archive', function (t) {
  var archive = hyperdrive(ram)
  var file = path.join(__dirname, 'dat.json')
  archive.ready(async function () {
    var datjson = DatJSON(archive, { file: file })
    try {
      await datjson.create()
      await datjson.write({ specialVal: 'cat' })

      var data = fs.readFileSync(file, 'utf-8')
      data = JSON.parse(data)
      t.ok(data, 'fs has metadata')
      t.same(data.url, `dat://${archive.key.toString('hex')}`, 'fs url ok')
      t.same(data.specialVal, 'cat', 'fs has special value')
      fs.unlinkSync(file)

      data = await datjson.read()
      t.ok(data, 'has metadata')
      t.same(data.url, `dat://${archive.key.toString('hex')}`, 'url ok')
      t.same(data.specialVal, 'cat', 'has special value')
    } catch (e) {
      t.error(e, 'no error')
    }
    t.end()
  })
})
