import { CONFIG } from "site.config"
import React from "react"
import styled from "@emotion/styled"

const d = new Date()
const y = d.getFullYear()
const from = +CONFIG.since

type Props = {
  className?: string
}

const Footer: React.FC<Props> = ({ className }) => {
  return (
    <StyledWrapper className={className}>
      <div className="links">
        <a
          href={`https://github.com/${CONFIG.profile.github}`}
          target="_blank"
          rel="noreferrer"
        >
          © {CONFIG.profile.name} {from === y || !from ? y : `${from} - ${y}`}
        </a>
        <a href="/rss.xml" target="_blank" rel="noreferrer">
          RSS
        </a>
      </div>
    </StyledWrapper>
  )
}

export default Footer

const StyledWrapper = styled.div`
  margin-top: 2rem;
  .links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    a {
      font-size: 0.875rem;
      line-height: 1.25rem;
      color: ${({ theme }) => theme.colors.gray10};
      text-decoration: none;
      :hover {
        text-decoration: underline;
      }
    }
  }
`
