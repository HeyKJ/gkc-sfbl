const fs = require('fs')

module.exports = filepath => {
  if (!filepath)
    throw new Error('first argument filepath is empty')
  else if (fs.existsSync(filepath) === false)
    throw new Error(`${filepath} not exists`)
}
