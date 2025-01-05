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

  function adjustCanvasSize() {
    return Math.min(window.innerWidth * 0.9);
  }

  window.setup = function () {
    const size = adjustCanvasSize();
    const canvas = createCanvas(size, size);
    canvas.parent("sketch-container");
    angleMode(DEGREES);
    background(backgroundColor);
    canvas.elt.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
    canvas.elt.addEventListener("touchmove", (e) => e.preventDefault(), q{ passive: false });
  };

  window.draw = function () {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      let lineStartX = mouseX - width / 2;
      let lineStartY = mouseY - height / 2;
      let lineEndX = pmouseX - width / 2;
      let lineEndY = pmouseY - height / 2;

      if (mouseIsPressed) {
        const eraserToggle = document.getElementById("eraser-toggle").checked;
        const drawColor = eraserToggle
          ? backgroundColor
          : color(
              currentStrokeColor.levels[0],
              currentStrokeColor.levels[1],
              currentStrokeColor.levels[2],
              currentStrokeColor.levels[3]
            );

        for (let i = 0; i < symmetry; i++) {
          const rotationAngle = angle * i;
          push();
          translate(width / 2, height / 2);
          rotate(rotationAngle);
          stroke(drawColor);
          strokeWeight(strokeWeightValue);
          line(lineStartX, lineStartY, lineEndX, lineEndY);
          scale(1, -1);
          line(lineStartX, lineStartY, lineEndX, lineEndY);
          pop();
        }
      }
    }
  };

  window.mousePressed = function () {
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
  };

  document.getElementById("reset-btn").addEventListener("click", () => {
    background(backgroundColor);
  });

  document.getElementById("stroke-weight-slider").addEventListener("input", (e) => {
    strokeWeightValue = parseFloat(e.target.value);
  });

  document.querySelectorAll('input[name="color-mode"]').forEach((input) => {
    input.addEventListener("change", (e) => {
      const colorPicker = document.getElementById("color-picker");
      if (e.target.value === "select") {
        colorPicker.style.display = "inline";
      } else {
        colorPicker.style.display = "none";
      }
    });
  });

  document.getElementById("background-color-picker").addEventListener("input", (e) => {
    backgroundColor = e.target.value;
    background(backgroundColor);
  });

  window.windowResized = function () {
    const size = adjustCanvasSize();
    resizeCanvas(size, size);
    background(backgroundColor);
  };

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
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return [r, g, b];
  }
});


