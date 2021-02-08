const fs = require('fs')
const path = require('path')
const util = require('util')
const promisifyWrite = util.promisify(fs.write)

module.exports = class Spliter {
  constructor () {
    this.filehandle = null
    this.fileNumber = 1
    this.storage = undefined
    this.name = undefined
    this.header = undefined
    this.count = undefined
    this.pushCount = 0
  }

  splitBy (count) {
    this.count = count
    return this
  }

  saveAt (storage) {
    if (fs.existsSync(storage) === false)
      fs.mkdirSync(storage, { recursive: true })

    this.storage = storage
    return this
  }

  saveLike (_this) {
    this.name = _this
    return this
  }

  async push (line) {
    if (!this.filehandle) {
      const wFilename = this.name.replace(/{{numbering}}/, this.fileNumber)
      const wFilepath = path.join(this.storage, wFilename)
      this.filehandle = await fs.promises.open(wFilepath, 'w')

      if (this.header)
        await promisifyWrite(this.filehandle.fd, this.header)
    }

    await promisifyWrite(this.filehandle.fd, line)

    if (++this.pushCount === this.count) {
      this.pushCount = 0
      this.fileNumber++
      this.filehandle.close()
      this.filehandle = null
    }
  }

  close () {
    if (this.filehandle)
      this.filehandle.close()
  }
}
