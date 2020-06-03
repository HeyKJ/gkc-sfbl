const path = require('path')
const readline = require('godkimchi-read-line')
const { createWriteStream } = require('fs')

const DEFAULT_OPTION = { limit: 1000, encoding: 'utf8', allHasHeader: false }

module.exports = async function (filepath = '', yourOption = DEFAULT_OPTION, cb = undefined) {
  if (typeof arguments[1] === 'function') {
    yourOption = DEFAULT_OPTION
    cb = arguments[1]
  }

  const option = Object.assign({}, DEFAULT_OPTION)
  setupOption(option, yourOption)

  var label = 0
  var stream
  var header
  const dirname = path.dirname(filepath)
  const ext = path.extname(filepath)
  const filename = path.basename(filepath).replace(new RegExp(ext), '')

  const splitFilepaths = []

  await readline(filepath, { encoding: option.encoding }, async (err, response) => {
    if (err) {
      throw err
    }

    const { line, lineCount } = response

    if (lineCount === 1) {
      header = line
    }

    if (lineCount > option.limit * label) {
      // next file label path
      ++label
      const splitFilepath = dirname + path.sep + filename + '_' + label + ext
      splitFilepaths.push(splitFilepath)
      // flush before change stream
      if (stream) {
        await close(stream)
      }

      stream = createWriteStream(splitFilepath, { flags: 'ax+' })
      // if allHasHeader = true, all file has all file has header
      if (option.allHasHeader === true) {
        write(stream, header)
      }
    }

    write(stream, line)

    return true
  })
  // flush before end process
  if (stream) {
    stream.end()
    await waitClose(stream)
  }

  return splitFilepaths
}

function setupOption (option = {}, yourOption = {}) {
  Object.keys(yourOption).forEach(key => {
    if (option.hasOwnProperty(key)) {
      option[key] = yourOption[key]
    }
  })
}

async function close (stream) {
  stream.end()
  await waitClose(stream)
}

function waitClose (stream) {
  return new Promise(resolve => {
    stream.once('close', () => resolve())
  })
}

async function write (stream, line) {
  if (!stream.write(line + '\n')) {
    await waitDrain(stream)
  }
}

function waitDrain (stream) {
  return new Promise(resolve => {
    stream.once('drain', () => resolve())
  })
}
