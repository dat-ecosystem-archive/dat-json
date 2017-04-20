var test = require('tape')
var hyperdrive = require('hyperdrive')
var ram = require('random-access-memory')
var datJSON = require('..')

test('Default dat.json', function (t) {
  var archive = hyperdrive(ram)
  archive.ready(function () {
    var datjson = datJSON(archive)
    datjson.read(function (err) {
      t.ok(err, 'error read before write')
      datjson.create({name: 'test'}, function (err) {
        t.error(err, 'no error')

        datjson.read(function (err, data) {
          t.error(err, 'no error')
          t.ok(data, 'has metadata')
          t.same(data.url, `dat://${archive.key.toString('hex')}`)
          t.same(data.name, 'test', 'has name value')
          t.end()
        })
      })
    })
  })
})

test('Write dat.json to archive', function (t) {
  var archive = hyperdrive(ram)
  archive.ready(function () {
    var datjson = datJSON(archive)
    datjson.create(function (err) {
      t.error(err, 'no error')
      datjson.write({specialVal: 'cat'}, check)

      function check (err) {
        t.error(err, 'no error')
        datjson.read(function (err, data) {
          t.error(err, 'no error')
          t.ok(data, 'has metadata')
          t.same(data.url, `dat://${archive.key.toString('hex')}`, 'url ok')
          t.same(data.specialVal, 'cat', 'has special value')
          t.end()
        })
      }
    })
  })
})
