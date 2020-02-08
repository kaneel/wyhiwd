"use strict"

var Promise = require("korbutJS/src/Promise").Promise
var Klass = require("korbutJS/src/class").class

var ImageSeq = module.exports.ImageSeq = Klass(function(Super, statics) {
  return {
      constructor: function(arr) {
        var promises = []
        this.arr = []
        this.isPlaying = false

        while(arr.length)
          void(function(o) {
            o = new ImageObject(arr[0])
            this.arr.push(o)
            promises.push(o.loadPromise)
            arr.shift()
          }.bind(this))

        this.loadPromise = q.when(promises)
      }
    , play: {
          value: function(t) {
            this.isPlaying = true
          }
      }
    , pause: {
          value: function() {
            this.isPlaying = false
          }
      }
    , gotTo: {
          value: function() {

          }
      }
    , rewind: {
          value: function() {

          }
      }
    , forward: {
          value: function() {

          }
      }
  }
})

var ImageObject = module.exports.Image = Klass(function(Super, statics) {
  return {
      constructor: function(src) {
        this.image = new Image()

        this.loadPromise = new Promise(function(resolve, reject) { // bind on onload || onerror
          this.image.addEventListener("load", function() {
            resolve(this)
          }.bind(this))
          this.image.addEventListener("error", function() {
            reject(new Error(this.image.src))
          }.bind(this))
        }.bind(this))

        this.readyPromise = this.loadPromise.then(function(img) {
          return new Promise(function(resolve, reject) { // load image into an imageData, save it
            var c = document.createElement("canvas")
            var ctx = c.getContext("2d")

            c.width = img.image.width
            c.height = img.image.height

            ctx.drawImage(img.image, 0, 0)

            img.imageData = ctx.getImageData(0, 0, img.image.width, img.image.height)

            resolve(img.imageData)

            c = ctx = null
          })
        })

        this.image.src = src
      }
  }
})
