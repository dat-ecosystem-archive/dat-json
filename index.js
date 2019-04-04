const stringKey = require('dat-encoding').toStr
const xtend = Object.assign
const toiletdb = require('toiletdb')

module.exports = (...args) => new DatJsonDb(...args)

class DatJsonDb {
  constructor (archive, opts) {
    if (!opts) opts = {}
    this.archive = archive
    this.db = toiletdb({ name: '/dat.json', fs: archive })
    this.fileDb = opts.file ? toiletdb(opts.file) : null
  }

  read () {
    const self = this
    return new Promise((resolve, reject) => {
      this.archive.stat('/dat.json', async function (err, stat) {
        if (err) return reject(err)
        resolve(await self.db.read())
      })
    })
  }

  write (key, val) {
    return new Promise(async (resolve, reject) => {
      if (!this.archive.writable) {
        return reject(new Error('Archive not writable'))
      }

      if (typeof key === 'object') {
        try {
          await this._writeAll(key)
          resolve()
        } catch (e) {
          reject(e)
        }
        return
      }

      // TODO: validate things
      if (!this.fileDb) {
        try {
          await this.db.write(key, val)
          resolve()
        } catch (e) {
          reject(e)
        }
        return
      }

      // write to file then archive
      // TODO: use hyperdrive indexing false option, need to talk to mafintosh about
      //   https://botbot.me/freenode/dat/2017-05-12/?msg=85554242&page=3
      try {
        await this.fileDb.write(key, val)
        await this.db.write(key, val)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  async delete (key) {
    await this.db.delete(key)
  }

  create (data) {
    return new Promise(async (resolve, reject) => {
      if (!this.archive.writable) {
        return reject(new Error('Archive not writable'))
      }

      data = xtend(this.getdefaults(), data)
      try {
        await this.write(data)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  _writeAll (data, cb) {
    const self = this
    return new Promise((resolve, reject) => {
      const keys = Object.keys(data)
      let pending = keys.length
      keys.map(async function (key) {
        try {
          await self.write(key, data[key])
        } catch (e) {
          reject(e)
        }
        if (!--pending) return resolve()
      })
    })
  }

  getdefaults () {
    return {
      title: '',
      description: '',
      url: 'dat://' + stringKey(this.archive.key)
    }
  }
}
