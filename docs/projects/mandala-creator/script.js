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
  let backgroundColor = '#6a5acd' // Background color of the canvas
  let buffer // Offscreen buffer for drawing
  let isDrawing = false // Flag to check if drawing is in progress
  let strokes = [] // Array to keep track of strokes
  let originalSize // Original canvas size

  // Function to adjust the canvas size based on the viewport width
  function adjustCanvasSize() {
    const vwWidth = Math.min(window.innerWidth * 0.85, 800) // Cap width at 85% of viewport width or 800px
    const vwHeight = Math.min(window.innerHeight * 0.85, 800) // Cap height at 85% of viewport height or 800px
    return Math.max(vwWidth, vwHeight) // Ensure the canvas is square by using the larger dimension
  }

  // Setup function to initialize the canvas and event listeners
  window.setup = function () {
    const size = adjustCanvasSize()
    originalSize = size
    const canvas = createCanvas(size, size) // Create a square canvas
    canvas.parent('sketch-container') // Attach canvas to the specified container
    angleMode(DEGREES) // Set angle mode to degrees for easier calculations
    buffer = createGraphics(size, size) // Create an offscreen buffer for drawing
    buffer.angleMode(DEGREES) // Set angle mode on buffer as well
    buffer.background(backgroundColor) // Set initial background color
    background(backgroundColor)

    // Add mouse and touch event listeners for interaction with the canvas
    canvas.elt.addEventListener('mousedown', startDrawing)
    canvas.elt.addEventListener('mousemove', drawOnCanvas)
    canvas.elt.addEventListener('mouseup', stopDrawing)
    canvas.elt.addEventListener('touchstart', startDrawing, { passive: false }) // Prevent scrolling on touch
    canvas.elt.addEventListener('touchmove', drawOnCanvas, { passive: false })
    canvas.elt.addEventListener('touchend', stopDrawing)

    // Initialize the stroke color to a default or random value
    updateStrokeColor()
  }

  // Function to handle the start of a drawing action
  function startDrawing(event) {
    if (event.target === document.querySelector('canvas')) { // Ensure the event is on the canvas
      event.preventDefault()
      isDrawing = true // Set the drawing flag to true
      if (event.touches) { // Handle touch events
        simulateMouseEvent(event.touches[0].clientX, event.touches[0].clientY)
      }
    }
  }

  // Function to handle drawing on the canvas as the mouse or touch moves
  function drawOnCanvas(event) {
    if (isDrawing) {
      if (event.touches) { // Handle touch events
        simulateMouseEvent(event.touches[0].clientX, event.touches[0].clientY)
      }

      // Prevent drawing outside the canvas boundaries
      if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
        return
      }

      redraw() // Trigger p5.js draw loop
      event.preventDefault()
    }
  }

  // Function to stop the drawing action
  function stopDrawing() {
    isDrawing = false // Reset the drawing flag
    strokes.push(buffer.get()) // Save the current state of the buffer to the strokes array
  }

  // Function to simulate a mouse event from a touch event
  function simulateMouseEvent(x, y) {
    const canvasRect = canvas.elt.getBoundingClientRect() // Get the canvas dimensions and position
    const scaleX = canvas.width / canvasRect.width // Calculate scale factor for X-axis
    const scaleY = canvas.height / canvasRect.height // Calculate scale factor for Y-axis

    mouseX = (x - canvasRect.left) * scaleX // Adjust X position relative to canvas scale
    mouseY = (y - canvasRect.top) * scaleY // Adjust Y position relative to canvas scale
    pmouseX = mouseX // Update previous mouse X position
    pmouseY = mouseY // Update previous mouse Y position
  }

  // p5.js draw function called on every frame
  window.draw = function () {
    if (isDrawing || mouseIsPressed) { // Check if drawing is in progress
      const drawColor = getCurrentStrokeColor() // Get the current color for the stroke
      const [lineStartX, lineStartY, lineEndX, lineEndY] = getLineCoordinates() // Calculate line coordinates

      buffer.push() // Save the buffer state
      buffer.translate(buffer.width / 2, buffer.height / 2) // Center drawing in the buffer
      for (let i = 0; i < symmetry; i++) { // Loop through each symmetrical segment
        const rotationAngle = angle * i // Calculate rotation angle
        buffer.rotate(rotationAngle) // Rotate for the current segment
        buffer.stroke(drawColor) // Set stroke color
        buffer.strokeWeight(strokeWeightValue) // Set stroke weight
        buffer.line(lineStartX, lineStartY, lineEndX, lineEndY) // Draw the line
        buffer.scale(1, -1) // Mirror the line vertically
        buffer.line(lineStartX, lineStartY, lineEndX, lineEndY) // Draw the mirrored line
      }
      buffer.pop() // Restore the buffer state
    }

    // Scale the buffer content to fit the canvas
    const scaleFactor = Math.min(width / buffer.width, height / buffer.height)
    push()
    translate(width / 2, height / 2) // Center the buffer on the canvas
    scale(scaleFactor) // Scale the buffer content
    imageMode(CENTER) // Set image drawing mode to center
    image(buffer, 0, 0) // Draw the buffer onto the canvas
    pop()
  }

  // Calculate line start and end points based on mouse movement
  function getLineCoordinates() {
    const lineStartX = mouseX - buffer.width / 2
    const lineStartY = mouseY - buffer.height / 2
    const lineEndX = pmouseX - buffer.width / 2
    const lineEndY = pmouseY - buffer.height / 2
    return [lineStartX, lineStartY, lineEndX, lineEndY]
  }

  // Determine the current stroke color based on eraser state and color mode
  function getCurrentStrokeColor() {
    const eraserToggle = document.getElementById('eraser-toggle').checked
    return eraserToggle
      ? backgroundColor // Use background color if eraser is active
      : color(
        currentStrokeColor.levels[0], // Red value
        currentStrokeColor.levels[1], // Green value
        currentStrokeColor.levels[2], // Blue value
        currentStrokeColor.levels[3] // Alpha value
      )
  }

  // Update the stroke color when the mouse is pressed
  window.mousePressed = function () {
    updateStrokeColor()
  }

  // Clear the canvas and buffer, reset strokes array
  document.getElementById('reset-btn').addEventListener('click', () => {
    buffer.background(backgroundColor)
    background(backgroundColor)
    strokes = [] // Clear the strokes array
  })

  // Update stroke weight and display the value
  document.getElementById('stroke-weight-slider').addEventListener('input', (e) => {
    strokeWeightValue = parseFloat(e.target.value)
    document.getElementById('stroke-weight-value').textContent = strokeWeightValue
  })

  // Handle changes in color mode (random or selected)
  document.querySelectorAll('input[name="color-mode"]').forEach((input) => {
    input.addEventListener('change', () => {
      const colorPicker = document.getElementById('color-picker')
      colorPicker.style.display = input.value === 'select' ? 'inline' : 'none'
      if (input.value === 'select') {
        const hex = colorPicker.value // Get the color picker value
        currentStrokeColor = color(hex)
      } else if (input.value === 'random') {
        updateStrokeColor()
      }
    })
  })

  // Update stroke color based on the color picker value
  document.getElementById('color-picker').addEventListener('input', (e) => {
    const hex = e.target.value
    currentStrokeColor = color(hex)
  })

  // Update background color on selection
  document.getElementById('background-color-picker').addEventListener('input', (e) => {
    backgroundColor = e.target.value
    buffer.background(backgroundColor)
    background(backgroundColor)
  })

  // Save the current canvas as an image file
  document.getElementById('save-btn').addEventListener('click', () => {
    saveCanvas('mandala', 'png')
  })

  // Undo the last stroke
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

  // Update symmetry and angle based on slider input
  document.getElementById('symmetry-slider').addEventListener('input', (e) => {
    symmetry = parseInt(e.target.value) // Update symmetry value
    angle = 360 / symmetry // Recalculate angle between segments
    document.getElementById('symmetry-value').textContent = symmetry
  })

  // Adjust canvas size and redraw buffer content on window resize
  window.windowResized = function () {
    const newSize = adjustCanvasSize()
    const scaleFactor = newSize / originalSize
    resizeCanvas(newSize, newSize) // Resize the canvas
    let newBuffer = createGraphics(newSize, newSize) // Create a new buffer
    newBuffer.angleMode(DEGREES)
    newBuffer.background(backgroundColor)
    // Redraw all strokes on the new buffer with scaled stroke weights
    for (let i = 0; i < strokes.length; i++) {
      newBuffer.image(strokes[i], 0, 0, newSize, newSize)
    }
    buffer = newBuffer // Update the buffer
    background(backgroundColor)
    strokeWeightValue *= scaleFactor // Scale stroke weight
    originalSize = newSize
  }

  // Update stroke color based on the selected color mode
  function updateStrokeColor() {
    const colorMode = document.querySelector('input[name="color-mode"]:checked').value
    const colorPicker = document.getElementById('color-picker')

    // Update the color picker to reflect the current stroke color
    if (currentStrokeColor) {
      colorPicker.value = `#${currentStrokeColor.levels
        .slice(0, 3)
        .map((c) => c.toString(16).padStart(2, '0'))
        .join('')}`
    }

    if (colorMode === 'random') {
      const hue = random(0, 360) // Generate a random hue
      const saturation = 100 // Full saturation
      const lightness = 60 // Medium lightness
      const rgb = hslToRgb(hue, saturation / 100, lightness / 100) // Convert to RGB
      currentStrokeColor = color(rgb[0], rgb[1], rgb[2])
    } else {
      const hex = colorPicker.value // Use the selected hex value
      currentStrokeColor = color(hex)
    }
  }

  // Convert HSL values to RGB format
  function hslToRgb(h, s, l) {
    let r, g, b
    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m = l - c / 2
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
    r = Math.round((r + m) * 255) // Adjust to 8-bit RGB scale
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)
    return [r, g, b]
  }
});
