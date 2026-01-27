# Quick Fix for Current Setup

If you want to keep Next.js but do it RIGHT:

## Remove the GitHub Fetching

```bash
# 1. Add your Obsidian vault as a submodule instead
git submodule add https://github.com/antoncoding/obsidian-vault.git vault-posts

# 2. Update package.json
"scripts": {
  "sync": "cp -r vault-posts/*.md posts/",
  "build": "npm run sync && next build"
}
```

## Simplify the API

```typescript
// src/apis/index.ts - SIMPLIFIED
import * as notion from "./notion-client"
import { getObsidianPosts } from "./obsidian-client"

export const getPosts = async () => {
  // Just read local files, no external APIs
  const notionPosts = await notion.getPosts()
  const localPosts = await getObsidianPosts()
  
  return [...notionPosts, ...localPosts].sort(/*...*/)
}
```

## Remove complexity
- Delete `src/apis/github-fetch/`
- No environment variables needed
- No API rate limits
- Faster, simpler, more reliable

This makes your build:
- Deterministic (same input = same output)
- Fast (no network calls)
- Reliable (no external dependencies)