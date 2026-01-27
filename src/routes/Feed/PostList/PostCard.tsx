import Link from "next/link"
import { CONFIG } from "site.config"
import { TPost } from "../../../types"
import styled from "@emotion/styled"

type Props = {
  data: TPost
}

const PostCard: React.FC<Props> = ({ data }) => {
  const date = new Date(data?.date?.start_date || data.createdTime)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const formattedDate = `${month}月${day}日`

  return (
    <StyledWrapper href={`/${data.slug}`}>
      <time className="date">
        {formattedDate}
      </time>
      <h2 className="title">{data.title}</h2>
    </StyledWrapper>
  )
}

export default PostCard

const StyledWrapper = styled(Link)`
  display: flex;
  gap: 1.5rem;
  align-items: baseline;
  padding: 0.5rem 0;
  text-decoration: none;
  transition: opacity 0.2s;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  &:hover {
    opacity: 0.6;
  }

  .date {
    flex-shrink: 0;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.gray11};
    min-width: 80px;
    font-weight: 400;
  }

  .title {
    font-size: 1rem;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.gray12};
    margin: 0;
    line-height: 1.6;
    letter-spacing: 0.3px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.25rem;
    align-items: flex-start;
  }
`