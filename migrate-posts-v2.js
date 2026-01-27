const { NotionAPI } = require('notion-client');
const fs = require('fs');
const path = require('path');

const api = new NotionAPI();
const NOTION_PAGE_ID = '7016071ebbbc4574b2f064f708a6545e';

async function getAllPosts() {
  const response = await api.getPage(NOTION_PAGE_ID);
  
  // Get all posts with metadata
  const posts = [];
  
  Object.entries(response.block).forEach(([id, block]) => {
    if (block.value?.properties?.title && block.value?.parent_id === NOTION_PAGE_ID) {
      const title = block.value.properties.title[0][0];
      const status = block.value.properties?.status?.[0]?.[0] || 'Public';
      const type = block.value.properties?.type?.[0]?.[0] || 'Post';
      
      // Only include Public posts
      if (status === 'Public' && type === 'Post') {
        posts.push({
          id,
          title,
          meta: block.value
        });
      }
    }
  });
  
  console.log(`Found ${posts.length} public posts`);
  return posts;
}

async function migratePost(postData) {
  const { id, title, meta } = postData;
  
  console.log(`\nMigrating: ${title}`);
  
  // Get full page content
  const fullPage = await api.getPage(id);
  
  // Extract metadata
  const date = meta.properties?.date?.date?.start_date || 
               new Date(meta.created_time).toISOString().split('T')[0];
  
  // Fix tags - extract and clean
  let tags = [];
  if (meta.properties?.tags?.[0]?.[0]) {
    const tagString = meta.properties.tags[0][0];
    tags = tagString.split(',').map(t => t.trim());
    
    // Normalize tags
    tags = tags.map(tag => {
      if (tag === '中文' || tag.includes('中文')) return 'chinese';
      if (tag === 'Blog' || tag === 'blog') return 'life';
      if (tag.toLowerCase().includes('defi')) return 'defi';
      return tag.toLowerCase();
    });
  }
  
  // Extract content with better formatting
  let content = '';
  const blocks = Object.values(fullPage.block)
    .filter(b => b.value && b.value.id !== id)
    .sort((a, b) => {
      const parentA = a.value?.parent_id === id ? 0 : 1;
      const parentB = b.value?.parent_id === id ? 0 : 1;
      return parentA - parentB;
    });
  
  blocks.forEach(block => {
    const b = block.value;
    if (!b) return;
    
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
    
    // Add content based on block type
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
        // Fix image URLs
        let imageUrl = b.properties?.source?.[0]?.[0] || 
                      b.format?.display_source ||
                      b.properties?.file?.[0]?.[1]?.[0]?.[1];
        
        if (imageUrl) {
          // Handle Notion's signed URLs
          if (imageUrl.includes('notion.so') || imageUrl.includes('amazonaws')) {
            // For Notion images, try to get the original URL
            const originalUrl = b.properties?.source?.[0]?.[0] || imageUrl;
            imageUrl = originalUrl;
          }
          
          const caption = extractText(b.properties?.caption) || 'Image';
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
  
  // Create slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '');
  
  const filename = `${date}-${slug}.md`;
  
  const markdown = `---
title: "${title}"
date: ${date}
tags: [${tags.map(t => `"${t}"`).join(', ')}]
status: "Public"
type: "Post"
---

# ${title}

${content.trim()}
`;
  
  // Write to file
  const filePath = path.join('posts', filename);
  fs.writeFileSync(filePath, markdown, 'utf8');
  
  console.log(`✅ Migrated to: ${filename}`);
  return filename;
}

async function main() {
  console.log('Starting full migration...\n');
  
  const posts = await getAllPosts();
  
  // First, delete existing markdown files to avoid duplicates
  const existingFiles = fs.readdirSync('posts');
  existingFiles.forEach(file => {
    if (file.endsWith('.md')) {
      fs.unlinkSync(path.join('posts', file));
      console.log(`Deleted old file: ${file}`);
    }
  });
  
  console.log('\nMigrating posts...');
  
  for (const post of posts) {
    try {
      await migratePost(post);
    } catch (error) {
      console.error(`Failed to migrate "${post.title}": ${error.message}`);
    }
  }
  
  console.log('\n✅ Migration complete!');
}

main().catch(console.error);