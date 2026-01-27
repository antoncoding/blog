import { TPost } from "src/types"

interface GitHubFile {
  name: string
  path: string
  download_url: string
}

interface FrontMatter {
  title?: string
  date?: string
  tags?: string[]
  category?: string[]
  summary?: string
  status?: string
  type?: string
  thumbnail?: string
}

// Parse frontmatter from markdown content
const parseFrontmatter = (content: string): { data: FrontMatter, content: string } => {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { data: {}, content }
  }

  const frontmatterString = match[1]
  const mainContent = match[2]
  const data: FrontMatter = {}

  // Simple YAML parsing
  frontmatterString.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) return
    
    const key = line.substring(0, colonIndex).trim()
    let value = line.substring(colonIndex + 1).trim()
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    
    // Parse arrays (simple format)
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1)
      const items = value.split(',').map(item => 
        item.trim().replace(/^["']|["']$/g, '')
      )
      data[key as keyof FrontMatter] = items as any
    } else {
      data[key as keyof FrontMatter] = value as any
    }
  })

  return { data, content: mainContent }
}

export const fetchGitHubPosts = async (): Promise<TPost[]> => {
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO  
  const path = process.env.GITHUB_PATH || ""

  if (!owner || !repo) {
    return []
  }

  try {
    // Fetch list of files
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: process.env.GITHUB_TOKEN ? {
          Authorization: `token ${process.env.GITHUB_TOKEN}`
        } : {}
      }
    )
    
    if (!response.ok) {
      console.error(`GitHub API error: ${response.status}`)
      return []
    }

    const files: GitHubFile[] = await response.json()
    
    // Filter for markdown files
    const mdFiles = files.filter(file => file.name.endsWith('.md'))
    
    // Fetch content of each markdown file
    const posts = await Promise.all(mdFiles.map(async (file) => {
      const contentResponse = await fetch(file.download_url)
      const rawContent = await contentResponse.text()
      const { data, content } = parseFrontmatter(rawContent)
      
      const slug = file.name.replace(/\.md$/, '')
      const date = data.date ? new Date(data.date).toISOString() : new Date().toISOString()

      return {
        id: slug,
        slug: slug,
        title: data.title || slug,
        date: { start_date: date.split("T")[0] },
        type: [data.type || "Post"] as any,
        status: [data.status || "Public"] as any,
        tags: data.tags || [],
        category: data.category || [],
        summary: data.summary || content.slice(0, 100),
        createdTime: date,
        fullWidth: false,
        thumbnail: data.thumbnail || null,
      } as TPost
    }))

    return posts
  } catch (error) {
    console.error("Error fetching GitHub posts:", error)
    return []
  }
}

export const getGitHubRecordMap = async (slug: string): Promise<string> => {
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const path = process.env.GITHUB_PATH || ""

  if (!owner || !repo) {
    return ""
  }

  try {
    const filePath = path ? `${path}/${slug}.md` : `${slug}.md`
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        headers: process.env.GITHUB_TOKEN ? {
          Authorization: `token ${process.env.GITHUB_TOKEN}`
        } : {}
      }
    )

    if (!response.ok) {
      return ""
    }

    const data = await response.json()
    const contentResponse = await fetch(data.download_url)
    const rawContent = await contentResponse.text()
    const { content } = parseFrontmatter(rawContent)
    
    return content
  } catch (error) {
    console.error("Error fetching GitHub content:", error)
    return ""
  }
}