import React from "react"
import ReactMarkdown from "react-markdown"
import styled from "@emotion/styled"

// Preprocess content to handle Obsidian image syntax and YouTube links
const preprocessMarkdown = (content: string): string => {
  // Convert ![[image.webp]] to ![image](/api/image/image.webp)
  let processed = content.replace(/!\[\[([^\]]+)\]\]/g, (match, filename) => {
    const caption = filename.replace(/\.[^.]+$/, '');
    return `![${caption}](/api/image/${filename})`;
  });

  // Also handle relative paths from Obsidian markdown syntax
  // Convert ![](image.webp) to ![image](/api/image/image.webp)
  processed = processed.replace(/!\[\]\(([^/)]+\.(?:webp|png|jpg|jpeg|gif))\)/g, (match, filename) => {
    const caption = filename.replace(/\.[^.]+$/, '');
    return `![${caption}](/api/image/${filename})`;
  });

  // Convert YouTube links to iframes
  // Handle both https://www.youtube.com/watch?v=ID and https://youtu.be/ID
  processed = processed.replace(/https:\/\/(?:www\.)?youtu(?:\.be\/|be\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/g, (match, videoId) => {
    return `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  });

  return processed;
};

type Props = {
  content: string
}

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  const processedContent = preprocessMarkdown(content);

  return (
    <StyledWrapper>
      <ReactMarkdown>
        {processedContent}
      </ReactMarkdown>
    </StyledWrapper>
  );
};

export default MarkdownRenderer;

const StyledWrapper = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

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
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-weight: 400;
    font-size: 1rem;
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

  /* Subtle links */
  a {
    color: ${({ theme }) => theme.colors.gray10};
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.colors.gray5};
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
    transition: color 0.2s ease;
    
    :hover {
      color: ${({ theme }) => theme.colors.gray12};
      text-decoration-color: ${({ theme }) => theme.colors.gray8};
    }
  }

  /* Image styling - centered and responsive */
  img {
    display: block;
    margin: 2rem auto;
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }

  /* Paragraph containing image */
  p > img {
    margin: 2rem auto;
  }

  /* YouTube iframe styling */
  iframe {
    margin: 2rem auto;
    display: block;
    border-radius: 8px;
    max-width: 100%;
  }
`