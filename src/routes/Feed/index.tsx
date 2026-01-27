import { useState } from "react"
import styled from "@emotion/styled"
import PostList from "./PostList"
import { FeedHeader } from "./FeedHeader"

type Props = {}

const Feed: React.FC<Props> = () => {
  const [q, setQ] = useState("")

  return (
    <StyledWrapper>
      <div className="content">
        <FeedHeader />
        <PostList q={q} />
      </div>
    </StyledWrapper>
  )
}

export default Feed

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
  min-height: calc(100vh - 73px);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;

  > .content {
    width: 100%;
    max-width: 800px;
  }
`