document.addEventListener('DOMContentLoaded', () => {
    // Simulate clearing user session/token
    console.log('Clearing session...');
    localStorage.removeItem('authToken'); // Example: Clear token from localStorage

    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = '/index.html'; // Replace with your login page URL
    }, 2000);
});
