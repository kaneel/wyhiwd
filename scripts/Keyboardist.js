"use strict"

var Klass = require("korbutJS/src/class").class

module.exports.Keyboardist = Klass(function(Super, statics) {
  return {
      constructor: function(texts, grid) {
        this.texts = texts
        this.grid = grid
        this.choice = 0
        this.index = 0
      }
    , type: {
          value: function(t) {
            if (this.index+1 <= this.texts[this.choice].length) {
              this.grid.write(this.texts[this.choice][this.index++])
              this.lastKeyStroke = t
            }
          }
      }
    , choose: {
          value: function(idx, choice) {
            this.index = 0

            if (typeof idx == "number")
              choice = idx
            else if (typeof idx == "string")
              choice = this.choice + parseInt(idx)
            else
              choice = 0|(Math.random()*this.texts.length)

            if (typeof this.texts[choice] != "undefined")
              this.choice = choice
            else
              this.choice = 0
          }
      }
    , delete: {
          value: function(bool) {
            if (typeof bool == "boolean" && bool == true)
              this.grid.clean()
            else
              this.grid.delete()
          }
      }
  }
})
