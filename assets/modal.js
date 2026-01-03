// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modal-text');

    document.querySelectorAll('.team-member').forEach(member => {
        member.addEventListener('click', function(event) {
            event.preventDefault();
            const text = this.dataset.modalText;
            modalText.textContent = text;
            modal.style.display = 'block';
        });
    });

    document.querySelectorAll('.kernel-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const text = this.dataset.modalText;
            modalText.textContent = text;
            modal.style.display = 'block';
        });
    });

    document.getElementById('legal-btn')?.addEventListener('click', function() {
        document.getElementById('modal-text').innerHTML = document.getElementById('legal-content').innerHTML;
        modal.style.display = 'block';
    });

    // Event delegation for modal contrast button
    modal.addEventListener('click', function(e) {
        if (e.target.id === 'modal-contrast-btn') {
            toggleTheme();
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