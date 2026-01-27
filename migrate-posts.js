const { NotionAPI } = require('notion-client');
const fs = require('fs');
const path = require('path');

const api = new NotionAPI();
const NOTION_PAGE_ID = '7016071ebbbc4574b2f064f708a6545e';

async function getPostByTitle(searchTitle) {
  const response = await api.getPage(NOTION_PAGE_ID);
  
  // Find the post
  let postId = null;
  let postMeta = null;
  
  Object.entries(response.block).forEach(([id, block]) => {
    if (block.value?.properties?.title) {
      const title = block.value.properties.title[0][0];
      if (title?.includes(searchTitle)) {
        postId = id;
        postMeta = block.value;
      }
    }
  });
  
  if (!postId) {
    console.log(`Post not found: ${searchTitle}`);
    return null;
  }
  
  console.log(`Found: ${postMeta.properties.title[0][0]}`);
  
  // Get full page content
  const fullPage = await api.getPage(postId);
  
  // Extract metadata
  const title = postMeta.properties.title[0][0];
  const date = postMeta.properties?.date?.date?.start_date || 
               new Date(postMeta.created_time).toISOString().split('T')[0];
  const tags = postMeta.properties?.tags?.[0]?.[0]?.split(',').map(t => t.trim()) || [];
  const status = postMeta.properties?.status?.[0]?.[0] || 'Public';
  const type = postMeta.properties?.type?.[0]?.[0] || 'Post';
  
  // Extract content
  let content = '';
  const blocks = Object.values(fullPage.block)
    .sort((a, b) => {
      // Sort by position if available
      const posA = a.value?.position || 0;
      const posB = b.value?.position || 0;
      return posA - posB;
    });
  
  blocks.forEach(block => {
    const b = block.value;
    if (!b || b.id === postId) return;
    
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
        const url = b.properties?.source?.[0]?.[0] || b.format?.display_source;
        const caption = extractText(b.properties?.caption);
        if (url) {
          content += `\n![${caption || 'Image'}](${url})\n\n`;
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
    .replace(/[^a-z0-9\u4e00-\u9fff]+/gi, '-')
    .replace(/^-|-$/g, '');
  
  return {
    title,
    date,
    tags,
    status,
    type,
    slug,
    content: content.trim()
  };
}

async function migratePost(searchTitle) {
  const post = await getPostByTitle(searchTitle);
  
  if (!post) return;
  
  const filename = `${post.date}-${post.slug}.md`;
  
  const markdown = `---
title: "${post.title}"
date: ${post.date}
tags: [${post.tags.map(t => `"${t}"`).join(', ')}]
status: "${post.status}"
type: "${post.type}"
---

# ${post.title}

${post.content}
`;
  
  // Write to file
  const filePath = path.join('posts', filename);
  fs.writeFileSync(filePath, markdown, 'utf8');
  
  console.log(`✅ Migrated to: posts/${filename}`);
  return filename;
}

// Migrate test posts
async function main() {
  console.log('Starting migration...\n');
  
  // Migrate 2 test posts
  await migratePost('AI 雜感');
  await migratePost('Trustless');
  
  console.log('\n✅ Test migration complete!');
}

main().catch(console.error);