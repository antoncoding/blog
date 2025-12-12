import React, { useEffect, useState } from "react"
import PostCard from "src/routes/Feed/PostList/PostCard"
import usePostsQuery from "src/hooks/usePostsQuery"
import styled from "@emotion/styled"
import { TPost } from "src/types"

type Props = {
  q: string
}

const PostList: React.FC<Props> = ({ q }) => {
  const data = usePostsQuery()
  const [filteredPosts, setFilteredPosts] = useState(data)

  useEffect(() => {
    setFilteredPosts(() => {
      let newFilteredPosts = data

      // keyword search only
      newFilteredPosts = newFilteredPosts.filter((post) => {
        const tagContent = post.tags ? post.tags.join(" ") : ""
        const searchContent = post.title + post.summary + tagContent
        return searchContent.toLowerCase().includes(q.toLowerCase())
      })

      return newFilteredPosts
    })
  }, [q, data])

  // Group posts by year
  const postsByYear = filteredPosts.reduce((acc, post) => {
    const date = post?.date?.start_date || post.createdTime
    const year = new Date(date).getFullYear()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(post)
    return acc
  }, {} as Record<number, TPost[]>)

  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a))

  return (
    <StyledWrapper>
      {!filteredPosts.length && (
        <p className="empty-message">Nothing! 😺</p>
      )}
      {years.map((year) => (
        <section key={year} className="year-section">
          <h2 className="year-title">{year} 年</h2>
          <div className="posts">
            {postsByYear[Number(year)].map((post) => (
              <PostCard key={post.id} data={post} />
            ))}
          </div>
        </section>
      ))}
    </StyledWrapper>
  )
}

export default PostList

const StyledWrapper = styled.div`
  .empty-message {
    text-align: center;
    color: ${({ theme }) => theme.colors.gray10};
    padding: 2rem 0;
  }

  .year-section {
    margin-bottom: 3rem;
  }

  .year-title {
    font-size: 1.25rem;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.gray11};
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};
  }

  .posts {
    display: flex;
    flex-direction: column;
  }
`
