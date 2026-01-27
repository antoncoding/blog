const fs = require('fs');
const path = require('path');
const { NotionAPI } = require('notion-client');

// Read the posts from build
const indexData = JSON.parse(fs.readFileSync('.next/server/pages/index.json', 'utf8'));
const posts = indexData.pageProps.dehydratedState.queries[0].state.data;

console.log(`Found ${posts.length} posts to migrate\n`);

const api = new NotionAPI();

async function migratePost(post) {
  try {
    const { id, title, slug, date, tags, type, status, summary, createdTime } = post;
    
    // Use date or createdTime
    const postDate = date?.start_date || createdTime.split('T')[0];
    
    // Try to get the full content
    console.log(`Migrating: ${title}`);
    
    let content = '';
    
    // Try to read from generated JSON if it exists
    const jsonPath = `.next/server/pages/${slug}.json`;
    if (fs.existsSync(jsonPath)) {
      try {
        const pageData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        const recordMap = pageData.pageProps.dehydratedState.queries[0].state.data.recordMap;
        
        // Extract text from recordMap
        if (recordMap && recordMap.block) {
          Object.values(recordMap.block).forEach(block => {
            if (block.value?.properties?.title) {
              const text = block.value.properties.title
                .map(segment => segment[0])
                .join('');
              if (text) {
                // Add appropriate formatting
                if (block.value.type === 'header') {
                  content += `\n## ${text}\n\n`;
                } else if (block.value.type === 'sub_header') {
                  content += `\n### ${text}\n\n`;
                } else if (block.value.type === 'bulleted_list') {
                  content += `- ${text}\n`;
                } else if (block.value.type === 'numbered_list') {
                  content += `1. ${text}\n`;
                } else if (block.value.type === 'code') {
                  const lang = block.value.properties?.language?.[0]?.[0] || '';
                  content += `\n\`\`\`${lang}\n${text}\n\`\`\`\n\n`;
                } else if (block.value.type === 'quote') {
                  content += `> ${text}\n\n`;
                } else if (block.value.type === 'text' || block.value.type === 'page') {
                  if (text && text !== title) {
                    content += `${text}\n\n`;
                  }
                }
              }
            }
          });
        }
      } catch (e) {
        console.log(`  Could not extract content from JSON: ${e.message}`);
      }
    }
    
    // If no content, at least use summary
    if (!content.trim() && summary) {
      content = summary;
    }
    
    // Create filename
    const filename = `${postDate}-${slug}.md`;
    
    // Create markdown
    const markdown = `---
title: "${title}"
date: ${postDate}
tags: [${(tags || []).map(t => `"${t}"`).join(', ')}]
status: "${status?.[0] || 'Public'}"
type: "${type?.[0] || 'Post'}"
summary: "${(summary || '').replace(/"/g, '\\"').slice(0, 200)}"
---

# ${title}

${content.trim() || 'Content needs to be migrated manually from Notion.'}
`;
    
    // Write file
    const filePath = path.join('posts', filename);
    fs.writeFileSync(filePath, markdown, 'utf8');
    console.log(`  ✓ Created ${filename}`);
    
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
  }
}

// Migrate all posts
async function migrateAll() {
  for (const post of posts) {
    await migratePost(post);
  }
  console.log('\n✅ Migration complete!');
}

migrateAll();