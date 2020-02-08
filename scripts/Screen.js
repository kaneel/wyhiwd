"use strict"

var Klass = require("korbutJS/src/class").class

var Screen = module.exports.Screen = Klass(function(Super, statics) {
  return {
      constructor: function Screen(w, h, canvas) {
        if (typeof canvas == "undefined")
            canvas = document.createElement("canvas")

        if (typeof w === "number")
            canvas.width = w

        if (typeof h === "number")
            canvas.height = h

        this.canvas = canvas
        this.width = canvas.width
        this.height = canvas.height
        this.context = canvas.getContext("2d")
      }
    , appendTo: {
          value: function(node) {
            node.appendChild(this.canvas)
          }
      }
    , getImageData: {
          value: function() {
            return this.context.getImageData.apply(this.context, arguments)
          }
      }
    , putImageData: {
          value: function() {
            this.context.putImageData.apply(this.context, arguments)
          }
      }
    , wash: {
          value: function() {
            this.canvas.height = this.canvas.height
          }
      }
  }
})
