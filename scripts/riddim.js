
// requires
var Screen = require("./Screen").Screen
var Compositor = require("./Compositor").Compositor
var ImageObject = require("./Image").Image
var Sequencer = require("./Sequencer")

var Keyboardist = require("./Keyboardist").Keyboardist
var TextGrid = require("./Text").TextGrid

var Sequence = Sequencer.Sequence
var sequencer = new (Sequencer.Sequencer)

var grid = new TextGrid(300, 300, 30, 50)
var keyboardist =  new Keyboardist([
    "They said I'm lame"
  , "That I was wrong"
  , "That I should stop"
  , "That my music sucked"
  , "that I was stupid"
  , "I ended up drunk"
  , "sorry for the noises"
  , "sorry for myself"
  , "can't help"
  , "but feel inadequate"
  , "and in the end"
  , "I believed them"
  , "and..."
  , "thought to myself"
  , "what you hear"
  , "is"
  , "what you deserve"
], grid)

// some variables
var images = ["./i/1.png", "./i/2.png", "./i/3.png", "./i/4.png", "./i/5.png", "./i/6.png", "./i/7.png", "./i/8.png", "./i/tpolm.png", "./i/kaneel.png", "./i/inpuj.png"]
var imgproms = []
var cscreen = new Screen(600, 600)
var oscreen = new Screen(600, 600)
var oscreen2 = new Screen(600, 100)
var oscreen3 = new Screen(600, 100)
var compositor = new Compositor(cscreen)
var sceneDistort = new Sequence
var sceneVLINE = new Sequence
var sceneBlink = new Sequence

var prevImage = 0
var nextImage = 0
var directions = [-1, +1]
var prevProm = null
var actualImage

cscreen.context.textBaseline = "bottom"
cscreen.context.textAlign = "left"
cscreen.context.font = "100px monospace"
cscreen.context.fillStyle = "rgba(255, 0, 0, 1)"
cscreen.context.fillText('LOADING', 10, 100, 500)

grid._cursorStyle = function() {
  oscreen.context.fillStyle = "rgba(0, 255, 0, .5)"
  oscreen2.context.fillStyle = "rgba(0, 255, 0, .5)"
}
grid._textStyle = function() {
  oscreen.context.textBaseline = "bottom"
  oscreen.context.textAlign = "left"
  oscreen.context.font = "40px monospace"
  oscreen.context.fillStyle = "rgba(255, 0, 0, 1)"
  oscreen2.context.textBaseline = "bottom"
  oscreen2.context.textAlign = "left"
  oscreen2.context.font = "40px monospace"
  oscreen2.context.fillStyle = "rgba(255, 0, 0, 1)"
}

grid._render = function(cb) {
  cb(oscreen.context)
  cb(oscreen2.context)
}

var yLine = 0
var vLineNumber = 0
var startLine = 0
var maxLines = 100
var maxLines2 = (maxLines*600)*4

var startBlink = 0
var blinkNumber = 0
var yBlink = 0
var maxBlink = 100
var maxBlink2 = (maxBlink*600)*4

// MATH
var mrand = Math.random
var random = function(num) { return mrand()*num }
var randomInt = function(num) { return 0|(mrand()*num) }

