/**
 * (c) 2025 Jess Kielmar, MIT License
 * https://github.com/kielmarj
 **/

document.addEventListener("DOMContentLoaded", () => {
  let symmetry = 6;
  let angle = 360 / symmetry;
  let currentStrokeColor;
  let strokeWeightValue = 1.5;
  let backgroundColor = "midnightblue";
  let buffer;
  const undoStack = [];
  const maxUndoStackSize = 10;

  function adjustCanvasSize() {
    return Math.min(window.innerWidth * 0.9);
  }

  window.setup = function () {
    const size = adjustCanvasSize();
    const canvas = createCanvas(size, size);
    canvas.parent("sketch-container");
    angleMode(DEGREES);
    buffer = createGraphics(size, size);
    buffer.angleMode(DEGREES);
    buffer.background(backgroundColor);
    background(backgroundColor);

    // Add touch handlers for the canvas
    canvas.elt.addEventListener("touchstart", (e) => handleTouchStart(e), { passive: false });
    canvas.elt.addEventListener("touchmove", (e) => handleTouchMove(e), { passive: false });

    // Add Undo button functionality
    document.getElementById("undo-btn").addEventListener("click", undoLastStroke);
  };

  function handleTouchStart(event) {
    if (event.target === document.querySelector("canvas")) {
      event.preventDefault(); // Stop page scroll when interacting with the canvas
    }
  }

  function handleTouchMove(event) {
    if (event.target === document.querySelector("canvas")) {
      event.preventDefault(); // Stop page scroll during drawing interactions
      const touch = event.touches[0];
      simulateMouseEvent(touch.clientX, touch.clientY); // Convert touch input to mouse for drawing
    }
  }

  function simulateMouseEvent(x, y) {
    mouseX = x - canvas.elt.getBoundingClientRect().left;
    mouseY = y - canvas.elt.getBoundingClientRect().top;
    pmouseX = mouseX;
    pmouseY = mouseY;
    redraw(); // Trigger p5.js drawing
  }

  window.draw = function () {
    if (mouseIsPressed || touches.length > 0) {
      saveState(); // Save current state before modifying the buffer
      const drawColor = getCurrentStrokeColor();
      const [lineStartX, lineStartY, lineEndX, lineEndY] = getLineCoordinates();

      buffer.push();
      buffer.translate(width / 2, height / 2);
      for (let i = 0; i < symmetry; i++) {
        const rotationAngle = angle * i;
        buffer.rotate(rotationAngle);
        buffer.stroke(drawColor);
        buffer.strokeWeight(strokeWeightValue);
        buffer.line(lineStartX, lineStartY, lineEndX, lineEndY);
        buffer.scale(1, -1);
        buffer.line(lineStartX, lineStartY, lineEndX, lineEndY);
      }
      buffer.pop();
    }

    image(buffer, 0, 0); // Draw the buffer onto the main canvas
  };

  function saveState() {
    if (undoStack.length >= maxUndoStackSize) {
      undoStack.shift(); // Remove the oldest state if stack exceeds the limit
    }
    const state = createGraphics(buffer.width, buffer.height);
    state.image(buffer, 0, 0);
    undoStack.push(state); // Save the current buffer state
  }

  function undoLastStroke() {
    if (undoStack.length > 0) {
      const lastState = undoStack.pop(); // Get the last saved state
      buffer.image(lastState, 0, 0); // Restore the buffer to the last state
      image(buffer, 0, 0); // Update the canvas
    }
  }

  function getLineCoordinates() {
    const lineStartX = mouseX - width / 2;
    const lineStartY = mouseY - height / 2;
    const lineEndX = pmouseX - width / 2;
    const lineEndY = pmouseY - height / 2;
    return [lineStartX, lineStartY, lineEndX, lineEndY];
  }

  function getCurrentStrokeColor() {
    const eraserToggle = document.getElementById("eraser-toggle").checked;
    return eraserToggle
      ? backgroundColor
      : color(
          currentStrokeColor.levels[0],
          currentStrokeColor.levels[1],
          currentStrokeColor.levels[2],
          currentStrokeColor.levels[3]
        );
  }

  window.mousePressed = function () {
    updateStrokeColor();
  };

  document.getElementById("reset-btn").addEventListener("click", () => {
    buffer.background(backgroundColor); // Clear the buffer
    background(backgroundColor);
    undoStack.length = 0; // Clear the undo stack
  });

  document.getElementById("stroke-weight-slider").addEventListener("input", (e) => {
    strokeWeightValue = parseFloat(e.target.value);
  });

  document.querySelectorAll('input[name="color-mode"]').forEach((input) => {
    input.addEventListener("change", () => {
      const colorPicker = document.getElementById("color-picker");
      colorPicker.style.display = input.value === "select" ? "inline" : "none";
    });
  });

  document.getElementById("background-color-picker").addEventListener("input", (e) => {
    backgroundColor = e.target.value;
    buffer.background(backgroundColor); // Update buffer background
    background(backgroundColor);
  });

  window.windowResized = function () {
    const size = adjustCanvasSize();
    resizeCanvas(size, size);
    let newBuffer = createGraphics(size, size);
    newBuffer.image(buffer, 0, 0, size, size); // Copy old buffer to the new one
    buffer = newBuffer;
  };

  function updateStrokeColor() {
    const colorMode = document.querySelector('input[name="color-mode"]:checked').value;
    if (colorMode === "random") {
      const hue = random(0, 360);
      const saturation = 100;
      const lightness = 60;
      const rgb = hslToRgb(hue, saturation / 100, lightness / 100);
      currentStrokeColor = color(rgb[0], rgb[1], rgb[2]);
    } else {
      const hex = document.getElementById("color-picker").value;
      currentStrokeColor = color(hex);
    }
  }

  function hslToRgb(h, s, l) {
    let r, g, b;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  }
});

