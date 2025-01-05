/**
 * (c) 2025 Jess Kielmar, MIT License
 * https://github.com/kielmarj
 **/

document.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById('yourCanvasId');
	const ctx = canvas.getContext('2d');

	// Resize the canvas to fill the window dynamically
	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	// Prevent default scroll on touch interactions
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

	// Prevent page scrolling from clearing the canvas
	window.addEventListener('scroll', (event) => {
		event.preventDefault();
	});

	// Variables to track drawing state
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
	}

	function draw(event) {
		if (!isDrawing) return;

		const pos = getTouchPos(canvas, event);
		ctx.lineTo(pos.x, pos.y);
		ctx.stroke();
	}

	function stopDrawing() {
		if (isDrawing) {
			isDrawing = false;
			ctx.closePath();
		}
	}

	// Initial canvas setup
	resizeCanvas();
});
