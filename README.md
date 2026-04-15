# harpertoken.github.io

GitHub Pages site for the [harpertoken](https://github.com/harpertoken) organization.

## Site

- Live: https://harpertoken.github.io
- Pages: `index.html`, `welcome.html`, `legal.html`, `cla.html`
- Assets: `assets/` (CSS, JS, images, generated GitHub data)

### Homepage Features

- **Sidebar**: Team avatars with status dots, repos list, navigation
- **Main area**:
  - Hero image and tagline
  - Activity feed with recent org commits
  - Graph visualization (21 cells showing recent activity)
  - Library (harper release) + Site (site version) cards
  - Contact and Social links
- **Right sidebar**: Open PRs and issues cards (real-time when Worker enabled)
- **Theme**: Light/dark mode (press `C` to toggle)

## How GitHub Data Works

The homepage displays org activity fetched from GitHub. Data sources:

- **Scheduled snapshot (default):** `.github/workflows/fetch-github-data.yml` updates `assets/github-data.json` hourly.
- **Real-time proxy (optional):** `cf-worker/` (Cloudflare Worker) calls the GitHub API directly for live data.

### Real-time Features

When the Worker is enabled:
- **Team status dots**: Green = active <1h, yellow = active <24h, gray = older. Hover for exact time.
- **Open PRs/Issues**: Live counts and recent items in the right sidebar.
- **Library + Site releases**: Latest versions in the main area cards.
- **Last updated**: Timestamp showing when data was fetched.

## Local Development

No build step is required (static HTML). For local testing:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Real-time Proxy (Cloudflare Worker)

The Worker fetches:
- Org repos
- Open PRs and issues
- Team member activity for status dots

1. From `cf-worker/`, deploy with Wrangler:
   - `wrangler secret put GITHUB_TOKEN`
   - `wrangler deploy`
2. Point the site at your Worker:
   - `index.html`: `<meta name="gh-proxy-url" content="https://YOUR-WORKER.workers.dev/status">`

## Contributing

We keep changes small, readable, and easy to maintain.

Commit messages follow conventional commits:

- Start with a conventional type: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
- Be lowercase
- First line ≤60 characters

Optional: enable the commit-msg hook locally:

```bash
cp scripts/commit-msg .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg
```

## Support / Contact

- Org: https://github.com/harpertoken
- Email: `harpertoken@icloud.com`
- Social: Bluesky + Patreon links are on the homepage
