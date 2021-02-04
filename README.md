# gkc-sfbl

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

kimchi style's split file by line count moudle.

### Example
```javascript
const sfbl = require('gkc-sfbl')

sfbl('/var/log/abc.txt', {
  file: {
    source: {
      encoding: 'utf8', // See iconv-lite encoding. Default utf8, 
      deleteOnSuccess: false // If true, abc.txt will be deleted after split file operation is finished. Default false
    },
    split: {
      eachLines: 1000, // Divides the file by 1000 lines. Default 1000
      allHasHeader: false, // The first line of abc.txt becomes the header. If the value is true, the header is placed on the first line of all divided files. Default false
      storage: './' // The directory path to store the split files. It is based on the directory path of the file to be split. In the example, /var/log is the storage. Default ./
      // storage: './result' If you set it to ../result, it will create a directory /var/result and store the split files in /var/result.
    }
  }
})
  .then(response => {
    // response = { storage: '/var/log', splited: 6 }
    // This means that the divided files are stored in /home/var and the number of divided files is 6.
    console.log(response)
  })
  .catch(error => {
    console.error(error)
  })
  .finally(() => {
    process.exit()
  })
```
License
----

MIT

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [dill]: <https://github.com/joemccann/dillinger>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [john gruber]: <http://daringfireball.net>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [markdown-it]: <https://github.com/markdown-it/markdown-it>
   [Ace Editor]: <http://ace.ajax.org>
   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [AngularJS]: <http://angularjs.org>
   [Gulp]: <http://gulpjs.com>

   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>
   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>
   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>
