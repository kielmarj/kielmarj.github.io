document.querySelector('.hamburger').addEventListener('click', function () {
	document.querySelector('.header-nav').classList.toggle('show');
});

document.getElementById('currentYear').textContent = new Date().getFullYear();
