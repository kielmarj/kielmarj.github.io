/**
 * (c) 2025 Jess Kielmar, MIT License
 * https://github.com/kielmarj
 **/

document.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById('yourCanvasId');
	const ctx = canvas.getContext('2d');

	// Create an offscreen canvas for persistent drawing
	const offscreenCanvas = document.createElement('canvas');
	const offscreenCtx = offscreenCanvas.getContext('2d');

	function resizeCanvas() {
		// Resize both canvases
		offscreenCanvas.width = canvas.width = window.innerWidth;
		offscreenCanvas.height = canvas.height = window.innerHeight;

		// Redraw the offscreen content onto the visible canvas
		ctx.drawImage(offscreenCanvas, 0, 0);
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
		offscreenCtx.beginPath();
		offscreenCtx.moveTo(pos.x, pos.y);
	}

	function draw(event) {
		if (!isDrawing) return;

		const pos = getTouchPos(canvas, event);
		offscreenCtx.lineTo(pos.x, pos.y);
		offscreenCtx.stroke();

		// Mirror the drawing to the visible canvas
		ctx.drawImage(offscreenCanvas, 0, 0);
	}

	function stopDrawing() {
		if (isDrawing) {
			isDrawing = false;
			offscreenCtx.closePath();
		}
	}

	// Prevent default scrolling during touch interactions
	canvas.addEventListener('touchstart', function (event) {
		event.preventDefault();
		startDrawing(event);
	}, { passive: false });

	canvas.addEventListener('touchmove', function (event) {
		event.preventDefault();
		draw(event);
	}, { passive: false });

	canvas.addEventListener('touchend', function (event) {
		event.preventDefault();
		stopDrawing();
	}, { passive: false });

	// Initial canvas setup
	resizeCanvas();

	// Redraw the offscreen canvas on the visible canvas during scroll
	window.addEventListener('scroll', () => {
		ctx.drawImage(offscreenCanvas, 0, 0);
	});
});
