const { NotionAPI } = require('notion-client');
const { getPageProperties, filterPosts } = require('./src/libs/utils/notion');
const fs = require('fs').promises;
const path = require('path');

async function migrateNotionPosts() {
  const api = new NotionAPI();
  const pageId = '7016071ebbbc4574b2f064f708a6545e';
  
  console.log('Fetching Notion posts...');
  
  const response = await api.getPage(pageId);
  const collection = Object.values(response.collection)[0]?.value;
  const block = response.block;
  const schema = collection?.schema;
  
  // Get all page IDs
  const pageIds = [];
  Object.keys(block).forEach(id => {
    if (block[id].value?.type === 'page' && block[id].value?.properties) {
      pageIds.push(id);
    }
  });
  
  console.log(`Found ${pageIds.length} posts`);
  
  // Process each post
  for (const id of pageIds) {
    try {
      const properties = block[id].value?.properties || {};
      
      // Extract title
      const title = properties.title?.[0]?.[0] || 'Untitled';
      
      // Extract other properties
      const date = properties.date?.start_date || 
                   new Date(block[id].value.created_time).toISOString().split('T')[0];
      
      const tags = properties.tags?.[0]?.[0]?.split(',').map(t => t.trim()) || [];
      const status = properties.status?.[0]?.[0] || 'Public';
      const type = properties.type?.[0]?.[0] || 'Post';
      
      // Get full content
      console.log(`Processing: ${title}`);
      const pageData = await api.getPage(id);
      
      // Extract text content from blocks
      let content = '';
      Object.values(pageData.block).forEach(b => {
        if (b.value?.properties?.title) {
          const text = b.value.properties.title
            .map(t => t[0])
            .join('');
          if (text) content += text + '\n\n';
        }
      });
      
      // Create filename
      const dateStr = new Date(date).toISOString().split('T')[0];
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fff]+/gi, '-')
        .replace(/^-|-$/g, '');
      const filename = `${dateStr}-${slug}.md`;
      
      // Create markdown content
      const markdown = `---
title: "${title}"
date: ${date}
tags: [${tags.map(t => `"${t}"`).join(', ')}]
status: "${status}"
type: "${type}"
---

${content}`;
      
      // Write file
      const filePath = path.join('posts', filename);
      await fs.writeFile(filePath, markdown);
      console.log(`✓ Created ${filename}`);
      
    } catch (error) {
      console.error(`Error processing post ${id}:`, error.message);
    }
  }
  
  console.log('Migration complete!');
}

migrateNotionPosts().catch(console.error);