// add effects to offscreen
oscreen.glitches = Object.defineProperties(oscreen, {
  distort: {
    value: function(x, color, noise) {
      // get r, g and b.
      var imageData = this.context.getImageData(0, 0, this.width, this.height)
      var newCanvas = document.createElement("canvas")
      var newContext, nuImageData

      newCanvas.width = this.width
      newCanvas.height = this.height
      newContext = newCanvas.getContext("2d")
      nuImageData = newContext.getImageData(0, 0, this.width, this.height)

      for (var lol = 0, opacity = 0|(50), rand = randomInt(80), i = 0, y = 0, max = imageData.data.length; i < max; i+=4) {
        y = 0|(i/(this.width*4))
        lol = (y>0 ? 0|(Math.exp(y/(80+rand)))  : 0)*4
        if (imageData.data[i+3] > 0) { // means there's a pixel here
          switch (color) {
            case "red":
              nuImageData.data[i + lol] = 255
            break
            case "green":
              nuImageData.data[i+1+lol] = 255
            break
            case "blue":
              nuImageData.data[i+2+lol] = 255
            break
          }

          if (noise)
            nuImageData.data[i+3 + lol] = imageData.data[i+3] - random(150) - opacity
          else
            nuImageData.data[i+3 + lol] = imageData.data[i+3] - 100
        }
      }

      this.context.putImageData(nuImageData, x, 0)
    }
  },
  blink: {
    value: function(start, y, effNumber) {
      var imgData = this.getImageData(0, start, 600, 600)

      if (effNumber == 0)
        for (var i = y, i4 = 4; i4 = (4*(i+1)), i < maxBlink2; i+=4) {
          imgData.data[i] = imgData.data[i]<<4
          imgData.data[i+1] = imgData.data[i+1]<<4
          imgData.data[i+2] = imgData.data[i+2]<<4
          imgData.data[i+3] = imgData.data[i+3]
        }

      if (effNumber == 1)
        for (var i = y, i4 = 4; i4 = (4*(i+1)), i < maxBlink2; i+=4) {
          imgData.data[i] = imgData.data[i]<<i4
          imgData.data[i+1] = imgData.data[i+1]<<i4
          imgData.data[i+2] = imgData.data[i+2]<<i4
          imgData.data[i+3] = imgData.data[i+3]
        }

      if (effNumber == 2)
        for (var i = y, i4 = 4; i4 = (4*(i+1)) + y2*600, i < maxBlink2; i+=4) {
          imgData.data[i] = imgData.data[i] << i4
          imgData.data[i+1] = imgData.data[i+1] << i4
          imgData.data[i+2] = imgData.data[i+2] << i4
          imgData.data[i+3] = imgData.data[i+3] - i4
          if ((i%600) == 0) y2 += 1
        }

      this.putImageData(imgData, 0, start, 0, 0, 600, maxBlink)
    }
  },
  verticalLine: {
    value: function(start, frame, effNumber) {
      var newData = this.context.createImageData(600, frame)
      var imgData = this.getImageData(0, start, 600, 600)

      // START AT 600
      if(effNumber == 1)
        for (var i = 0, y, max = newData.data.length; i < max; i = i + 4) {
          y = 0|(i/600)
          if (i > 4) {
            newData.data[i - 4*y] = imgData.data[i]
            newData.data[i - 3*y] = imgData.data[i + 1]
            newData.data[i - 2*y] = imgData.data[i + 2]
            newData.data[i - y] = imgData.data[i + 3]
        }
      }

      if (effNumber == 0)
        for (var i = 0, y, max = newData.data.length; i < max; i = i + 4) {
          y = 0|(i/600)
          if (i > 4) {
            newData.data[i - 16] = imgData.data[i]
            newData.data[i - 15] = imgData.data[i + 1]
            newData.data[i - 14] = imgData.data[i + 2]
            newData.data[i - 13] = imgData.data[i + 3]
          }
        }

      this.putImageData(newData, 0, start, 0, 0, 600, frame)
    }
  }
})

compositor.layers.push(oscreen)
cscreen.canvas.id = "screen"
cscreen.appendTo(document.body)

sceneDistort.set("end", 1000)
sceneDistort.set("chance", 80)
sceneDistort.addHandler(function(time, frame) {
  oscreen.glitches.distort(5+0|(random(10)), sceneDistort.get("color"), sceneDistort.get("noise"))
})
sceneDistort.on("start", function() {
  if (random(2) < 1) sceneDistort.set("noise", true)
  else sceneDistort.set("noise", false)
  sceneDistort.set("color", ["red", "green", "blue"][0|(random(3))])
})

