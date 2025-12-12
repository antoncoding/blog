import React from "react"
import styled from "@emotion/styled"

type Props = {}

const FeedHeader: React.FC<Props> = () => {
  return (
    <StyledWrapper>
      <h1 className="title">安安冬冬</h1>
      <p className="tagline">言，心聲也；書，心畫也</p>
      <p className="categories">技術 • 生活</p>
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
    margin-bottom: 0.5rem;
    font-style: italic;
    letter-spacing: 0.1em;
  }

  .categories {
    font-size: 0.875rem;
    font-weight: 300;
    color: ${({ theme }) => theme.colors.gray11};
    letter-spacing: 0.1em;
  }
`
