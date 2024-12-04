// Always fetch the current year
const timeElement = document.querySelector('.time');
if (timeElement) {
    timeElement.textContent = new Date().getFullYear();
}

// Typewriter effect for terminal
const footerElement = document.querySelector('footer p');
const prompt = 'kielmarj@github ~ $ ';
const command1 = 'License --description';
const response1 = `

DESCRIPTION:
The MIT License is a permissive free software license originating at the Massachusetts Institute of Technology. As a permissive license, it puts only very limited restrictions on reuse and has, therefore, excellent license compatibility.

`;
const command2 = 'License --full-text';
const fullLicenseText = `

FULL TEXT:
The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

`;

let index = 0;

// Ensure line breaks and spaces are preserved
footerElement.style.whiteSpace = 'pre-wrap';

// Typewriter effect for simulated user input
function typeText(text, onComplete, delay = 100) {
    const blinkCursor = document.querySelector('.blink');
    if (blinkCursor) blinkCursor.remove(); // Remove cursor while typing

    function step() {
        if (index < text.length) {
            footerElement.textContent += text.charAt(index);
            index++;
            setTimeout(step, delay);
        } else {
            onComplete();
        }
    }

    step();
}

// Append blinking cursor to the simulated CLI
function appendCursor() {
    footerElement.innerHTML += '<span class="blink"> █</span>';
}

// Sequence of events
document.addEventListener('DOMContentLoaded', () => {
    // Start with static "shell prompt" and blinking cursor
    footerElement.textContent = prompt;
    appendCursor();

    // Delay and then type the first command
    setTimeout(() => {
        index = 0;
        typeText(command1, () => {
            footerElement.textContent += response1;
            footerElement.textContent += prompt;
          appendCursor();

            // Delay and then type the second command
            setTimeout(() => {
                index = 0;
                typeText(command2, () => {
                    footerElement.textContent;
                    footerElement.textContent += fullLicenseText;
                    footerElement.textContent += prompt;
                  appendCursor();
                });
            }, 3000); // Delay before second command
        });
    }, 2000); // Delay before first command
});

// Blinking cursor effect
setInterval(() => {
    const blinkElement = document.querySelector('.blink');
    if (blinkElement) {
        blinkElement.style.visibility = blinkElement.style.visibility === 'hidden' ? 'visible' : 'hidden';
    }
}, 500);
