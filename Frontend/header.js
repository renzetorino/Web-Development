fetch('header.html')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
        setActiveLink();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop();

    const navItems = document.querySelectorAll('.nav-links li a');

    navItems.forEach(item => {
        item.classList.remove('active');

        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        }
    });
}
