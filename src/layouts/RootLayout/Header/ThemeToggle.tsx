import styled from "@emotion/styled"
import React from "react"
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5"
import useScheme from "src/hooks/useScheme"

type Props = {}

const ThemeToggle: React.FC<Props> = () => {
  const [scheme, setScheme] = useScheme()

  const handleClick = () => {
    setScheme(scheme === "light" ? "dark" : "light")
  }

  return (
    <StyledWrapper onClick={handleClick}>
      {scheme === "light" ? <IoSunnyOutline size={20} /> : <IoMoonOutline size={20} />}
    </StyledWrapper>
  )
}

export default ThemeToggle

const StyledWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray11};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.gray12};
  }
`
