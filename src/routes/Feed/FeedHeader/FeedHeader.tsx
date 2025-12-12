import React from "react"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"
import { useRouter } from "next/router"
import Link from "next/link"

type Props = {}

const FeedHeader: React.FC<Props> = () => {
  const router = useRouter()
  const currentFilter = router.query.filter as string | undefined

  return (
    <StyledWrapper>
      <h1 className="title">安安冬冬</h1>
      <p className="tagline">言，心聲也；書，心畫也</p>
      <nav className="nav">
        <Link
          href="/"
          className={!currentFilter ? "active" : ""}
        >
          全部
        </Link>
        <span className="separator">•</span>
        <Link
          href="/?filter=work"
          className={currentFilter === "work" ? "active" : ""}
        >
          技術
        </Link>
        <span className="separator">•</span>
        <Link
          href="/?filter=life"
          className={currentFilter === "life" ? "active" : ""}
        >
          生活
        </Link>
      </nav>
    </StyledWrapper>
  )
}

export default FeedHeader

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;
  text-align: center;

  .title {
    font-size: 2rem;
    font-weight: 400;
    margin-bottom: 0.75rem;
    color: ${({ theme }) => theme.colors.gray12};
    letter-spacing: 0.05em;
  }

  .tagline {
    font-size: 0.875rem;
    font-weight: 300;
    color: ${({ theme }) => theme.colors.gray11};
    margin-bottom: 1.5rem;
    font-style: italic;
    letter-spacing: 0.1em;
  }

  .nav {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    font-size: 1rem;

    a {
      color: ${({ theme }) => theme.colors.gray11};
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${({ theme }) => theme.colors.gray12};
      }

      &.active {
        color: ${({ theme }) => theme.colors.gray12};
        font-weight: 500;
      }
    }

    .separator {
      color: ${({ theme }) => theme.colors.gray9};
      font-size: 0.875rem;
    }
  }
`
