# Posts Directory

## Writing New Posts

Create markdown files with this format:

```markdown
---
title: "Your Post Title"
date: 2026-01-27
tags: ["defi", "chinese", "life"]
status: "Public"  # or "Private" to hide
type: "Post"
---

# Your Post Title

Your content here...
```

## Adding Images

### Option 1: GitHub (Recommended)
1. Add images to `public/images/` folder
2. Reference: `![Caption](/images/your-image.png)`

### Option 2: External Hosting
- Use Imgur, Cloudinary, etc.
- Reference: `![Caption](https://imgur.com/...)`

## Tags
- `chinese` - Chinese content
- `life` - Personal/life posts  
- `defi` - DeFi/crypto content

## Workflow
1. Write in Obsidian (open this folder as vault)
2. Commit & push
3. Auto-deploys to Vercel