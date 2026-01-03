// Load saved theme on page load
if (localStorage.getItem('theme') === 'dark-grey') {
    document.body.classList.add('dark-grey-theme');
}

function toggleTheme() {
    document.body.classList.toggle('dark-grey-theme');
    // Sync theme across pages
    if (document.body.classList.contains('dark-grey-theme')) {
        localStorage.setItem('theme', 'dark-grey');
    } else {
        localStorage.removeItem('theme');
    }
}