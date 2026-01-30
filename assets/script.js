// Load saved theme on page load
if (localStorage.getItem('theme') === 'dark-grey') {
    document.body.classList.add('dark-grey-theme');
}

// Load saved grid setting
if (localStorage.getItem('grid-mode') === '4-col') {
    document.documentElement.style.setProperty('--grid-min-width', '280px');
    document.documentElement.style.setProperty('--view-source-margin', '80px');
}

// Load saved headings setting (default: hidden)
if (localStorage.getItem('headings-visible') !== 'true') {
    document.body.classList.add('hide-headings');
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

function toggleHeadings() {
    document.body.classList.toggle('hide-headings');
    if (document.body.classList.contains('hide-headings')) {
        localStorage.removeItem('headings-visible');
    } else {
        localStorage.setItem('headings-visible', 'true');
    }
}

function toggleGrid() {
    const currentMode = localStorage.getItem('grid-mode');
    if (currentMode === '4-col') {
        document.documentElement.style.setProperty('--grid-min-width', '320px');
        document.documentElement.style.setProperty('--view-source-margin', '60px');
        localStorage.removeItem('grid-mode');
    } else {
        document.documentElement.style.setProperty('--grid-min-width', '280px');
        document.documentElement.style.setProperty('--view-source-margin', '80px');
        localStorage.setItem('grid-mode', '4-col');
    }
}

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modal-text');

    document.querySelectorAll('.team-member').forEach(member => {
        member.addEventListener('click', function(event) {
            event.preventDefault();
            const text = this.dataset.modalText;
            const href = this.href;
            modalText.innerHTML = text + '<br><a href="' + href + '">Go</a>';
            modal.style.display = 'block';
        });
    });

    document.querySelectorAll('.kernel-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const text = this.dataset.modalText;
            const href = this.href;
            modalText.innerHTML = text + '<br><a href="' + href + '">Go</a>';
            modal.style.display = 'block';
        });
    });

    document.getElementById('legal-btn')?.addEventListener('click', function() {
        document.getElementById('modal-text').innerHTML = document.getElementById('legal-content').innerHTML;
        modal.style.display = 'block';
    });

    // Event delegation for modal buttons
    modal.addEventListener('click', function(e) {
        if (e.target.id === 'modal-contrast-btn') {
            toggleTheme();
        } else if (e.target.id === 'grid-toggle-btn') {
            toggleGrid();
        } else if (e.target.id === 'headings-toggle-btn') {
            toggleHeadings();
        }
    });

    // Keyboard shortcuts for modal and theme
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            modal.style.display = 'none';
        } else if (e.key === 'c' || e.key === 'C') {
            toggleTheme();
        }
    });

    document.querySelector('#modal .close').addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});