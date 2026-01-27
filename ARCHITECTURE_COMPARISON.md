# Static Site Generator Architecture Comparison

## How Hugo/Jekyll/11ty Work (Best Practice)

```
1. Content lives IN the same repo
   blog-repo/
   ├── content/posts/  <- Your markdown files HERE
   ├── layouts/        <- Templates
   └── config.yaml     <- Site config

2. Simple build process
   - NO runtime API calls
   - NO external fetching
   - Just reads local files → generates HTML

3. Publishing workflow
   - Write post → Commit to repo → Push
   - CI/CD (Vercel/Netlify) auto-builds
   - Done!
```

## Current Implementation (Over-engineered)

```
What I built:
- Fetches from Notion API at build time ❌
- Fetches from GitHub API at build time ❌
- Complex, slow, can fail

Problems:
- API rate limits
- Build failures if GitHub is down
- Slower builds
- More complexity
```

## The RIGHT Way (Hugo-style)

### Option 1: Submodule (Best for your case)
```bash
# Add your Obsidian vault as a submodule
git submodule add https://github.com/antoncoding/obsidian-vault.git content/posts

# Now posts are part of the repo but tracked separately
# When you update Obsidian vault, just:
git submodule update --remote
git commit -m "Update posts"
git push
```

### Option 2: GitHub Actions (Automated)
```yaml
# In Obsidian vault: .github/workflows/sync.yml
on:
  push:
    branches: [main]
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Copy posts to blog
        run: |
          # Copy markdown files to blog repo
          # Trigger blog rebuild
```

### Option 3: Just Use Hugo! 
```bash
# Honestly, for a simple blog:
brew install hugo
hugo new site my-blog
cd my-blog

# Write posts
hugo new posts/my-post.md

# Build
hugo

# That's it! 1000x simpler
```

## Why Next.js for a Blog is Overkill

**Next.js is for:**
- Dynamic web apps
- Server-side rendering
- Complex interactions

**Hugo/11ty is for:**
- Static blogs
- Fast builds (< 1 second)
- Simple content management

## Recommendation

For your use case (Obsidian → Blog):

1. **SIMPLEST**: Use Hugo + Obsidian
   - Hugo reads markdown directly
   - No API calls, no complexity
   - Builds in milliseconds

2. **If keeping current setup**: Use submodules
   - Remove all the GitHub fetching code
   - Add Obsidian vault as submodule
   - Let Next.js read local files

3. **Middle ground**: Astro
   - Modern, supports MDX
   - Better than Next.js for content sites
   - Still reads local files