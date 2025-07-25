import React from "react"
import styled from "@emotion/styled"
import { MdViewCompact } from 'react-icons/md';
import { LuGalleryThumbnails } from "react-icons/lu";


type Props = {
  displayMode: 'default' | 'compact',
  onToggleDisplayMode: () => void
}

const FeedHeader: React.FC<Props> = ({ displayMode, onToggleDisplayMode }) => {
  return (
    <StyledWrapper>
      <div className="header-row">
        <span className="spacer" />
        <button
          className="icon-btn"
          aria-label="Toggle view mode"
          onClick={onToggleDisplayMode}
          style={{ background: 'none', border: 'none', width: 32, height: 32, cursor: 'pointer' }}
        >
          {displayMode === 'default' ? <MdViewCompact size={24} /> : <LuGalleryThumbnails size={24} />}
        </button>
      </div>
      <div className="divider" />
    </StyledWrapper>
  )
}

export default FeedHeader

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  .header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.25rem 0 0.75rem 0;
  }
  .spacer {
    flex: 1;
  }
  .icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
  }
  .divider {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};
    width: 100%;
  }
`
