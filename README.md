# harpertoken.github.io

This is the GitHub Pages site for [harpertoken](https://github.com/harpertoken), featuring a profile page for Harper with information on open source tools, kernel development, and CI/CD pipelines.

## View the Site

Visit the live site at: https://harpertoken.github.io

## Local Development

To run locally:
1. Clone the repository.
2. Open `index.html` in your web browser.

No build process is required as it's a static HTML site.

## Contributing

This project uses conventional commit standards.

## GitHub Discussions

When creating a GitHub Discussion, choose a category that best matches the topic. For discussions about documentation tone, style, and guidance, we recommend one of the following categories:
- **Ideas**: For exploratory or design-focused topics. This is often the best fit.
- **Documentation**: For topics specific to this repository's documentation (use if this category exists).
- **General**: As a catch-all if no other category is a good fit.

## Setup

To enable the commit-msg hook, copy it to your .git/hooks/ directory:

```bash
cp scripts/commit-msg .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg
```

## Usage

Commit messages must:
- Start with a conventional type: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
- Be lowercase
- First line ≤60 characters

## Rewriting History

To clean up existing commit messages, run:

```bash
./scripts/rewrite_msg.sh
```

Then force-push:

```bash
git push --force origin main
```
