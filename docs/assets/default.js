// Nav menu
document.querySelector('.hamburger').addEventListener('click', function () {	document.querySelector('.header-nav').classList.toggle('show');
});

// Retrieves current year for footer
document.getElementById('currentYear').textContent = new Date().getFullYear();