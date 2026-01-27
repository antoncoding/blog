const fs = require('fs');
const path = require('path');
const { NotionAPI } = require('notion-client');

const api = new NotionAPI();

// Read posts from the build output
const indexData = JSON.parse(fs.readFileSync('.next/server/pages/index.json', 'utf8'));
const posts = indexData.pageProps.dehydratedState.queries[0].state.data;

console.log(`Found ${posts.length} posts to migrate\n`);

// Clear existing markdown files
const postsDir = 'posts';
if (fs.existsSync(postsDir)) {
  fs.readdirSync(postsDir).forEach(file => {
    if (file.endsWith('.md')) {
      fs.unlinkSync(path.join(postsDir, file));
    }
  });
}

async function migratePost(post) {
  try {
    const { id, title, slug, date, tags, type, status, summary } = post;
    
    // Only migrate Public posts
    if (!status?.[0] || status[0] !== 'Public') {
      console.log(`Skipping private/draft: ${title}`);
      return;
    }
    
    console.log(`Migrating: ${title}`);
    
    // Use date from post
    const postDate = date?.start_date || new Date().toISOString().split('T')[0];
    
    // Normalize tags
    const normalizedTags = (tags || []).map(tag => {
      if (tag === '中文' || tag.includes('中文')) return 'chinese';
      if (tag === 'Blog' || tag === 'blog') return 'life';  
      if (tag.toLowerCase().includes('defi')) return 'defi';
      return tag.toLowerCase();
    });
    
    // Try to get content from Notion
    let content = '';
    try {
      const fullPage = await api.getPage(id);
      
      // Extract content from blocks
      const blocks = Object.values(fullPage.block)
        .filter(b => b.value && b.value.id !== id);
      
      blocks.forEach(block => {
        const b = block.value;
        
        // Extract text with formatting
        const extractText = (titleArray) => {
          if (!titleArray) return '';
          
          return titleArray.map(segment => {
            const text = segment[0];
            const formatting = segment[1];
            
            if (formatting && formatting.length > 0) {
              const format = formatting[0];
              if (format[0] === 'b') return `**${text}**`;
              if (format[0] === 'i') return `*${text}*`;
              if (format[0] === 'c') return `\`${text}\``;
              if (format[0] === 'a') {
                const url = format[1];
                return `[${text}](${url})`;
              }
            }
            return text;
          }).join('');
        };
        
        const text = extractText(b.properties?.title);
        
        // Format based on block type
        switch(b.type) {
          case 'header':
            if (text) content += `\n## ${text}\n\n`;
            break;
          case 'sub_header':
            if (text) content += `\n### ${text}\n\n`;
            break;
          case 'sub_sub_header':
            if (text) content += `\n#### ${text}\n\n`;
            break;
          case 'quote':
            if (text) content += `> ${text}\n\n`;
            break;
          case 'bulleted_list':
            if (text) content += `- ${text}\n`;
            break;
          case 'numbered_list':
            if (text) content += `1. ${text}\n`;
            break;
          case 'divider':
            content += '\n---\n\n';
            break;
          case 'image':
            // Get image URL
            const imageUrl = b.properties?.source?.[0]?.[0] || 
                          b.format?.display_source ||
                          b.properties?.file?.[0]?.[1]?.[0]?.[1];
            
            if (imageUrl) {
              const caption = extractText(b.properties?.caption) || '';
              content += `\n![${caption}](${imageUrl})\n\n`;
            }
            break;
          case 'code':
            const code = extractText(b.properties?.title);
            const lang = b.properties?.language?.[0]?.[0] || '';
            if (code) {
              content += `\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
            }
            break;
          case 'text':
            if (text && text.trim()) {
              content += `${text}\n\n`;
            }
            break;
        }
      });
    } catch (e) {
      console.log(`  Could not fetch full content: ${e.message}`);
      content = summary || '';
    }
    
    // Create filename
    const filename = `${postDate}-${slug}.md`;
    
    // Create markdown
    const markdown = `---
title: "${title}"
date: ${postDate}
tags: [${normalizedTags.map(t => `"${t}"`).join(', ')}]
status: "Public"
type: "${type?.[0] || 'Post'}"
---

# ${title}

${content.trim() || summary || 'Content to be added.'}
`;
    
    // Write file
    fs.writeFileSync(path.join(postsDir, filename), markdown, 'utf8');
    console.log(`  ✓ Created ${filename}`);
    
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
  }
}

// Migrate all posts
async function main() {
  for (const post of posts) {
    await migratePost(post);
  }
  console.log('\n✅ Migration complete!');
  console.log('\nNow you can remove Notion dependency by:');
  console.log('1. Deleting NOTION_PAGE_ID from .env');
  console.log('2. Removing notion-client from package.json');
}

main();