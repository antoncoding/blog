import React from "react"
import PostHeader from "./PostHeader"
import Footer from "./PostFooter"
import CommentBox from "./CommentBox"
import styled from "@emotion/styled"
import NotionRenderer from "../components/NotionRenderer"
import MarkdownRenderer from "src/components/MarkdownRenderer"
import usePostQuery from "src/hooks/usePostQuery"

type Props = {}

const PostDetail: React.FC<Props> = () => {
  const data = usePostQuery()

  if (!data) return null

  const isObsidian = typeof data.recordMap === "string"

  return (
    <StyledWrapper>
      <article>
        {data.type[0] === "Post" && <PostHeader data={data} />}
        <div className="content">
          {isObsidian ? (
            <MarkdownRenderer content={data.recordMap as unknown as string} />
          ) : (
            <NotionRenderer recordMap={data.recordMap} />
          )}
        </div>
        {data.type[0] === "Post" && (
          <>
            <Footer />
            <CommentBox data={data} />
          </>
        )}
      </article>
    </StyledWrapper>
  )
}

export default PostDetail

const StyledWrapper = styled.div`
  padding: 3rem 1.5rem;
  margin: 0 auto;
  max-width: 720px;

  > article {
    .content {
      margin-top: 2rem;
      line-height: 1.8;
    }
  }
`