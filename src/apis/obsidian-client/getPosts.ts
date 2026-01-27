import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { TPost } from "src/types"

const postsDirectory = path.join(process.cwd(), "posts")

export const getObsidianPosts = async (): Promise<TPost[]> => {
  if (!fs.existsSync(postsDirectory)) return []
  
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "")
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)

      const date = data.date ? new Date(data.date).toISOString() : new Date().toISOString()

      return {
        id: slug,
        slug: slug,
        title: data.title || slug,
        date: { start_date: date.split("T")[0] },
        type: [data.type || "Post"],
        status: [data.status || "Public"],
        tags: data.tags || [],
        category: data.category || [],
        summary: data.summary || content.slice(0, 100),
        createdTime: date,
        fullWidth: data.fullWidth || false,
        thumbnail: data.thumbnail || null,
      } as TPost
    })

  return allPostsData.sort((a, b) => {
    const dateA = new Date(a.date.start_date).getTime()
    const dateB = new Date(b.date.start_date).getTime()
    return dateB - dateA
  })
}

export const getObsidianRecordMap = async (slug: string) => {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { content } = matter(fileContents)
  return content
}
