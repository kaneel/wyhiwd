"use strict"

var EE = require("./EE").EE
var Klass = require("korbutJS/src/class").class

var Sequence = module.exports.Sequence = Klass(EE, function(Super, statics) {

  return {
      constructor: function Sequence(name) {
        if (typeof name != "undefined")
          this.name = name
        else
          this.name = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c, d, r) {
            d = +(new Date());
            r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x7|0x8)).toString(16);
          })
      }
    , handlers: {
        get: function() {
          return this._handlers || (this._handlers = [])
        }
      }
    , addHandler: {
        value: function(func) {
          this.handlers.push(func)
        }
      }
    , values: {
        get: function() {
          return this._values || (this._values = {})
        }
      }
    , set: {
        value: function(k, v) {
          this.values[k] = v
        }
      }
    , get: {
        value: function(k) {
          return this.values[k]
        }
      }
    , play: {
        value: function(time, frame) {
          if (time - this.get("start") >= this.get("end"))
            return this.trigger("end", [time, frame])

          for (var i = this.handlers.length; i--; )
            this.handlers[i].call(this, time, frame)
        }
      }
  }
})

var Sequencer = module.exports.Sequencer = Klass(EE, function(Super, statics) {
  var sequencer = null

  return {
      constructor: function() {
        if (sequencer instanceof Sequencer) return sequencer

        this.buffer = []

        if (typeof opts !== "undefined") for (var k in opts) if (opts.hasOwnProperty(k))
          this.options[k] = opts[k]

        sequencer = this
      }
    , options: {
        value: {
          _CHOOSE_TIME: 1000
        }
      }
    , scenes: {
        value: []
      }
    , push: {
        value: function(func, name) {
          var scene

          if (!(func instanceof Sequence))
            scene = new Sequence(name),
            scene.addHandler(func)
          else
            scene = func

          this.scenes.push(scene)
          this.scenes.length += 1
        }
      }
    , choose: {
        value: function(time, i, scene, rand, idx) {
          if (!this.scenes.length) return

          if (typeof i == "undefined")
            i = 0|(Math.random()*this.scenes.length)

          rand = Math.random()*100

          // iterate, test chances
          this.scenes.forEach(function(scene) {
            var self = this
            // if goes beyond random and not in buffer
            if (scene.get("chance") >= rand && !~self.buffer.indexOf(scene)) {
              idx = this.buffer.push(scene) // save index
              scene.set("start", time) // set start time
              scene.trigger("start", [time]) // set start time
              scene.on("end", function sceneEnd() {
                // on end, will remove from buffer by doing a copy and splicing i
                scene.off("end", sceneEnd)
                self.remove(idx-1)
              })
            }
          }.bind(this))
        }
      }
    , remove: {
        value: function(idx) {
          var copy = [].concat(this.buffer)
          copy.splice(idx-1, 1)
          this.buffer = copy
        }
      }
    , play: {
        value: function(time) {
          var marker = parseInt((time||0)/this.options._CHOOSE_TIME)

          if (typeof this._choose_marker == "undefined" || marker > this._choose_marker) {
            this._choose_marker = marker
            this.choose(time)
          }

          for (var i = 0, max = this.buffer.length, buffer; i < max; i++) {
            buffer = this.buffer[i]
            if (typeof buffer != "undefined")
              buffer.play(time, this.frame)
          }

          this.frame = (this.frame||0) + 1
          this._time = time
        }
      }
  }
})
