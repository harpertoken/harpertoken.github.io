# harpertoken.github.io

GitHub Pages site for the [harpertoken](https://github.com/harpertoken) organization.

## Site

- Live: https://harpertoken.github.io
- Pages: `index.html`, `welcome.html`, `legal.html`, `cla.html`
- Assets: `assets/` (CSS, JS, images, generated GitHub data)

## How GitHub Data Works

The homepage shows org activity and a small “status” view (repos, latest release, open PRs, open issues).

There are two supported sources for that data:

- **Scheduled snapshot (default):** `.github/workflows/fetch-github-data.yml` updates `assets/github-data.json` (runs hourly).
- **Real-time proxy (optional):** `cf-worker/` (Cloudflare Worker) calls the GitHub API with a token and returns the same JSON schema. The frontend will prefer the proxy when configured and fall back to `assets/github-data.json` if the proxy is unavailable.

## Local Development

No build step is required (static HTML). For local testing:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Real-time Proxy (Cloudflare Worker)

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
