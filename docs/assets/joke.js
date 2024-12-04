// Fetch a random joke and display it on the page
async function loadJoke() {
    try {
        const response = await fetch('https://joke.deno.dev/');
        const data = await response.json();
        document.getElementById('joke').innerText = data.joke;
    } catch (error) {
        console.error('Failed to load the joke:', error);
        document.getElementById('joke').innerText = 'Please move along, there is nothing to see here.';
    }
}

// Call the function when the page loads
window.onload = loadJoke;
