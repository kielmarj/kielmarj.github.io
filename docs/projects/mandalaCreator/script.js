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

    // Undo button event
    document.getElementById("undo-btn").addEventListener("click", undoLastStroke);

    // Touch handlers for mobile
    canvas.elt.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.elt.addEventListener("touchmove", handleTouchMove, { passive: false });
  };

  function handleTouchStart(event) {
    if (event.target === document.querySelector("canvas")) {
      event.preventDefault();
      saveState(); // Save state on touch start
    }
  }

  function handleTouchMove(event) {
    if (event.target === document.querySelector("canvas")) {
      event.preventDefault();
      const touch = event.touches[0];
      simulateMouseEvent(touch.clientX, touch.clientY); // Convert touch to mouse-like event
    }
  }

  function simulateMouseEvent(x, y) {
    mouseX = x - canvas.elt.getBoundingClientRect().left;
    mouseY = y - canvas.elt.getBoundingClientRect().top;
    redraw(); // Trigger p5.js draw
  }

  window.draw = function () {
    if (mouseIsPressed || touches.length > 0) {
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

    image(buffer, 0, 0); // Render buffer onto canvas
  };

  window.mousePressed = function () {
    saveState(); // Save state on mouse press
  };

  function saveState() {
    if (undoStack.length >= maxUndoStackSize) {
      undoStack.shift(); // Remove oldest state if stack is full
    }
    const state = createGraphics(buffer.width, buffer.height);
    state.image(buffer, 0, 0);
    undoStack.push(state); // Save current buffer state
    console.log(`State saved. Undo stack size: ${undoStack.length}`);
  }

  function undoLastStroke() {
    if (undoStack.length > 0) {
      console.log("Undoing last stroke...");
      const lastState = undoStack.pop();
      buffer.clear();
      buffer.image(lastState, 0, 0);
      image(buffer, 0, 0);
      console.log(`Undo complete. Undo stack size: ${undoStack.length}`);
    } else {
      console.log("No states to undo.");
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

  document.getElementById("reset-btn").addEventListener("click", () => {
    buffer.background(backgroundColor);
    background(backgroundColor);
    undoStack.length = 0; // Clear undo stack
    console.log("Canvas reset. Undo stack cleared.");
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
    buffer.background(backgroundColor);
    background(backgroundColor);
  });

  window.windowResized = function () {
    const size = adjustCanvasSize();
    resizeCanvas(size, size);
    const newBuffer = createGraphics(size, size);
    newBuffer.image(buffer, 0, 0, size, size);
    buffer = newBuffer;
  };
});
