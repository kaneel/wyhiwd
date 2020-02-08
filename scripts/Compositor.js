"use strict"

var Klass = require("korbutJS/src/class").class

module.exports.Compositor = Klass(function(Super, statics) {
  return {
      constructor: function Compositor(screen) {
        this.screen = screen
      }
    , layers: {
        get: function() {
          return this._layers || (this._layers = [])
        }
      },
      request: {
        value: function(i) {
          return this.layers[i]
        }
      },
      flatten: {
        value: function() {
          for (var i = this.layers.length; i--; )
            this.screen.putImageData(this.layers[i].context.getImageData(0, 0, this.layers[i].width, this.layers[i].height), 0, 0)
        }
      }
  }
})
