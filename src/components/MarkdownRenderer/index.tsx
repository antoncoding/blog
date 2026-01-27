import React, { useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import styled from "@emotion/styled"

// Preprocess content to handle Obsidian images, YouTube URLs, and X/Twitter URLs
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

  // Convert bare YouTube URLs to markdown links
  // Match both https://www.youtube.com/watch?v=ID and https://youtu.be/ID
  processed = processed.replace(/(?<![\[\(])https:\/\/(?:www\.)?youtu(?:\.be\/|be\.com\/watch\?v=)([a-zA-Z0-9_-]{11})(?![\]\)])/g, 
    (match, videoId) => {
      return `[YouTube Video](https://www.youtube.com/watch?v=${videoId})`;
    }
  );

  // Convert bare X/Twitter URLs to markdown links
  // Match https://twitter.com/user/status/ID and https://x.com/user/status/ID
  processed = processed.replace(/(?<![\[\(])https:\/\/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)[^\s)]*(?![\]\)])/g,
    (match, tweetId) => {
      return `[Tweet](https://x.com/i/status/${tweetId})`;
    }
  );

  return processed;
};

type Props = {
  content: string
}

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  const processedContent = preprocessMarkdown(content);

  // Custom link component that handles YouTube links
  const LinkComponent = ({ href, children }: any) => {
    if (!href) return <>{children}</>;
    
    // Check if it's a YouTube link
    const youtubeMatch = href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      return <YouTubeEmbed videoId={videoId} />;
    }

    // Check if it's an X/Twitter link
    const tweetMatch = href.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);

    if (tweetMatch) {
      const tweetId = tweetMatch[1];
      return <TweetEmbed tweetId={tweetId} />;
    }
    
    return <a href={href}>{children}</a>;
  };

  return (
    <StyledWrapper>
      <ReactMarkdown
        components={{
          a: LinkComponent,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </StyledWrapper>
  );
};

const YouTubeEmbed: React.FC<{ videoId: string }> = ({ videoId }) => (
  <div style={{ margin: '2rem 0', display: 'flex', justifyContent: 'center' }}>
    <iframe
      width="100%"
      height="400"
      src={`https://www.youtube.com/embed/${videoId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      style={{ maxWidth: '100%', borderRadius: '8px' }}
    />
  </div>
);

const TweetEmbed: React.FC<{ tweetId: string }> = ({ tweetId }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderTweet = () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        (window as any).twttr.widgets.createTweet(tweetId, containerRef.current, {
          align: 'center',
          conversation: 'none',
        });
      }
    };

    if ((window as any).twttr?.widgets) {
      renderTweet();
    } else {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.onload = renderTweet;
      document.body.appendChild(script);
    }
  }, [tweetId]);

  return (
    <div style={{ margin: '2rem 0', display: 'flex', justifyContent: 'center' }}>
      <div ref={containerRef} style={{ maxWidth: 550, width: '100%' }} />
    </div>
  );
};

export default MarkdownRenderer;

const StyledWrapper = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  h1 {
    font-size: 2rem;
    margin: 2rem 0 1rem;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  h2 {
    font-size: 1.5rem;
    margin: 1.5rem 0 1rem;
    font-weight: 500;
    letter-spacing: -0.01em;
  }

  h3 {
    font-size: 1.25rem;
    margin: 1.25rem 0 0.75rem;
    font-weight: 500;
  }

  p {
    margin: 1rem 0;
    line-height: 1.8;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-weight: 400;
    font-size: 1rem;
    letter-spacing: 0.3px;
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
    cursor: pointer;
    
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
`