sceneVLINE.set("end", 2000)
sceneVLINE.set("chance", 50)
sceneVLINE.addHandler(function() {
  oscreen.glitches.verticalLine(startLine, yLine++, (vLineNumber > 90 ? 1 : 0))
})
sceneVLINE.on("start", function() {
  startLine = 0|random(500)
  yLine = 0|random(100)
  vLineNumber = random(100)
  maxLines = 0|random(100)
  maxLines2 = (maxLines*600)*4
})

sceneBlink.set("end", 2000)
sceneBlink.set("chance", 50)
sceneBlink.addHandler(function() {
  oscreen.glitches.blink(startBlink, yBlink++, blinkNumber)
})
sceneBlink.on("start", function() {
  startBlink = 0|random(500)
  yBlink = 0|random(40)
  blinkNumber = 0|random(2)
  maxBlink = 0|random(100)
  maxBlink2 = (maxBlink*600)*4
})

sequencer.push(sceneVLINE)
sequencer.push(sceneBlink)
sequencer.push(sceneDistort)

ImageObject.prototype.update = function() {
  this.y = this.y + 1
  this.x = this.x + 1*this.dirX
}

images.forEach(function(item, idx) {
  imgproms.push(new Promise(function(resolve, reject) {
    var img = new ImageObject(item)

    images[idx] = img

    img.readyPromise.then(function() {
      resolve()
    }, function() {
      reject()
    })
  }))
})



Promise.all(imgproms).then(function() {
  actualImage = images[prevImage]
  choose()
  render()
})

var iType = 1, magic = 5000, t2
function render(t) {
  requestAnimationFrame(render)

  oscreen3.wash()
  cscreen.wash()

  actualImage = images[prevImage]

  oscreen.putImageData(actualImage.imageData, actualImage.x, actualImage.y)

  if (0|(t/actualImage.speed) > actualImage.y) {
    actualImage.update()
  }

  t2 = t%magic

  if (0|(t/magic)>iType)
      iType += 1, grid.clean(true), keyboardist.choose("+1")

  if (t > 1000) {
    if ( typeof keyboardist.lastKeyStroke == "undefined" ||
      t > keyboardist.lastKeyStroke + (200-(Math.max(t2, 100)/10)) ) {
      keyboardist.type(t)
    }
  }

  grid.render(t)

  if(!!t)
    sequencer.play(t)

  if (oscreen3.noisin) {
    oscreen3.noise()
    oscreen3.counter -= 1
  }

  if (oscreen3.counter <= 0) {
    oscreen3.noisin = false
  }

  if (random(100) > 95 && !oscreen3.noisin) {
    noise()
  }

  compositor.flatten()

  if (0|(t/1000) > nextImage) {
    nextImage+= 1
    choose()
  }
}

function choose() {
  var prevImage2 = randomInt(images.length)
  if(prevImage2 == prevImage) return choose()
  else prevImage = prevImage2
  actualImage = images[prevImage]
  actualImage.y = 0
  actualImage.x = 0
  actualImage.dirX = directions[randomInt(2)]
  actualImage.speed = randomInt(500)
}

var noiseType = 0
var noiseArr = [4, 8, 16]

function noise() {
  noiseType = 0|random(2)
  oscreen3.noiseHeight = Math.max(10, random(50))

  oscreen3.noise = function(imageData) {
    imageData = this.getImageData(0, 0, this.width, oscreen3.noiseHeight)

    for (var i = imageData.data.length, rd; i-= noiseArr[noiseType];) {
      rd = randomInt(255)
      imageData.data[i] = rd
      imageData.data[i + 1] = rd
      imageData.data[i + 2] = rd
      imageData.data[i + 3] = 255
    }

    // put to main screen
    oscreen.putImageData(imageData, 0, this.y, 0, 0, oscreen3.width, oscreen3.noiseHeight)
  }

  oscreen3.noisin = true
  oscreen3.counter = 4
  oscreen3.y = randomInt(600 - oscreen3.noiseHeight)
}

function noop(err) {console.log(err)}
