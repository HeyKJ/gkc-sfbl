const path = require('path')
const readline = require('godkimchi-read-line')
const fs = require('fs')

const DEFAULT_OPTION = { limit: 1000, encoding: 'utf8', allHasHeader: false }

module.exports = async function (filepath = '', yourOption = DEFAULT_OPTION, cb = undefined) {
  if (typeof arguments[1] === 'function') {
    yourOption = DEFAULT_OPTION
    cb = arguments[1]
  }

  const option = Object.assign({}, DEFAULT_OPTION)
  setupOption(option, yourOption)

  var label = 0
  var header
  var splitFilepath
  const dirname = path.dirname(filepath)
  const ext = path.extname(filepath)
  const filename = path.basename(filepath).replace(new RegExp(ext), '')

  const splitFilepaths = []

  await readline(filepath, { encoding: option.encoding }, (err, response) => {
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
      splitFilepath = dirname + path.sep + filename + '_' + label + ext
      splitFilepaths.push(splitFilepath)
      // if allHasHeader = true, all file has all file has header
      if (option.allHasHeader === true) {
        fs.appendFileSync(splitFilepath, header + '\n')
      }
    }

    fs.appendFileSync(splitFilepath, line + '\n')

    return true
  })

  return splitFilepaths
}

function setupOption (option = {}, yourOption = {}) {
  Object.keys(yourOption).forEach(key => {
    if (option.hasOwnProperty(key)) {
      option[key] = yourOption[key]
    }
  })
}
