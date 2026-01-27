import * as obsidian from "./obsidian-client"

export const getPosts = async () => {
  // Only read from local markdown files
  const posts = await obsidian.getObsidianPosts()
  
  return posts.sort((a, b) => {
    const dateA = new Date(a.date?.start_date || a.createdTime).getTime()
    const dateB = new Date(b.date?.start_date || b.createdTime).getTime()
    return dateB - dateA
  })
}

export const getRecordMap = async (id: string) => {
  // All posts are now local markdown
  return await obsidian.getObsidianRecordMap(id)
}