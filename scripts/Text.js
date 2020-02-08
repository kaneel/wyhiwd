"use strict"

var EE = require("./EE").EE
var Klass = require("korbutJS/src/class").class

var Cursor = Klass(EE, function(Super, statics) {
  return {
      constructor: function(w, h, t) {
        this.width = w
        this.height = h
        this.pos = 0
        this.lastMove = 0
        this.lastBlink = +(new Date)
        this.wait = false
        this.isBlinking = true
        this.timeBeforeBlank = t
        this._disp = true
      }
    , update: {
          value: function(t) {
            t = +(new Date)
            if (t > this.lastMove + 500)
              this.trigger("isBlinking", [this.isBlinking = true])
          }
      }
    , move: {
          value: function(newPos, moved) {
            moved = false

            if (typeof newPos == "number" && newPos != this.pos)
              this.pos = pos, moved = true
            else
              this.pos += 1, moved = true

            if (moved && this.isBlinking)
              this.trigger("isBlinking", [this.isBlinking = false])

            this.lastMove = +(new Date)
          }
      }
    , render: {
          value: function(ctx) {
              var disp = this._disp
              var now = +(new Date)

              if (this.isBlinking && now > this.lastBlink + this.timeBeforeBlank) {
                disp = this._disp = !this._disp
                this.lastBlink = now
              }

              if (!this.isBlinking) disp = this._disp = true

              if (disp)
                ctx.fillRect(this.pos*this.width, 0, this.width, this.height)
          }
      }
  }
})

var TextGrid = module.exports.TextGrid = Klass(function(Super, statics) {
  return {
      constructor: function(gridW, gridH, blockW, blockH) {
        this.numBlocks = (0|(gridW/blockW) * 0|(gridH/blockH))
        this.blockW = blockW
        this.blockH = blockH
        this.cursor = new Cursor(blockW, blockH, 500)
        this.blocks = new Array(/*this.numBlocks*/)
      }
    , write: {
        value: function(value) {
          // set cursor to false
          this.cursor.isBlinking = false
          // type text
          this.blocks[this.cursor.pos] = value
          // move cursor
          this.cursor.move()
        }
      }
    , delete: {
          value: function() {
            this.cursor.move(this.cursor.pos - 1)
          }
      }
    , clean: {
          value: function() {
            this.cursor.pos = 0
            this.blocks.length = 0
          }
      }
    , render: {
          value: function(t) {
            this.cursor.update()

            if (typeof this._render == "function")
              this._render(function(ctx) {
                // render cursor
                this._cursorStyle()
                this.cursor.render(ctx)

                // render text
                // TODO: find a valid way, reusable way to declare colors somewhere else
                this._textStyle()
                for (var i = 0, max = this.blocks.length; i < max; i++) {
                  ctx.fillText(this.blocks[i], i*this.blockW, 50, this.blockW)
                }
              }.bind(this))
          }
      }
  }
})
