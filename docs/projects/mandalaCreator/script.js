document.addEventListener("DOMContentLoaded", () => {
  let symmetry = 6;
  let angle = 360 / symmetry;
  let currentStrokeColor;
  let strokeWeightValue = 1.5;
  let backgroundColor = "midnightblue";
  let buffer;
  let isDrawing = false;

  function adjustCanvasSize() {
    const vwWidth = Math.min(window.innerWidth * 0.85);
    return Math.min(vwWidth, 800); // Limit max width to 800px
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

    // Add mouse and touch handlers for the canvas
    canvas.elt.addEventListener("mousedown", startDrawing);
    canvas.elt.addEventListener("mousemove", drawOnCanvas);
    canvas.elt.addEventListener("mouseup", stopDrawing);

    canvas.elt.addEventListener("touchstart", startDrawing, { passive: false });
    canvas.elt.addEventListener("touchmove", drawOnCanvas, { passive: false });
    canvas.elt.addEventListener("touchend", stopDrawing);
  };

  function startDrawing(event) {
    if (event.target === document.querySelector("canvas")) {
      event.preventDefault();
      isDrawing = true;
      if (event.touches) {
        simulateMouseEvent(event.touches[0].clientX, event.touches[0].clientY);
      }
    }
  }

  function drawOnCanvas(event) {
    if (isDrawing) {
      if (event.touches) {
        simulateMouseEvent(event.touches[0].clientX, event.touches[0].clientY);
      }
      redraw();
      event.preventDefault();
    }
  }

  function stopDrawing() {
    isDrawing = false;
  }

  function simulateMouseEvent(x, y) {
    const canvasRect = canvas.elt.getBoundingClientRect(); // Get canvas position and size
    const scaleX = canvas.width / canvasRect.width; // Account for CSS scaling
    const scaleY = canvas.height / canvasRect.height;

    mouseX = (x - canvasRect.left) * scaleX; // Adjust X relative to scaled canvas
    mouseY = (y - canvasRect.top) * scaleY; // Adjust Y relative to scaled canvas
    pmouseX = mouseX;
    pmouseY = mouseY;
  }

  window.draw = function () {
    if (isDrawing || mouseIsPressed) {
      const drawColor = getCurrentStrokeColor();
      const [lineStartX, lineStartY, lineEndX, lineEndY] = getLineCoordinates();

      buffer.push();
      buffer.translate(buffer.width / 2, buffer.height / 2); // Center using buffer width and height
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

    image(buffer, 0, 0, width, height); // Render buffer onto scaled canvas
  };

  function getLineCoordinates() {
    const lineStartX = mouseX - buffer.width / 2;
    const lineStartY = mouseY - buffer.height / 2;
    const lineEndX = pmouseX - buffer.width / 2;
    const lineEndY = pmouseY - buffer.height / 2;
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
    buffer.background(backgroundColor);
    background(backgroundColor);
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

    document.getElementById("save-btn").addEventListener("click", () => {
    saveCanvas('mandala', 'png');
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
