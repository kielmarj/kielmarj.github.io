/**
 * (c) 2025 Jess Kielmar, MIT License
 * https://github.com/kielmarj
 **/

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('yourCanvasId');
  const ctx = canvas.getContext('2d');

  // Store all drawing operations in an array
  const drawingOperations = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    replayDrawingOperations(); // Redraw all stored operations
  }

  window.addEventListener('resize', resizeCanvas);

  let isDrawing = false;

  function getTouchPos(canvas, touchEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top
    };
  }

  function startDrawing(event) {
    isDrawing = true;
    const pos = getTouchPos(canvas, event);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    // Add operation to the history
    drawingOperations.push({ type: 'beginPath' });
    drawingOperations.push({ type: 'moveTo', x: pos.x, y: pos.y });
  }

  function draw(event) {
    if (!isDrawing) return;

    const pos = getTouchPos(canvas, event);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    // Add operation to the history
    drawingOperations.push({ type: 'lineTo', x: pos.x, y: pos.y });
    drawingOperations.push({ type: 'stroke' });
  }

  function stopDrawing() {
    if (isDrawing) {
      isDrawing = false;
      ctx.closePath();
      // Add operation to the history
      drawingOperations.push({ type: 'closePath' });
    }
  }

  function replayDrawingOperations() {
    // Replay all stored drawing operations
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas first
    for (const operation of drawingOperations) {
      if (operation.type === 'beginPath') {
        ctx.beginPath();
      } else if (operation.type === 'moveTo') {
        ctx.moveTo(operation.x, operation.y);
      } else if (operation.type === 'lineTo') {
        ctx.lineTo(operation.x, operation.y);
      } else if (operation.type === 'stroke') {
        ctx.stroke();
      } else if (operation.type === 'closePath') {
        ctx.closePath();
      }
    }
  }

  // Prevent default scrolling behavior
  canvas.addEventListener('touchstart', function(event) {
    event.preventDefault();
    startDrawing(event);
  }, { passive: false });

  canvas.addEventListener('touchmove', function(event) {
    event.preventDefault();
    draw(event);
  }, { passive: false });

  canvas.addEventListener('touchend', function(event) {
    event.preventDefault();
    stopDrawing();
  }, { passive: false });

  // Redraw on scroll
  window.addEventListener('scroll', () => {
    replayDrawingOperations();
  });

  // Initial setup
  resizeCanvas();
});
