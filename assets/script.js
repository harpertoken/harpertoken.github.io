// Theme toggle
if (localStorage.getItem('theme') === 'dark-grey') {
    document.body.classList.add('dark-grey-theme');
}

// GitHub data
const GITHUB_DATA_URL = 'assets/github-data.json';

function safeUrl(url) {
    try {
        const parsed = new URL(url, window.location.href);
        return parsed.protocol === 'https:' ? url : null;
    } catch {
        return null;
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-grey-theme');
    if (document.body.classList.contains('dark-grey-theme')) {
        localStorage.setItem('theme', 'dark-grey');
    } else {
        localStorage.removeItem('theme');
    }
}

function convertLinks(text) {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
}

function renderViz(text) {
    const viz = document.getElementById('activity-viz');
    if (!viz) return;
    const lines = text.split('\n').slice(0, 21);
    let html = '<div class="viz-grid">';
    for (let i = 0; i < 21; i++) {
        const line = lines[i] || '';
        const hasLine = line.includes('—');
        let title = '';
        if (hasLine) {
            const date = line.match(/(\d{4}-\d{2}-\d{2})/)?.[1] || '';
            const user = line.match(/@(\w+)/)?.[1] || '';
            title = `1 commit by @${user} on ${date}`;
        }
        const level = hasLine ? (i % 4 === 0 ? 'l4' : i % 3 === 0 ? 'l3' : i % 2 === 0 ? 'l2' : 'l1') : '';
        html += `<div class="viz-cell ${level}" data-title="${title}"></div>`;
    }
    html += '</div>';
    viz.innerHTML = html;
}

// Keyboard shortcut
document.addEventListener('keydown', function(e) {
    if (e.key === 'c' || e.key === 'C') {
        toggleTheme();
    }
    if (e.key === 'Escape') {
        const modal = document.getElementById('modal');
        if (modal) modal.style.display = 'none';
    }
});

// Modal close
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Load GitHub data
    const mainRelease = document.getElementById('latest-release');
    const sidebarRepos = document.getElementById('sidebar-repos');
    const activityList = document.getElementById('activity-list');

    // Load activity from .github profile
    if (activityList) {
        fetch('https://raw.githubusercontent.com/harpertoken/.github/main/profile/readme.md')
            .then(res => res.text())
            .then(text => {
                const match = text.match(/<!-- ORG_ACTIVITY:START -->([\s\S]*?)<!-- ORG_ACTIVITY:END -->/);
                if (match) {
                    const text = match[1];
                    const lines = text.split('\n').slice(0, 8);
                    activityList.innerHTML = lines.map(l => l.trim() ? `<div>${convertLinks(l)}</div>` : '').join('');
                    renderViz(text);
                } else {
                    activityList.textContent = 'No activity';
                }
            })
            .catch(() => {
                activityList.textContent = 'Error';
            });
    }

    if (mainRelease || sidebarRepos) {
        fetch(GITHUB_DATA_URL)
            .then(response => {
                if (!response.ok) throw new Error('Network response not ok');
                return response.json();
            })
            .then(data => {
                if (mainRelease && data.latest_release) {
                    const url = safeUrl(data.latest_release.html_url);
                    if (url) {
                        mainRelease.innerHTML = `<a href="${url}">${data.latest_release.tag_name.replace('v', '')}</a>`;
                    }
                }

                if (sidebarRepos && data.repos) {
                    sidebarRepos.innerHTML = '';
                    data.repos.slice(0, 8).forEach(repo => {
                        const link = document.createElement('a');
                        link.href = safeUrl(repo.html_url) || '#';
                        link.textContent = repo.name;
                        sidebarRepos.appendChild(link);
                    });
                }
            })
            .catch(err => {
                console.error('Fetch error:', err);
                if (sidebarRepos) {
                    sidebarRepos.innerHTML = '<a href="https://github.com/harpertoken">harpertoken</a>';
                }
                if (mainRelease) {
                    mainRelease.textContent = 'v0.7.0';
                }
            });
    }
});