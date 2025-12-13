import NavBar from "./NavBar"
import Logo from "./Logo"
import ThemeToggle from "./ThemeToggle"
import styled from "@emotion/styled"
import { zIndexes } from "src/styles/zIndexes"
import { useRouter } from "next/router"
import Link from "next/link"

type Props = {
  fullWidth: boolean
}

const Header: React.FC<Props> = ({ fullWidth }) => {
  const router = useRouter()
  const isHomePage = router.pathname === "/"

  return (
    <StyledWrapper>
      <div data-full-width={fullWidth} className="container">
        <div className="left-section">
          {isHomePage ? (
            <Logo />
          ) : (
            <Link href="/" className="home-link">
              Home
            </Link>
          )}
        </div>
        <div className="nav">
          <ThemeToggle />
          <NavBar />
        </div>
      </div>
    </StyledWrapper>
  )
}

export default Header

const StyledWrapper = styled.div`
  z-index: ${zIndexes.header};
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.gray2};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  .container {
    display: flex;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 720px;
    height: 3rem;
    margin: 0 auto;
    &[data-full-width="true"] {
      @media (min-width: 768px) {
        padding-left: 6rem;
        padding-right: 6rem;
      }
    }
    .left-section {
      display: flex;
      align-items: center;
      gap: 1rem;

      .home-link {
        font-size: 0.875rem;
        color: ${({ theme }) => theme.colors.gray11};
        text-decoration: none;
        transition: color 0.2s ease;

        &:hover {
          color: ${({ theme }) => theme.colors.gray12};
        }
      }
    }
    .nav {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
  }
`
