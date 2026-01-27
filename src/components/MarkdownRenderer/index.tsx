import React from "react"
import ReactMarkdown from "react-markdown"
import styled from "@emotion/styled"

type Props = {
  content: string
}

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  return (
    <StyledWrapper>
      <ReactMarkdown>{content}</ReactMarkdown>
    </StyledWrapper>
  )
}

export default MarkdownRenderer

const StyledWrapper = styled.div`
  /* Markdown styles */
  h1 {
    font-size: 2rem;
    margin: 2rem 0 1rem;
    font-weight: 600;
  }

  h2 {
    font-size: 1.5rem;
    margin: 1.5rem 0 1rem;
    font-weight: 500;
  }

  h3 {
    font-size: 1.25rem;
    margin: 1.25rem 0 0.75rem;
    font-weight: 500;
  }

  p {
    margin: 1rem 0;
    line-height: 1.7;
  }

  ul, ol {
    margin: 1rem 0;
    padding-left: 2rem;
  }

  li {
    margin: 0.5rem 0;
  }

  blockquote {
    border-left: 3px solid ${({ theme }) => theme.colors.gray6};
    padding-left: 1rem;
    margin: 1.5rem 0;
    color: ${({ theme }) => theme.colors.gray11};
  }

  code {
    background: ${({ theme }) => theme.colors.gray3};
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.9em;
  }

  pre {
    background: ${({ theme }) => theme.colors.gray3};
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1.5rem 0;
    
    code {
      background: none;
      padding: 0;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
  }

  th, td {
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    padding: 0.5rem 1rem;
    text-align: left;
  }

  th {
    background: ${({ theme }) => theme.colors.gray3};
    font-weight: 600;
  }

  img {
    max-width: 100%;
    height: auto;
    margin: 1.5rem 0;
  }

  a {
    color: ${({ theme }) => theme.colors.blue11};
    text-decoration: none;
    :hover {
      text-decoration: underline;
    }
  }
`