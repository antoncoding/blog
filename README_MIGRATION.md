# Blog Migration Guide

## Current Status ✅

### Completed
1. **RSS Feed Support** ✅
   - RSS feed auto-generates at `/rss.xml` during build

2. **Clean Share Button** ✅  
   - Minimal "share" button in top-right of post
   - Copies link to clipboard

3. **Multiple Content Sources** ✅
   - Notion (existing)
   - Local Obsidian files (`/posts` directory)
   - **GitHub fetching (NEW!)** - Auto-fetch from your Obsidian vault

## Setup: Auto-fetch from GitHub

### 1. Configure Environment Variables

In your Vercel dashboard or `.env.local`:

```env
# Your Obsidian vault on GitHub
GITHUB_OWNER=your-github-username
GITHUB_REPO=your-obsidian-vault
GITHUB_PATH=posts  # Path to markdown files in repo

# Optional: for private repos
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

### 2. Post Format

In your Obsidian vault, use this frontmatter:

```markdown
---
title: "Your Post Title"
date: 2026-01-27
tags: ["tag1", "tag2"]
category: ["Tech"]
summary: "Brief description"
status: "Public"  # or "Private" to hide
type: "Post"
---

Your content here...
```

### 3. Workflow

1. Write in Obsidian
2. Commit & push to GitHub (can be automated with Obsidian Git plugin)
3. Blog auto-fetches during build
4. No need to update blog repo!

## How It Works

At build time, the blog:
1. Fetches all `.md` files from your GitHub repo
2. Parses frontmatter
3. Combines with any Notion/local posts
4. Generates static pages

## Benefits

- ✅ Write in Obsidian, publish automatically
- ✅ Version control for your posts
- ✅ No manual copying
- ✅ Can use private repos (with token)
- ✅ Works with Obsidian Git plugin

## Deployment

1. Set environment variables in Vercel
2. Merge this PR
3. Future posts just push to your Obsidian vault repo
4. Trigger rebuild (automatic with webhooks, or manual)