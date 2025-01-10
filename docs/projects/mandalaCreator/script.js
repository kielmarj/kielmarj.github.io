/**************************************
 * Mandala Creator script.js          *
 * (c) 2025 Jess Kielmar, MIT License *
 * https://github.com/kielmarj        *
 **************************************/

document.addEventListener('DOMContentLoaded', () => {
  let symmetry = 8 // Number of symmetrical segments
  let angle = 360 / symmetry // Angle between each segment
  let currentStrokeColor // Current color of the stroke
  let strokeWeightValue = 1.5 // Thickness of the stroke
  let backgroundColor = 'midnightblue' // Background color of the canvas
  let buffer // Offscreen buffer for drawing
  let isDrawing = false // Flag to check if drawing is in progress
  let strokes = [] // Array to keep track of strokes

  // Function to adjust the canvas size based on the viewport width
  function adjustCanvasSize() {
    const vwWidth = Math.max(window.innerWidth * 0.75)
    return Math.max(vwWidth, 800) // Limit max width to 800px
  }

  // Setup function to initialize the canvas and event listeners
  window.setup = function () {
    const size = adjustCanvasSize()
    const canvas = createCanvas(size, size)
    canvas.parent('sketch-container')
    angleMode(DEGREES) // Set angle mode to degrees
    buffer = createGraphics(size, size)
    buffer.angleMode(DEGREES)
    buffer.background(backgroundColor)
    background(backgroundColor)

    // Add mouse and touch handlers for the canvas
    canvas.elt.addEventListener('mousedown', startDrawing)
    canvas.elt.addEventListener('mousemove', drawOnCanvas)
    canvas.elt.addEventListener('mouseup', stopDrawing)
    canvas.elt.addEventListener('touchstart', startDrawing, { passive: false })
    canvas.elt.addEventListener('touchmove', drawOnCanvas, { passive: false })
    canvas.elt.addEventListener('touchend', stopDrawing)

    // Initialize the stroke color
    updateStrokeColor()
  }

  // Function to start drawing
  function startDrawing(event) {
    if (event.target === document.querySelector('canvas')) {
      event.preventDefault()
      isDrawing = true
      if (event.touches) {
        simulateMouseEvent(event.touches[0].clientX, event.touches[0].clientY)
      }
    }
  }

  // Function to draw on the canvas
  function drawOnCanvas(event) {
    if (isDrawing) {
      if (event.touches) {
        simulateMouseEvent(event.touches[0].clientX, event.touches[0].clientY)
      }
      redraw()
      event.preventDefault()
    }
  }

  // Function to stop drawing
  function stopDrawing() {
    isDrawing = false
    // Save the current state of the buffer to the strokes array
    strokes.push(buffer.get())
  }

  // Function to simulate mouse events for touch inputs
  function simulateMouseEvent(x, y) {
    const canvasRect = canvas.elt.getBoundingClientRect() // Get canvas position and size
    const scaleX = canvas.width / canvasRect.width // Account for CSS scaling
    const scaleY = canvas.height / canvasRect.height

    mouseX = (x - canvasRect.left) * scaleX // Adjust X relative to scaled canvas
    mouseY = (y - canvasRect.top) * scaleY // Adjust Y relative to scaled canvas
    pmouseX = mouseX
    pmouseY = mouseY
  }

  // Draw function to render the mandala
  window.draw = function () {
    if (isDrawing || mouseIsPressed) {
      const drawColor = getCurrentStrokeColor()
      const [lineStartX, lineStartY, lineEndX, lineEndY] = getLineCoordinates()

      buffer.push()
      buffer.translate(buffer.width / 2, buffer.height / 2) // Center using buffer width and height
      for (let i = 0; i < symmetry; i++) {
        const rotationAngle = angle * i
        buffer.rotate(rotationAngle)
        buffer.stroke(drawColor)
        buffer.strokeWeight(strokeWeightValue)
        buffer.line(lineStartX, lineStartY, lineEndX, lineEndY)
        buffer.scale(1, -1) // Mirror the line
        buffer.line(lineStartX, lineStartY, lineEndX, lineEndY)
      }
      buffer.pop()
    }

    // Scale the buffer to fit the canvas size
    image(buffer, 0, 0, width, height)
  }

  // Function to get the coordinates of the line to be drawn
  function getLineCoordinates() {
    const lineStartX = mouseX - buffer.width / 2
    const lineStartY = mouseY - buffer.height / 2
    const lineEndX = pmouseX - buffer.width / 2
    const lineEndY = pmouseY - buffer.height / 2
    return [lineStartX, lineStartY, lineEndX, lineEndY]
  }

  // Function to get the current stroke color
  function getCurrentStrokeColor() {
    const eraserToggle = document.getElementById('eraser-toggle').checked
    return eraserToggle
      ? backgroundColor
      : color(
        currentStrokeColor.levels[0],
        currentStrokeColor.levels[1],
        currentStrokeColor.levels[2],
        currentStrokeColor.levels[3]
      )
  }

  // Function to update the stroke color when mouse is pressed
  window.mousePressed = function () {
    updateStrokeColor()
  }

  // Event listener for the reset button to clear the canvas
  document.getElementById('reset-btn').addEventListener('click', () => {
    buffer.background(backgroundColor)
    background(backgroundColor)
    strokes = [] // Clear the strokes array
  })

  // Event listener for the stroke weight slider
  document
    .getElementById('stroke-weight-slider')
    .addEventListener('input', e => {
      strokeWeightValue = parseFloat(e.target.value)
      document.getElementById('stroke-weight-value').textContent =
        strokeWeightValue
    })

  // Event listener for the color mode radio buttons
  document.querySelectorAll('input[name="color-mode"]').forEach(input => {
    input.addEventListener('change', () => {
      const colorPicker = document.getElementById('color-picker')
      colorPicker.style.display = input.value === 'select' ? 'inline' : 'none'
      if (input.value === 'select') {
        // Set the current stroke color to the color picker value
        const hex = colorPicker.value
        currentStrokeColor = color(hex)
      } else if (input.value === 'random') {
        updateStrokeColor()
      }
    })
  })

  // Event listener for the color picker input
  document.getElementById('color-picker').addEventListener('input', e => {
    const hex = e.target.value
    currentStrokeColor = color(hex)
  })

  // Event listener for the background color picker input
  document
    .getElementById('background-color-picker')
    .addEventListener('input', e => {
      backgroundColor = e.target.value
      buffer.background(backgroundColor)
      background(backgroundColor)
    })

  // Event listener for the save button to save the canvas as an image
  document.getElementById('save-btn').addEventListener('click', () => {
    saveCanvas('mandala', 'png')
  })

  // Event listener for the undo button to remove the last stroke
  document.getElementById('undo-btn').addEventListener('click', () => {
    if (strokes.length > 0) {
      strokes.pop() // Remove the last stroke
      buffer.clear()
      buffer.background(backgroundColor)
      // Redraw all remaining strokes
      for (let i = 0; i < strokes.length; i++) {
        buffer.image(strokes[i], 0, 0)
      }
    }
  })

  // Event listener for the symmetry slider
  document.getElementById('symmetry-slider').addEventListener('input', e => {
    symmetry = parseInt(e.target.value)
    angle = 360 / symmetry
    document.getElementById('symmetry-value').textContent = symmetry
  })

  // Function to handle window resize
  window.windowResized = function () {
    const size = adjustCanvasSize()
    resizeCanvas(size, size)
    let newBuffer = createGraphics(size, size)
    newBuffer.angleMode(DEGREES)
    newBuffer.background(backgroundColor)
    // Redraw all strokes on the new buffer
    for (let i = 0; i < strokes.length; i++) {
      newBuffer.image(strokes[i], 0, 0, size, size)
    }
    buffer = newBuffer
    background(backgroundColor)
  }

  // Function to update the stroke color based on the selected mode
  function updateStrokeColor() {
    const colorMode = document.querySelector(
      'input[name="color-mode"]:checked'
    ).value
    const colorPicker = document.getElementById('color-picker')

    // Update the color picker to reflect the current stroke color before changing it
    if (currentStrokeColor) {
      colorPicker.value = `#${currentStrokeColor.levels
        .slice(0, 3)
        .map(c => c.toString(16).padStart(2, '0'))
        .join('')}`
    }

    if (colorMode === 'random') {
      const hue = random(0, 360)
      const saturation = 100
      const lightness = 60
      const rgb = hslToRgb(hue, saturation / 100, lightness / 100)
      currentStrokeColor = color(rgb[0], rgb[1], rgb[2])
    } else {
      const hex = colorPicker.value
      currentStrokeColor = color(hex)
    }
  }

  // Function to convert HSL color to RGB
  function hslToRgb(h, s, l) {
    let r, g, b

    // Calculate chroma (the difference between the maximum and minimum RGB values)
    // This determines the intensity of the color
    const c = (1 - Math.abs(2 * l - 1)) * s

    // Calculate the second largest component of the color
    // This helps in determining the exact RGB values based on the hue
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))

    // Calculate the lightness adjustment
    // This shifts the RGB values to the correct lightness
    const m = l - c / 2

    // Determine RGB values based on the hue segment
    // The hue (h) determines which segment of the color wheel the color is in
    if (h >= 0 && h < 60) {
      r = c
      g = x
      b = 0
    } else if (h >= 60 && h < 120) {
      r = x
      g = c
      b = 0
    } else if (h >= 120 && h < 180) {
      r = 0
      g = c
      b = x
    } else if (h >= 180 && h < 240) {
      r = 0
      g = x
      b = c
    } else if (h >= 240 && h < 300) {
      r = x
      g = 0
      b = c
    } else {
      r = c
      g = 0
      b = x
    }

    // Adjust RGB values to the 0-255 range
    // RGB values need to be in the range of 0 to 255 for most applications
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    // Return the RGB values as an array
    return [r, g, b]
  }
})
