// Fetch a random joke and display it on the page
async function loadJoke() {
    try {
        const response = await fetch('https://joke.deno.dev/');
        if (!response.ok) return; // Stop if the response isn't valid
        const data = await response.json();
        const { setup, punchline } = data;

        if (setup && punchline) {
            document.getElementById('joke').innerHTML = `${setup}<br>${punchline}`;
        }
    } catch {
        // Do nothing if an error occurs
    }
}

// Call the function when the page loads
window.onload = loadJoke;
