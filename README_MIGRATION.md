# Blog Migration Guide

## Current Status ✅

### Completed
1. **RSS Feed Support** ✅
   - RSS feed auto-generates at `/rss.xml` during build
   - Added RSS link in footer

2. **Social Sharing** ✅  
   - Added Twitter, Facebook, LinkedIn share buttons
   - Share buttons appear at the bottom of each post

3. **Hybrid Content Support** ✅
   - Blog can now pull from both Notion AND local Obsidian files
   - Posts in `/posts` directory (Markdown with frontmatter)

### Setup Instructions

#### For Obsidian Integration

1. **Connect Your Obsidian Vault**
   
   Option A: Direct sync to this repo
   ```bash
   # In your Obsidian vault
   ln -s /path/to/obsidian/vault/posts blog-repo/posts
   ```
   
   Option B: GitHub sync from separate repo
   ```bash
   # Create a GitHub action in your Obsidian vault repo
   # to copy posts to this blog repo on push
   ```

2. **Obsidian Post Format**
   
   Create posts with this frontmatter:
   ```markdown
   ---
   title: "Your Post Title"
   date: 2026-01-27
   tags: ["tag1", "tag2"]
   category: ["Tech"]
   summary: "Brief description"
   status: "Public"  # or "Private" to hide
   type: "Post"      # or "Page"
   thumbnail: "/images/thumb.jpg"  # optional
   ---
   
   Your content here...
   ```

3. **Deploy Changes**
   ```bash
   npm run build
   npm run start
   ```

### Next Steps for Engagement Features

To add likes/reactions, we need to decide on the backend:

1. **Option 1: Supabase** (Recommended)
   - Real-time likes counter
   - No GitHub account needed
   - Need to set up Supabase project

2. **Option 2: GitHub Reactions** 
   - Uses GitHub issues API
   - Requires visitors to have GitHub account
   - Free, no extra setup

3. **Option 3: Custom Backend**
   - Full control
   - Requires hosting

Let me know which you prefer!

## Environment Variables Needed

Add to `.env.local`:
```env
NOTION_PAGE_ID=your_notion_database_id
```

## Questions

1. **Obsidian Vault Location**: Where is your Obsidian vault with blog posts? Is it on GitHub?
2. **Engagement Backend**: Which option for likes/reactions do you prefer?
3. **Comments**: Keep Utterances (GitHub-based) or switch to something else?
