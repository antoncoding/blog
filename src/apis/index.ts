import { CONFIG } from "site.config"
import * as notion from "./notion-client"
import * as obsidian from "./obsidian-client"

export const getPosts = async () => {
  const notionPosts = await notion.getPosts()
  const obsidianPosts = await obsidian.getObsidianPosts()
  return [...notionPosts, ...obsidianPosts].sort((a, b) => {
    const dateA = new Date(a.date?.start_date || a.createdTime).getTime()
    const dateB = new Date(b.date?.start_date || b.createdTime).getTime()
    return dateB - dateA
  })
}

export const getRecordMap = async (id: string) => {
  // If ID doesn't look like a UUID, it's likely an Obsidian slug
  if (id.length < 32) {
    return await obsidian.getObsidianRecordMap(id)
  }
  return await notion.getRecordMap(id)
}
