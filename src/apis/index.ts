import { CONFIG } from "site.config"
import * as notion from "./notion-client"
import * as obsidian from "./obsidian-client"
import * as github from "./github-fetch"

export const getPosts = async () => {
  const notionPosts = await notion.getPosts()
  const obsidianPosts = await obsidian.getObsidianPosts()
  const githubPosts = await github.fetchGitHubPosts()
  
  return [...notionPosts, ...obsidianPosts, ...githubPosts].sort((a, b) => {
    const dateA = new Date(a.date?.start_date || a.createdTime).getTime()
    const dateB = new Date(b.date?.start_date || b.createdTime).getTime()
    return dateB - dateA
  })
}

export const getRecordMap = async (id: string) => {
  // If ID doesn't look like a UUID, it might be a slug
  if (id.length < 32) {
    // Try GitHub first
    const githubContent = await github.getGitHubRecordMap(id)
    if (githubContent) return githubContent
    
    // Then try local Obsidian
    return await obsidian.getObsidianRecordMap(id)
  }
  return await notion.getRecordMap(id)
}