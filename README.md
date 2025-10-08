# Project

This project uses conventional commit standards.

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