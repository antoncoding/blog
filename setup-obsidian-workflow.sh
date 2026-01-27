#!/bin/bash

echo "🚀 Setting up Obsidian workflow for blog"

# 1. Remove GitHub fetching code (over-engineered)
echo "Cleaning up unnecessary code..."
rm -rf src/apis/github-fetch

# 2. Create posts directory if not exists
mkdir -p posts

# 3. Add .obsidian to gitignore
echo ".obsidian/" >> .gitignore

# 4. Create sample post with correct format
cat > posts/2026-01-27-welcome.md << 'POST'
---
title: "Welcome to My Blog"
date: 2026-01-27
tags: ["introduction", "blog"]
summary: "Starting fresh with Obsidian + Next.js"
status: "Public"
type: "Post"
---

# Welcome!

This blog is now powered by:
- Writing: Obsidian
- Framework: Next.js  
- Hosting: Vercel

Best of both worlds:
- Simple writing experience
- Future expandability for cool features
POST

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Open this folder in Obsidian: $(pwd)/posts"
echo "2. Write your posts"
echo "3. git add . && git commit && git push"
echo "4. Auto-deploys to Vercel!"
