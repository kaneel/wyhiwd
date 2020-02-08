"use strict"

var Klass = require("korbutJS/src/class").class

module.exports.EE = Klass(function(Super, statics) {
  return {
      constructor: function EE() {}
    , on: {
        value: function(type, handler) {
          var events = this.events = this.events || {}
          var typeArr = type.split(" ")

          if (typeArr.length > 1) {
            for (var i = typeArr.length; i--; ) {
              this.on(typeArr[i], handler)
            }

            return;
          }

          if (typeof events[type] == "undefined") {
            events[type] = []
          }

          events[type].push(handler)

          return this
        }
      }
    , off: {
        value: function(type, handler) {
          var events = this.events = this.events || {}
          var typeArr = type.split(" ")
          var eventArr = null

          if (typeArr.length > 1) {
            for (var i = typeArr.length; i--; ) {
              this.off(typeArr[i], handler)
            }

            return;
          }

          eventArr = [].concat(events[type] || [])

          if (typeof eventArr != "undefined") {
            for (var i = eventArr.length; i--; ) if (eventArr[i] === handler) {
                eventArr.splice(i, 1)
            }

            this.events[type] = eventArr
          }


          return this
        }
    }
    , trigger: {
          value: function(type, args) {
            var events = this.events = this.events || {}
            var eventArr = [].concat(this.events[type] || [])

            if (typeof args === "undefined") {
              args = []
            } else if (Object.prototype.toString.call(args) != "[object Array]") {
              args = [].slice.call(arguments, 1)
            }

            for (var i = eventArr.length; i--; ) {
              eventArr[i].apply(this, (args || []))
            }

            return this
          }
      }
    }
})
