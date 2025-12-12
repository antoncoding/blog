import { CONFIG } from "site.config"
import { TPost } from "src/types"
import { formatDate } from "src/libs/utils"
import React from "react"
import styled from "@emotion/styled"
import Image from "next/image"

type Props = {
  data: TPost
}

const PostHeader: React.FC<Props> = ({ data }) => {
  return (
    <StyledWrapper>
      <h1 className="title">{data.title}</h1>
      <div className="meta">
        <time className="date">
          {formatDate(
            data?.date?.start_date || data.createdTime,
            CONFIG.lang
          )}
        </time>
      </div>
      {data.thumbnail && (
        <div className="thumbnail">
          <Image
            src={data.thumbnail}
            fill
            alt={data.title}
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
    </StyledWrapper>
  )
}

export default PostHeader

const StyledWrapper = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};

  .title {
    font-size: 1.75rem;
    line-height: 1.4;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.gray12};
    margin-bottom: 1rem;
  }

  .meta {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1.5rem;

    .date {
      font-size: 0.875rem;
      color: ${({ theme }) => theme.colors.gray11};
    }
  }

  .thumbnail {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    overflow: hidden;
    border-radius: 0.5rem;
  }
`
