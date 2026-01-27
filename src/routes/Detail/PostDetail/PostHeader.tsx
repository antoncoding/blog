import { CONFIG } from "site.config"
import { TPost } from "src/types"
import { formatDate } from "src/libs/utils"
import React, { useState } from "react"
import styled from "@emotion/styled"
import Image from "next/image"
import Tag from "src/components/Tag"

type Props = {
  data: TPost
}

const PostHeader: React.FC<Props> = ({ data }) => {
  const [copied, setCopied] = useState(false)
  
  const copyLink = () => {
    const url = `${CONFIG.link}/${data.slug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <StyledWrapper>
      <button className="share-btn" onClick={copyLink}>
        {copied ? "✓ copied" : "share"}
      </button>
      <h1 className="title">{data.title}</h1>
      <div className="meta">
        <time className="date">
          {formatDate(
            data?.date?.start_date || data.createdTime,
            CONFIG.lang
          )}
        </time>
        {data.tags && data.tags.length > 0 && (
          <>
            {data.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </>
        )}
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
  position: relative;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};

  .share-btn {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.25rem 0.75rem;
    background: transparent;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.gray11};
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;

    :hover {
      border-color: ${({ theme }) => theme.colors.gray8};
      color: ${({ theme }) => theme.colors.gray12};
    }
  }

  .title {
    font-size: 1.75rem;
    line-height: 1.4;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.gray12};
    margin-bottom: 1rem;
    padding-right: 5rem; /* Space for share button */
  }

  .meta {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
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