/****************************************
 * Synthwave '84 Code Blocks script.js  *
 * (c) 2025 Jess Kielmar, MIT License   *
 * https://github.com/kielmarj          *
 ****************************************/

// JavaScript function to copy code to clipboard with fallback for older browsers
function copyCode(button) {
  const code = button.nextElementSibling.textContent;

  // Modern method: navigator.clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code)
      .then(() => {
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  } else {
    // Fallback method: textarea and execCommand
    const tempInput = document.createElement('textarea');
    tempInput.value = code;
    document.body.appendChild(tempInput);
    tempInput.select();

    try {
      document.execCommand('copy');
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }

    document.body.removeChild(tempInput);
  }
}
