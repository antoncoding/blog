import Image from "next/image"
import styled from "@emotion/styled"
import { CSSProperties } from "react"

interface PostImageProps {
  src: string
  alt?: string
  width?: number
  height?: string | number
  centered?: boolean
  caption?: string
}

const PostImage: React.FC<PostImageProps> = ({
  src,
  alt = "Image",
  width = 600,
  height = "auto",
  centered = true,
  caption,
}) => {
  return (
    <StyledWrapper $centered={centered}>
      <div className="image-container">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={typeof height === "number" ? height : 400}
          style={{ width: "100%", height: "auto" }}
        />
        {caption && <p className="caption">{caption}</p>}
      </div>
    </StyledWrapper>
  )
}

export default PostImage

const StyledWrapper = styled.div<{ $centered: boolean }>`
  margin: 2rem 0;
  display: flex;
  justify-content: ${(props) => (props.$centered ? "center" : "flex-start")};

  .image-container {
    width: 100%;
    max-width: 600px;
  }

  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .caption {
    text-align: center;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.gray11};
    margin-top: 0.5rem;
  }
`