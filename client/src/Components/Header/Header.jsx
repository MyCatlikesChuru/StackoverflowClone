//페이지, 리액트 컴포넌트, 정적 파일
import SearchBarIcon from "../../icons/Search.svg";
import Logo from "../../icons/Logo.svg";
import MobileLogo from "../../icons/LogoGlyphXSm.svg";
import MobileMenuIcon from "../../icons/Hamburger.svg";
import MobileSearchBarIcon from "../../icons/MobileSearch.svg";
import SearchPopUp from "./SearchPopUp";
import MobileLeftNav from "./MobileLeftNav";
import MobileSearchPopUp from "./MobileSearchBarAndPopUp";

//로컬 모듈
import { useLeftNavStore, useSearchPopUpStore, useMobileSearchPopUpStore } from "../../store/store";
import { useIsLoginStore } from "../../store/loginstore";
import BREAKPOINT from "../../breakpoint";

//라이브러리 및 라이브러리 메소드
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components/macro";

const HeaderComponent = styled.header`
  height: 50px;
  width: 100vw;
  display: flex;
  position: sticky;
  top: 0;
  left: 0;
  align-items: center;
  box-sizing: border-box;
  background-color: rgb(248, 249, 249);
  border-top: 3px solid rgb(244, 130, 36);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 4px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 999;

  @media screen and (max-width: ${BREAKPOINT.BREAKPOINTMOBILE}px) {
    padding-right: 4%;
  }
`;

const HeaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  @media screen and (max-width: ${BREAKPOINT.BREAKPOINTMOBILE}px) {
    justify-content: space-between;
  }
`;

const ButtonArea = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  > button {
    cursor: pointer;
  }

  @media screen and (max-width: ${BREAKPOINT.BREAKPOINTMOBILE}px) {
    width: auto;
  }
`;

const HomeButton = styled.button`
  all: unset;
  width: 166px;
  height: 100%;
  padding: 8px;
  box-sizing: border-box;

  &:hover {
    background-color: rgb(228, 230, 232);
  }
  @media screen and (max-width: ${BREAKPOINT.BREAKPOINTMOBILE}px) {
    display: none;
  }
`;

const MobileLeftButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;

  > button {
    cursor: pointer;
  }

  @media screen and (min-width: ${BREAKPOINT.BREAKPOINTMOBILE}px) {
    display: none;
  }
`;

const MobileHomeButton = styled.button`
  all: unset;
  height: 47px;
  width: 47px;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgb(228, 230, 232);
  }
  @media screen and (min-width: ${BREAKPOINT.BREAKPOINTMOBILE}px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  all: unset;
  height: 47px;
  width: 47px;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgb(228, 230, 232);
  }
  @media screen and (min-width: ${BREAKPOINT.BREAKPOINTMOBILE}px) {
    display: none;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(187, 191, 195);
  border-radius: 3px;
  width: 40%;
  height: 32px;
  padding-left: 1%;
  box-sizing: border-box;

  &.input-actived {
    box-shadow: 0 0 5px 4px rgba(95, 180, 255, 0.4);
  }

  @media screen and (max-width: ${BREAKPOINT.BREAKPOINTMOBILE}px) {
    display: none;
  }
`;

const SearchBarInput = styled.input`
  all: unset;
  padding-left: 1%;
  font-size: 14px;
`;

const MobileSearchBarButton = styled.button`
  all: unset;
  height: 47px;
  width: 47px;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgb(228, 230, 232);
  }
  @media screen and (min-width: ${BREAKPOINT.BREAKPOINTMOBILE}px) {
    display: none;
  }
`;

const LoggedOutButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px;

  > button {
    cursor: pointer;
  }

  @media screen and (min-width: ${BREAKPOINT.BREAKPOINTMOBILE}px) {
  }
`;

const LoginOutButton = styled.button`
  all: unset;
  width: 60px;
  height: 32px;
  background-color: rgb(225, 236, 244);
  box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.3);
  border: 1px solid rgb(57, 115, 157);
  border-radius: 3px;
  color: rgb(57, 115, 157);
  font-size: 14px;
  font-weight: 400;
  text-align: center;

  &:hover {
    background-color: rgb(185, 210, 232);
  }
`;

const SignUpButton = styled(LoginOutButton)`
  background-color: rgb(10, 149, 255);
  width: 65px;
  color: rgb(255, 255, 255);

  &:hover {
    background-color: rgb(49, 114, 198);
  }
`;

const LoggedInButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;

  > button {
    cursor: pointer;
  }

  @media screen and (min-width: ${BREAKPOINT.BREAKPOINTMOBILE}px) {
  }
`;

const ProfileButtonAria = styled.div`
  height: 47px;
  width: 47px;

  display: flex;
  align-items: center;
  justify-content: center;

  > button {
    cursor: pointer;
  }

  &:hover {
    background-color: rgb(228, 230, 232);
  }
`;

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");

  const navigate = useNavigate();
  const { showPopUp, handlePopUp } = useSearchPopUpStore((state) => state);
  const { handleLeftNav } = useLeftNavStore((state) => state);
  const { handleMobilePopUp } = useMobileSearchPopUpStore((state) => state);
  const { isLogin, setIsLogin } = useIsLoginStore((state) => state);
  const { pathname } = useLocation();
  const [searchInput, setSearchInput] = useState(query);

  let username = "";
  let id = "";

  if (JSON.parse(sessionStorage.getItem("userInfoStorage"))) {
    username = JSON.parse(sessionStorage.getItem("userInfoStorage")).email;
    id = JSON.parse(sessionStorage.getItem("userInfoStorage")).memberId;
  }

  const logoutHandler = () => {
    sessionStorage.clear();
    setIsLogin(false);
    window.location.reload();
  };

  const searchBarInputKeyUpHandler = (e) => {
    if (e.key === "Enter") {
      if (pathname === "/search") {
        navigate(`/search?q=${searchInput}`);
        setSearchInput(searchInput);
      } else {
        navigate(`./search?q=${searchInput}`);
        setSearchInput(searchInput);
      }
    }
  };

  console.log(id);

  return (
    <>
      <HeaderComponent>
        <HeaderContainer>
          <MobileLeftButtonContainer>
            <MobileMenuButton onClick={handleLeftNav}>
              <img src={MobileMenuIcon} alt="mobile menu icon" />
            </MobileMenuButton>
            <MobileHomeButton onClick={() => navigate("/")}>
              <img src={MobileLogo} alt="mobile logo" />
            </MobileHomeButton>
          </MobileLeftButtonContainer>
          <ButtonArea>
            <HomeButton onClick={() => navigate("/")}>
              <img src={Logo} alt="logo" />
            </HomeButton>
          </ButtonArea>
          <SearchBar className={showPopUp ? "input-actived" : null}>
            <img src={SearchBarIcon} alt="searchbar Icon" />
            <SearchBarInput
              placeholder="Search..."
              onFocus={handlePopUp}
              value={searchInput || ""}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyUp={searchBarInputKeyUpHandler}
            />
          </SearchBar>
          <SearchPopUp />
          <ButtonArea>
            {isLogin ? (
              <LoggedInButtonContainer>
                <MobileSearchBarButton onClick={handleMobilePopUp}>
                  <img src={MobileSearchBarIcon} alt="mobile searchbar Icon" />
                </MobileSearchBarButton>
                <ProfileButtonAria>
                  <button
                    css={`
                      all: unset;
                      width: 24px;
                      height: 24px;
                    `}
                    onClick={() => {
                      navigate(`/profile/${id}/${username}`);
                    }}
                  >
                    <img
                      src={JSON.parse(sessionStorage.getItem("userInfoStorage")).image}
                      width="24px"
                      height="24px"
                      alt="user profile"
                    />
                  </button>
                </ProfileButtonAria>
                <LoginOutButton onClick={logoutHandler}>Log out</LoginOutButton>
              </LoggedInButtonContainer>
            ) : (
              <LoggedOutButtonContainer>
                <MobileSearchBarButton onClick={handleMobilePopUp}>
                  <img src={MobileSearchBarIcon} alt="mobile searchbar icon" />
                </MobileSearchBarButton>
                <LoginOutButton
                  css={`
                    margin-right: 5px;
                  `}
                  onClick={() => navigate("/login")}
                >
                  Log in
                </LoginOutButton>
                <SignUpButton onClick={() => navigate("/signup")}>Sign up</SignUpButton>
              </LoggedOutButtonContainer>
            )}
          </ButtonArea>
        </HeaderContainer>
      </HeaderComponent>
      <MobileLeftNav />
      <MobileSearchPopUp />
    </>
  );
};

export default Header;
