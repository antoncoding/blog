import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share"
import { CONFIG } from "site.config"
import usePostQuery from "src/hooks/usePostQuery"

type Props = {}

const Footer: React.FC<Props> = () => {
  const router = useRouter()
  const post = usePostQuery()
  if (!post) return null

  const url = `${CONFIG.link}/${post.slug}`

  return (
    <StyledWrapper>
      <div className="share">
        <TwitterShareButton url={url} title={post.title}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <FacebookShareButton url={url} quote={post.title}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <LinkedinShareButton url={url} title={post.title}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      </div>
      <div className="nav">
        <a onClick={() => router.push("/")}>← Back</a>
        <a onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          ↑ Top
        </a>
      </div>
    </StyledWrapper>
  )
}

export default Footer

const StyledWrapper = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray6};

  .share {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    justify-content: center;
  }

  .nav {
    display: flex;
    justify-content: space-between;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray10};
    a {
      cursor: pointer;
      :hover {
        color: ${({ theme }) => theme.colors.gray12};
      }
    }
  }
`
