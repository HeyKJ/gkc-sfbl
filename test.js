const test = require('tape')
const splitFrom = require('./index')

test('split test', { skip: false }, t => {
  splitFrom('C:\\Users\\iamhe\\Downloads\\공공데이터활용지원센터_전국 명절 무료주차장 현황_20210205.csv', {
    file: {
      source: {
        encoding: 'euc-kr',
        deleteOnSuccess: false
      },
      split: {
        encoding: 'utf8',
        lineDelimiter: '\r\n',
        eachLines: 2000,
        allHasHeader: false,
        storage: './test'
      }
    }
  })
    .then(response => {
      console.log(response)
    })
    .finally(() => {
      t.end()
    })
})
