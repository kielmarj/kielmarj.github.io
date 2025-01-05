<!DOCTYPE html>
<!-- 
 * (c) 2025 Jess Kielmar, MIT License
 * https://github.com/kielmarj
-->
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mandala Creator</title>
  <link rel="stylesheet" href="styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
  <header>
    <h1>Mandala Creator</h1>
  </header> 
  <main>
    <p>Tap or click and drag to create symmetrical patterns.</p>
    <div id="sketch-container"></div>
    <div id="controls-container">
    <div>
      <label for="eraser-toggle">Eraser</label>
      <label class="switch">
      <input type="checkbox" id="eraser-toggle">
      <span class="slider"></span>
    </label>
  </div>
      <div>
        <legend>Size:</legend>
        <input id="stroke-weight-slider" type="range" min="1.5" max="15" value="3" step="1">
      </div>
        <div>
        <legend>Stroke Color:</legend>
          <label>
            <input type="radio" name="color-mode" value="random" checked>
            Random Color
          </label>
          <label>
            <input type="radio" name="color-mode" value="select">
            Select Color
          </label>
          <input type="color" id="color-picker" style="display:none;">
        </div>
        <div>
        <legend>Background Color:</legend>
          <input type="color" id="background-color-picker" value="#191970">
        </div>
    </div>
    <div>
      <button id="reset-btn">Clear Canvas</button>
    </div>
  </main>
  <footer>
    <p>&copy; 2025 <a href="https://github.com/kielmarj" target="_blank" rel="noopener noreferrer">Jess Kielmar</a>. Licensed under the <a href="https://kielmarj.github.io/MIT-LICENSE/" target="_blank" rel="noopener noreferrer">MIT License</a><br><a href="https://buymeacoffee.com/kielmarj" target="_blank" rel="noopener noreferrer"><small>Buy me a coffee</small></a></p>
  </footer>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js"></script>
  <script src="script.js"></script>
</body>
</html>
