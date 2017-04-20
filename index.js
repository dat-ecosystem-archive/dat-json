var stringKey = require('dat-encoding').toStr
// var path = require('path')
var xtend = require('xtend')
var toiletdb = require('toiletdb')

module.exports = function (archive) {
  var db = toiletdb({name: '/dat.json', fs: archive})
  var that = {
    read: function (cb) {
      archive.stat('/dat.json', function (err, stat) {
        if (err) return cb(err)
        db.read(cb)
      })
    },
    write: function (key, val, cb) {
      if (!archive.writable) return cb(new Error('Archive not writable'))
      if (typeof key === 'object') return writeAll(key, val) // assume val = cb
      // TODO: validate things
      db.write(key, val, cb)
    },
    delete: db.delete,
    create: function (data, cb) {
      if (typeof data === 'function') return that.create(null, data)
      if (!archive.writable) return cb(new Error('Archive not writable'))
      var defaults = xtend({
        title: '', // TODO path.basename(dir),
        name: '',
        description: ''
      }, data, {
        url: 'dat://' + stringKey(archive.key) // force the key as default
      })
      that.write(defaults, cb)
    }
  }

  return that

  function writeAll (data, cb) {
    if (!archive.writable) return cb(new Error('Archive not writable'))
    var keys = Object.keys(data)
    var pending = keys.length
    keys.map(function (key) {
      that.write(key, data[key], function (err) {
        if (err) return cb(err)
        if (!--pending) return cb()
      })
    })
  }
}
