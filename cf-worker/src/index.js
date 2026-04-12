function jsonResponse(data, { status = 200, corsOrigin = '*' } = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': corsOrigin,
      'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-allow-headers': 'content-type, authorization',
      'cache-control': 'public, max-age=60, s-maxage=60',
    },
  });
}

function errorResponse(message, { status = 500 } = {}) {
  return jsonResponse({ error: message }, { status });
}

async function ghJson(url, token) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'harpertoken-github-status',
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub ${res.status} for ${url}${text ? `: ${text.slice(0, 200)}` : ''}`);
  }
  return res.json();
}

function repoFromRepositoryUrl(repositoryUrl) {
  try {
    const parts = String(repositoryUrl).split('/');
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

function pickIssueItem(item) {
  return {
    repo: repoFromRepositoryUrl(item.repository_url),
    number: item.number,
    title: item.title,
    html_url: item.html_url,
    updated_at: item.updated_at,
    user: item.user?.login ?? null,
    comments: item.comments,
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
    if (request.method !== 'GET') return errorResponse('Method not allowed', { status: 405 });

    // Allow both: /status and /api/status
    if (!(url.pathname === '/status' || url.pathname === '/api/status')) {
      return errorResponse('Not found', { status: 404 });
    }

    const token = env.GITHUB_TOKEN;
    if (!token) return errorResponse('Missing GITHUB_TOKEN secret', { status: 500 });

    const org = env.ORG || 'harpertoken';
    const releaseRepo = env.RELEASE_REPO || `${org}/harper`;

    const cacheKey = new Request(url.toString(), request);
    const cache = caches.default;
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    try {
      const [repos, release, openPrs, openIssues] = await Promise.all([
        ghJson(`https://api.github.com/orgs/${org}/repos?sort=pushed&per_page=20`, token),
        ghJson(`https://api.github.com/repos/${releaseRepo}/releases/latest`, token),
        ghJson(
          `https://api.github.com/search/issues?q=org:${org}+is:pr+is:open&sort=updated&order=desc&per_page=10`,
          token,
        ),
        ghJson(
          `https://api.github.com/search/issues?q=org:${org}+is:issue+is:open&sort=updated&order=desc&per_page=10`,
          token,
        ),
      ]);

      const payload = {
        fetched_at: new Date().toISOString(),
        repos: repos.map(r => ({
          name: r.name,
          html_url: r.html_url,
          language: r.language,
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
        })),
        latest_release: {
          tag_name: release.tag_name,
          html_url: release.html_url,
        },
        open_prs: {
          total_count: openPrs.total_count ?? 0,
          items: Array.isArray(openPrs.items) ? openPrs.items.map(pickIssueItem) : [],
        },
        open_issues: {
          total_count: openIssues.total_count ?? 0,
          items: Array.isArray(openIssues.items) ? openIssues.items.map(pickIssueItem) : [],
        },
      };

      const response = jsonResponse(payload);
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    } catch (err) {
      return errorResponse(err?.message || 'Unknown error', { status: 502 });
    }
  },
};

