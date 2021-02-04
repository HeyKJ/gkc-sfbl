const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const ReadLine = require('n-readlines')
const iconv = require('iconv-lite')

const DEFAULT_OPTION = {
  file: {
    source: {
      encoding: 'utf8',
      deleteOnSuccess: false
    },
    split: {
      eachLines: 1000,
      allHasHeader: true,
      storage: './'
    }
  }
}

module.exports = async (filepath, yourOption = DEFAULT_OPTION) => {
  try {
    validateSource(filepath)
    const option = _.merge({}, DEFAULT_OPTION, yourOption)
    const storage = setupStorage(filepath, option.file.split.storage)

    let header
    let label = 1
    let line
    let lineCount = 0
    const liner = new ReadLine(filepath)

    while (line = liner.next()) {
      line = iconv.decode(line, option.file.source.encoding)

      debugger
      if (++lineCount === 1 && option.file.split.allHasHeader === true) {
        header = line
        continue
      } else if (lineCount % option.file.split.eachLines === 0)
        label++

      const { name, ext } = path.parse(filepath)
      const newFilename = name + '_' + label + ext
      const newFilepath = path.join(storage, newFilename)

      if (fs.existsSync(newFilepath) === false && option.file.split.allHasHeader === true)
        await fs.promises.appendFile(newFilepath, header + '\n')

      await fs.promises.appendFile(newFilepath, line + '\n')
    }

    if (option.file.source.deleteOnSuccess === true)
      fs.unlinkSync(filepath)

    return {
      storage: storage,
      splited: label
    }
  } catch (e) {
    throw e
  }
}

function validateSource (filepath) {
  if (!filepath)
    throw Error('first argument filepath is empty')
  else if (fs.existsSync(filepath) === false)
    throw Error(`${filepath} not exists`)
}

function setupStorage (standardpath, storage) {
  const dirpath = path.dirname(standardpath)

  if (!storage)
    return dirpath

  const _storage = path.join(dirpath, storage)

  if (fs.existsSync(_storage) === false)
    fs.mkdirSync(_storage, { recursive: true })

  return _storage
}
