'use strict'

const path = require('path')
const fs = require('fs')

const root = path.resolve(process.cwd(), __dirname)

// MODERNIZ MAKE
const UglifyJS = require('uglify-js')
const argv = require('minimist')(process.argv.slice(2))

/* JS MADNESS  */
const b = require('browserify')

let watcher = 0

var makeJS = module.exports.makeJS = function(opts, bopts, dirp) {
  if (!!opts.prod) bopts = {}
  else bopts = {debug:true}

  dirp = root

  // test dir
  fs.readdir(dirp, function(err){
    if (err)
      fs.mkdirs(dirp, function (err) {
        if (err) console.log(err)
        goJS(dirp)
      })
    else
      goJS(dirp)
  })

  function goJS(dirp,ws) {
    // GO MODERNIZR
    ws = fs.createWriteStream(path.join(dirp, '/bundle.js'))
    ws.on('open', function(bf) {
      bf = b(path.join(root, 'scripts/riddim.js'), bopts)
        .bundle()

      bf.on('error', function(err){
        console.log(err.message)
        this.emit('end')
      })

      bf.pipe(ws)
    })

    ws.on('close', function() {
      if (!!opts.prod)
        fs.readFile(path.join(root, '/bundle.js'), function(err, out) {
            if (err) console.log(err)
            out = UglifyJS.minify(out.toString(), {fromString: true})
            fs.writeFile(path.join(root, '/bundle.js'), out.code, function(err) {
              if (err) console.log('JS/ERROR MINIFICATION')
              console.log('JS/MINIFIED')
            })
          })
    })

    ws.on('finish', function() {
      console.log('JS/built')

      if (!!opts.watch)
        fs.watch(path.join(root, 'scripts'), {recursive: true}, function(e) {
          console.log("JS/"+e)
          makeJS({})
        })
    })
  }
}

module.exports.make = function make(opts) {
  makeJS(opts)
}

makeJS(argv)
