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
    const header = document.getElementById('main-header');
    const footer = document.querySelector('footer');

    // Fetch latest release from GitHub API
    const releaseLink = document.getElementById('latest-release-link');
    if (releaseLink) {
        const releaseOptions = GITHUB_TOKEN ? {
            headers: { 'Authorization': 'token ' + GITHUB_TOKEN }
        } : {};
        fetch('https://api.github.com/repos/harpertoken/harper/releases/latest', releaseOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.tag_name) {
                    releaseLink.href = data.html_url;
                    releaseLink.textContent = data.tag_name.replace('v', '');
                    releaseLink.classList.add('kernel-link');
                }
            })
            .catch(err => {
                console.error('Error fetching latest release:', err);
                releaseLink.textContent = 'Error loading';
            });
    }

    // Fetch repos from GitHub API
    const repoList = document.getElementById('repo-list');
    if (repoList) {
        const fetchOptions = GITHUB_TOKEN ? {
            headers: { 'Authorization': 'token ' + GITHUB_TOKEN }
        } : {};
        fetch('https://api.github.com/orgs/harpertoken/repos?sort=updated&per_page=20', fetchOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error('No repos found');
                }
                repoList.innerHTML = '';
                repoList.classList.add('repo-list-loaded');
                data.forEach((repo, index) => {
                    const li = document.createElement('li');
                    li.style.animationDelay = `${index * 0.05}s`;
                    const link = document.createElement('a');
                    link.href = repo.html_url;
                    link.textContent = repo.name;
                    link.className = 'kernel-link';
                    li.appendChild(link);
                    
                    const meta = document.createElement('span');
                    meta.className = 'repo-meta';
                    const metaParts = [];
                    if (repo.language) metaParts.push(repo.language);
                    if (repo.stargazers_count > 0) metaParts.push('★' + repo.stargazers_count);
                    if (repo.forks_count > 0) metaParts.push('⑂' + repo.forks_count);
                    meta.textContent = ' ' + metaParts.join(' · ');
                    li.appendChild(meta);
                    
                    repoList.appendChild(li);
                });
            })
            .catch(err => {
                console.error('Error fetching repos:', err);
                repoList.innerHTML = '<li><a href="https://github.com/harpertoken">harpertoken</a> <span class="repo-meta">(API unavailable)</span></li>';
                repoList.classList.add('repo-list-loaded');
            });
    }

    document.querySelectorAll('.team-member').forEach(member => {
        member.addEventListener('click', function(event) {
            event.preventDefault();
            const text = this.dataset.modalText;
            const href = this.href;
            modalText.innerHTML = text + '<br><a href="' + href + '">Go</a>';
            modal.style.display = 'block';
        });
    });

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('kernel-link')) {
            event.preventDefault();
            const text = event.target.dataset.modalText;
            const href = event.target.href;
            modalText.innerHTML = text + '<br><a href="' + href + '">Go</a>';
            modal.style.display = 'block';
        }
    });

    document.getElementById('legal-btn')?.addEventListener('click', function() {
        document.getElementById('modal-text').innerHTML = document.getElementById('legal-content').innerHTML;
        modal.style.display = 'block';
    });

    // Event delegation for modal buttons
    modal.addEventListener('click', function(e) {
        if (e.target.classList.contains('dotfiles-btn')) {
            document.getElementById('modal-text').textContent = e.target.dataset.modalText;
            modal.style.display = 'block';
            return;
        }
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

    window.addEventListener('scroll', function() {
        header.classList.toggle('scrolled', window.scrollY > 10);
        footer.classList.toggle('scrolled', window.scrollY > 10);
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});