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

function safeApiUrl(url) {
    try {
        if (!url) return null;
        const parsed = new URL(url, window.location.href);
        const isHttps = parsed.protocol === 'https:';
        const isLocalHttp = parsed.protocol === 'http:' && (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1');
        return (isHttps || isLocalHttp) ? parsed.href : null;
    } catch {
        return null;
    }
}

function getGhProxyUrl() {
    const meta = document.querySelector('meta[name="gh-proxy-url"]');
    const content = meta?.getAttribute('content')?.trim();
    return safeApiUrl(content || '');
}

function formatTimeAgo(dateString) {
    try {
        const d = new Date(dateString);
        if (Number.isNaN(d.getTime())) return null;
        const secs = Math.floor((Date.now() - d.getTime()) / 1000);
        if (secs < 60) return 'just now';
        const mins = Math.floor(secs / 60);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
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

    const fetchTimeEl = document.getElementById('fetch-time');
    const openPrs = document.getElementById('open-prs');
    const openIssues = document.getElementById('open-issues');
    const cached = { fetched_at: null, open_prs: null, open_issues: null };

    const formatYmd = (dateString) => {
        try {
            const d = new Date(dateString);
            if (Number.isNaN(d.getTime())) return null;
            return d.toISOString().slice(0, 10);
        } catch { return null; }
    };

    const renderOpenItems = (container, payload, label) => {
        if (!container || !payload || !Array.isArray(payload.items)) {
            if (container) container.textContent = 'No data';
            return;
        }
        const header = container.closest('.content-card')?.querySelector('h2');
        if (header && typeof payload.total_count === 'number') {
            header.textContent = `${label} (${payload.total_count})`;
        }
        if (payload.items.length === 0) {
            container.textContent = 'None';
            return;
        }
        container.innerHTML = payload.items.slice(0, 10).map(item => {
            const url = safeUrl(item.html_url);
            const title = String(item.title || '').slice(0, 60);
            const repo = item.repo || '';
            const number = item.number || '';
            const updated = formatYmd(item.updated_at);
            const titleHtml = url ? `<a href="${url}" target="_blank">${title}</a>` : title;
            return `<div class="issue-item"><div class="issue-title">${titleHtml}</div><div class="issue-meta"><span>${repo}#${number}</span> · <span>${updated}</span></div></div>`;
        }).join('');
    };

    const renderData = (data) => {
        cached.fetched_at = data.fetched_at;
        cached.open_prs = data.open_prs;
        cached.open_issues = data.open_issues;

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

        if (openPrs && data.open_prs) {
            renderOpenItems(openPrs, data.open_prs, 'Open PRs');
        }
        if (openIssues && data.open_issues) {
            renderOpenItems(openIssues, data.open_issues, 'Open Issues');
        }

        if (fetchTimeEl && cached.fetched_at) {
            fetchTimeEl.textContent = formatTimeAgo(cached.fetched_at) || '';
        }

        const siteVersion = document.getElementById('site-version');
        if (siteVersion && data.site_release) {
            const tag = data.site_release.tag_name?.replace('v', '') || '';
            siteVersion.innerHTML = tag ? `<a href="${data.site_release.html_url}">${tag}</a>` : 'None';
        } else if (siteVersion) {
            siteVersion.textContent = 'None';
        }
    };

    const handleError = () => {
        if (sidebarRepos) {
            sidebarRepos.innerHTML = '<a href="https://github.com/harpertoken">harpertoken</a>';
        }
        if (mainRelease) {
            mainRelease.textContent = 'v0.7.0';
        }
    };

    if (mainRelease || sidebarRepos) {
        const proxyUrl = getGhProxyUrl();
        const primaryUrl = proxyUrl || GITHUB_DATA_URL;
        const fallbackUrl = proxyUrl ? GITHUB_DATA_URL : null;

        fetch(primaryUrl)
            .then(response => {
                if (!response.ok) throw new Error('Network response not ok');
                return response.json();
            })
            .then(data => renderData(data))
            .catch(err => {
                if (fallbackUrl) {
                    fetch(fallbackUrl)
                        .then(r => { if (!r.ok) throw new Error('Network response not ok'); return r.json(); })
                        .then(data => renderData(data))
                        .catch(fallbackErr => {
                            console.error('Fetch error:', err, fallbackErr);
                            handleError();
                        });
                    return;
                }
                console.error('Fetch error:', err);
                handleError();
            });
    }
});