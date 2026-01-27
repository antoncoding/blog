# 安安冬冬 Blog

A personal blog powered by **Obsidian** + **Next.js** + **Vercel**.

## Features

✨ **Pure Obsidian Workflow**
- Write in Obsidian vault (`posts/` folder)
- Auto-saves to GitHub
- Deploy on push

📝 **Markdown First**
- Local markdown files in `posts/`
- Images stored in `posts/attachments/`
- Served dynamically via API

🎨 **Beautiful Typography**
- Inter font for clean readability
- Light mode by default
- Responsive design

📷 **Image Support**
- Auto-embed from `posts/attachments/`
- API-based serving (`/api/image/[filename]`)
- Responsive sizing

🎬 **YouTube Embedding**
- Bare YouTube URLs auto-convert to embedded iframes
- Works with both `youtube.com/watch?v=` and `youtu.be/` formats

## Getting Started

### Setup

```bash
# Clone and install
git clone https://github.com/antoncoding/blog.git
cd blog
npm install
```

### Writing Posts

1. **Open Obsidian**
   - Open `blog-repo/posts` as your vault

2. **Create a Post**
   ```markdown
   ---
   title: "Your Title"
   date: 2026-01-27
   tags: ["tag1", "tag2"]
   status: "Public"
   type: "Post"
   ---

   # Your Title

   Content here...
   ```

3. **Add Images**
   - Drag images into Obsidian
   - They auto-save to `posts/attachments/`
   - Markdown auto-converts: `![](image.webp)` → `/api/image/image.webp`

4. **Publish**
   ```bash
   git add .
   git commit -m "new post: your title"
   git push
   ```
   Auto-deploys to Vercel!

### Development

```bash
npm run dev
# Visit http://localhost:3001
```

## Project Structure

```
blog-repo/
├── posts/               # Your Obsidian vault
│   └── attachments/     # Images
├── src/
│   ├── components/      # React components
│   ├── pages/          # Next.js pages
│   └── routes/         # Page layouts
├── public/             # Static assets (favicon, etc.)
└── site.config.js      # Blog configuration
```

## Configuration

Edit `site.config.js` to customize:
- Site title and description
- Profile info
- Links and social media

## Deployment

Deployed on **Vercel** with automatic builds on every push to `main`.

---

Built with 💙 by Anton | [GitHub](https://github.com/antoncoding/blog) | [Website](https://antonttc.com)