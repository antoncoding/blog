import Link from "next/link"
import { CONFIG } from "site.config"
import { formatDate } from "src/libs/utils"
import Tag from "../../../components/Tag"
import { TPost } from "../../../types"
import Image from "next/image"
import Category from "../../../components/Category"
import styled from "@emotion/styled"

type Props = {
  data: TPost
  displayMode: 'default' | 'compact'
}

const PostCard: React.FC<Props> = ({ data, displayMode }) => {
  const category = (data.category && data.category?.[0]) || undefined

  if (displayMode === 'compact') {
    return (
      <StyledWrapper href={`/${data.slug}`} displayMode={displayMode}>
        <article className="compact-row">
          <div
            data-thumb={!!data.thumbnail}
            data-category={!!category}
            className="content"
            style={{ padding: '0.5rem 1rem', flex: 1, maxWidth: '600px', minWidth: 0 }}
          >
            <header className="top">
              <h2 style={{ fontSize: '1rem', marginBottom: 0 }}>{data.title}</h2>
            </header>
            <div className="date" style={{ fontSize: '0.875rem', color: '#888', margin: '0.25rem 0' }}>
              {formatDate(
                data?.date?.start_date || data.createdTime,
                CONFIG.lang
              )}
            </div>
            <div className="tags">
              {data.tags &&
                data.tags.map((tag: string, idx: number) => (
                  <Tag key={idx}>{tag}</Tag>
                ))}
            </div>
          </div>
          {data.thumbnail ? (
            <div
              className="thumbnail"
              style={{
                borderTopRightRadius: '0.375rem',
                borderBottomRightRadius: '0.375rem',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                overflow: 'hidden',
                width: '160px',
                height: '120px',
                minWidth: '160px',
                minHeight: '120px',
                maxWidth: '160px',
                maxHeight: '120px',
                marginLeft: '1rem',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#eee',
              }}
            >
              <Image
                src={data.thumbnail}
                alt={data.title}
                width={160}
                height={120}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          ) : (
            <div
              className="thumbnail-placeholder"
              style={{
                borderTopRightRadius: '0.375rem',
                borderBottomRightRadius: '0.375rem',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                width: '160px',
                height: '120px',
                minWidth: '160px',
                minHeight: '120px',
                maxWidth: '160px',
                maxHeight: '120px',
                marginLeft: '1rem',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#eee',
                color: '#bbb',
                fontSize: '2rem',
              }}
            >
              {/* Optionally, you can put an icon or leave it blank */}
            </div>
          )}
        </article>
      </StyledWrapper>
    )
  }

  return (
    <StyledWrapper href={`/${data.slug}`} displayMode={displayMode}>
      <article>
        {category && (
          <div className="category">
            <Category>{category}</Category>
          </div>
        )}
        {data.thumbnail && (
          <div
            className="thumbnail"
            style={{
              borderRadius: '0.375rem',
              overflow: 'hidden',
              height: undefined,
              minHeight: undefined,
              maxHeight: undefined,
            }}
          >
            <Image
              src={data.thumbnail}
              fill
              alt={data.title}
              css={{ objectFit: 'cover' }}
            />
          </div>
        )}
        <div
          data-thumb={!!data.thumbnail}
          data-category={!!category}
          className="content"
        >
          <header className="top">
            <h2>{data.title}</h2>
          </header>
          <div className="date">
            <div className="content">
              {formatDate(
                data?.date?.start_date || data.createdTime,
                CONFIG.lang
              )}
            </div>
          </div>
          <div className="summary">
            <p>{data.summary}</p>
          </div>
          <div className="tags">
            {data.tags &&
              data.tags.map((tag: string, idx: number) => (
                <Tag key={idx}>{tag}</Tag>
              ))}
          </div>
        </div>
      </article>
    </StyledWrapper>
  )
}

export default PostCard

const StyledWrapper = styled(Link)<{ displayMode: 'default' | 'compact' }>`
  article {
    overflow: hidden;
    position: relative;
    margin-bottom: 1.5rem;
    border-radius: 0.375rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "white" : theme.colors.gray4};
    transition-property: box-shadow;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;

    @media (min-width: 768px) {
      margin-bottom: 2rem;
    }

    :hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    > .category {
      position: absolute;
      top: 1rem;
      left: 1rem;
      z-index: 10;
    }
    > .thumbnail {
      position: relative;
      width: 100%;
      background-color: ${({ theme }) => theme.colors.gray2};
      padding-bottom: ${({ displayMode }) => displayMode === 'compact' ? '0' : '66%'};
      height: ${({ displayMode }) => displayMode === 'compact' ? '220px' : 'auto'};
      min-height: ${({ displayMode }) => displayMode === 'compact' ? '220px' : 'auto'};
      max-height: ${({ displayMode }) => displayMode === 'compact' ? '220px' : 'none'};
      @media (min-width: 1024px) {
        padding-bottom: ${({ displayMode }) => displayMode === 'compact' ? '0' : '50%'};
      }
    }
    > .content {
      padding: 1rem;

      &[data-thumb="false"] {
        padding-top: 3.5rem;
      }
      &[data-category="false"] {
        padding-top: 1.5rem;
      }
      > .top {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        @media (min-width: 768px) {
          flex-direction: row;
          align-items: baseline;
        }
        h2 {
          margin-bottom: 0.5rem;
          font-size: 1.125rem;
          line-height: 1.75rem;
          font-weight: 500;

          cursor: pointer;

          @media (min-width: 768px) {
            font-size: 1.25rem;
            line-height: 1.75rem;
          }
        }
      }
      > .date {
        display: flex;
        margin-bottom: 1rem;
        gap: 0.5rem;
        align-items: center;
        .content {
          font-size: 0.875rem;
          line-height: 1.25rem;
          color: ${({ theme }) => theme.colors.gray10};
          @media (min-width: 768px) {
            margin-left: 0;
          }
        }
      }
      > .summary {
        margin-bottom: 1rem;
        p {
          display: none;
          line-height: 2rem;
          color: ${({ theme }) => theme.colors.gray11};

          @media (min-width: 768px) {
            display: block;
          }
        }
      }
      > .tags {
        display: flex;
        gap: 0.5rem;
      }
    }
  }
  article.compact-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 1.5rem;
    border-radius: 0.375rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "white" : theme.colors.gray4};
    transition-property: box-shadow;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
    max-width: 800px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    :hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
  }
`