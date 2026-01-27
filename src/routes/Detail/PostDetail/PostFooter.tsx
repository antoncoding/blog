import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { CONFIG } from "site.config"
import usePostQuery from "src/hooks/usePostQuery"

type Props = {}

const Footer: React.FC<Props> = () => {
  const router = useRouter()
  const post = usePostQuery()
  const [copied, setCopied] = useState(false)

  if (!post) return null

  const url = `${CONFIG.link}/${post.slug}`

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <StyledWrapper>
      <div className="actions">
        <a onClick={copyLink} className="copy-link">
          {copied ? "✓ Copied!" : "Copy Link"}
        </a>
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

  .actions {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;

    .copy-link {
      padding: 0.5rem 1rem;
      background: ${({ theme }) => theme.colors.gray3};
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;

      :hover {
        background: ${({ theme }) => theme.colors.gray4};
      }
    }
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