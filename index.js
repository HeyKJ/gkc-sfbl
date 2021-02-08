const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const iconv = require('iconv-lite')
const util = require('util')
const ReadLine = require('n-readlines')
const validate = require('./libs/validator')
const Spliter = require('./libs/Spliter')

const DEFAULT_OPTION = {
  file: {
    source: {
      encoding: 'utf8',
      deleteOnSuccess: false
    },
    split: {
      encoding: 'utf8',
      lineDelimiter: '\n',
      eachLines: 1000,
      allHasHeader: false,
      storage: './'
    }
  }
}

module.exports = async (filepath, yourOption = DEFAULT_OPTION) => {
  let spliter

  try {
    validate(filepath)

    const option = _.merge({}, DEFAULT_OPTION, yourOption)
    const { dir, name, ext } = path.parse(filepath)
    spliter = new Spliter()
    spliter.splitBy(option.file.split.eachLines)
           .saveAt(path.join(dir, option.file.split.storage))
           .saveLike(name + '_{{numbering}}' + ext)

    let line
    let lineCount = 0
    const liner = new ReadLine(filepath)

    while (line = liner.next()) {
      line = iconv.decode(line, option.file.source.encoding)
      line = iconv.encode(line.replace(/\r/, '') + option.file.split.lineDelimiter, option.file.split.encoding)

      if (++lineCount === 1 && option.file.split.allHasHeader === true) {
        spliter.header = line
        continue
      }

      await spliter.push(line)
    }

    if (option.file.source.deleteOnSuccess === true)
      fs.unlinkSync(filepath)

    return {
      storage: spliter.storage,
      splited: spliter.fileNumber
    }
  } catch (e) {
    throw e
  } finally {
    if (spliter)
      spliter.close()
  }
}
