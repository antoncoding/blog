# Writing Posts in Obsidian

## Setup

1. Open this folder (`blog-repo/posts`) as an Obsidian vault
2. In Obsidian Settings → Files & Links → Set attachment folder to `../public/images`

## Writing Posts

Create markdown files in this folder with format:

```markdown
---
title: "Post Title"
date: 2026-01-27
tags: ["defi", "chinese"]
status: "Public"
type: "Post"
---

# Post Title

Your content here...
```

## Adding Images

**Easy way:**
1. Paste or drag image into Obsidian
2. Image auto-saves to `public/images`
3. Markdown shows: `![[image.png]]`
4. Frontend auto-converts to `![image](/images/image.png)`
5. **Images auto-center!**

## Test Locally

```bash
npm run dev
# Visit http://localhost:3000
# Images should be centered and properly sized
```

## Deploy

```bash
git add .
git commit -m "new post: your title"
git push
# Auto-deploys to Vercel!
```

Done!