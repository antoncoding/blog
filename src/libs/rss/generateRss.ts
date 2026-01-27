import RSS from "rss"
import fs from "fs"
import { CONFIG } from "site.config"
import { TPosts } from "src/types"

export default function generateRss(posts: TPosts) {
  const feed = new RSS({
    title: CONFIG.blog.title,
    description: CONFIG.blog.description,
    feed_url: `${CONFIG.link}/rss.xml`,
    site_url: CONFIG.link,
    language: CONFIG.lang,
  })

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.summary || "",
      url: `${CONFIG.link}/${post.slug}`,
      date: post.date?.start_date || post.createdTime,
    })
  })

  fs.writeFileSync("./public/rss.xml", feed.xml({ indent: true }))
}
