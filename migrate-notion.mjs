import { NotionAPI } from 'notion-client';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const api = new NotionAPI();
const pageId = '7016071ebbbc4574b2f064f708a6545e';

// Ensure posts directory exists
if (!existsSync('posts')) {
  await mkdir('posts');
}

console.log('Fetching Notion database...');
const response = await api.getPage(pageId);

// Get all page blocks
const pageBlocks = Object.entries(response.block)
  .filter(([id, block]) => {
    return block.value?.type === 'page' && 
           block.value?.properties?.title &&
           block.value?.parent_id === pageId;
  });

console.log(`Found ${pageBlocks.length} posts to migrate`);

for (const [id, block] of pageBlocks) {
  try {
    const properties = block.value.properties;
    const title = properties.title[0][0];
    
    // Skip if no title
    if (!title) continue;
    
    // Get date
    const createdTime = new Date(block.value.created_time);
    const date = block.value.properties.date?.date?.start_date || 
                 createdTime.toISOString().split('T')[0];
    
    // Get tags
    let tags = [];
    if (properties.tags) {
      const tagString = properties.tags[0][0];
      if (tagString) {
        tags = tagString.split(',').map(t => t.trim());
      }
    }
    
    // Get status and type
    const status = properties.status?.[0]?.[0] || 'Public';
    const type = properties.type?.[0]?.[0] || 'Post';
    
    console.log(`\nProcessing: ${title}`);
    
    // Fetch full page content
    const pageData = await api.getPage(id);
    
    // Extract content
    let content = '';
    let summary = '';
    
    Object.values(pageData.block).forEach((b, idx) => {
      if (b.value?.properties?.title && b.value?.type === 'text') {
        const text = b.value.properties.title
          .map(segment => segment[0])
          .join('');
        
        if (text) {
          content += text + '\n\n';
          if (idx === 0 && !summary) {
            summary = text.slice(0, 150);
          }
        }
      }
      
      // Handle headers
      if (b.value?.type?.startsWith('header')) {
        const headerText = b.value.properties?.title
          ?.map(segment => segment[0])
          .join('') || '';
        
        const level = b.value.type === 'header' ? '##' : 
                     b.value.type === 'sub_header' ? '###' : '####';
        if (headerText) {
          content += `${level} ${headerText}\n\n`;
        }
      }
      
      // Handle lists
      if (b.value?.type === 'bulleted_list') {
        const listText = b.value.properties?.title
          ?.map(segment => segment[0])
          .join('') || '';
        if (listText) {
          content += `- ${listText}\n`;
        }
      }
      
      if (b.value?.type === 'numbered_list') {
        const listText = b.value.properties?.title
          ?.map(segment => segment[0])
          .join('') || '';
        if (listText) {
          content += `1. ${listText}\n`;
        }
      }
      
      // Handle code blocks
      if (b.value?.type === 'code') {
        const codeText = b.value.properties?.title
          ?.map(segment => segment[0])
          .join('') || '';
        const language = b.value.properties?.language?.[0]?.[0] || '';
        if (codeText) {
          content += `\`\`\`${language}\n${codeText}\n\`\`\`\n\n`;
        }
      }
    });
    
    // Create filename
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]+/gi, '-')
      .replace(/^-|-$/g, '');
    
    const filename = `${date}-${slug}.md`;
    
    // Create markdown
    const markdown = `---
title: "${title}"
date: ${date}
tags: [${tags.map(t => `"${t}"`).join(', ')}]
status: "${status}"
type: "${type}"
summary: "${summary.replace(/"/g, '\\"')}"
---

# ${title}

${content.trim()}
`;
    
    // Write file
    await writeFile(`posts/${filename}`, markdown, 'utf8');
    console.log(`✓ Created ${filename}`);
    
  } catch (error) {
    console.error(`Error with post:`, error.message);
  }
}

console.log('\n✅ Migration complete!');