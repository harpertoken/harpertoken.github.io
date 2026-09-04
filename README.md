<p align="center">
  <img src="https://raw.githubusercontent.com/harpertoken/harpertoken.github.io/main/.github/assets/thumbnail.png" alt="harpertokengithubio" width="100%">
</p>

# harpertoken public site

[![Website](https://img.shields.io/website?down_color=red&down_message=offline&up_message=online&url=https%3A%2F%2Fharpertoken.github.io)](https://harpertoken.github.io)
[![License](https://img.shields.io/github/license/harpertoken/harpertoken.github.io)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/harpertoken/harpertoken.github.io)](https://github.com/harpertoken/harpertoken.github.io/commits/main)

This repository hosts the public website for Harpertoken. It is the landing page for the organization and includes the main profile experience, legal and contributor pages, and the welcome flow for new contributors.

## What this site includes

- A public landing page for Harpertoken
- Links to GitHub, Docker, and other community platforms
- Contributor-facing pages such as the CLA and legal information
- Dynamic content for recent activity, releases, and project status
- A small Cloudflare Worker for supporting site features

## Local preview

You can preview the site locally with a simple static server:

```bash
python3 -m http.server 8000
```

Then open http://127.0.0.1:8000/ in your browser.

## Repo structure

- index.html, legal.html, welcome.html, cla.html: site pages
- assets/: styles, scripts, and shared assets
- cf-worker/: Cloudflare Worker code used by the site
- linter/: simple HTML validation script
