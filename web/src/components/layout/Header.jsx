import React, { Suspense, lazy, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import maxWidth from "../../styles/maxWidth";
import pixelFont from "../../styles/pixelFont";
import Search from "./Search";
import useUser from "../../hooks/useUser";
import useLoginOpen from "../../hooks/useLoginOpen";

const Login = lazy(() => import("./Login"));

const Header = ({ className }) => {
  const { loginOpen, setLoginOpen } = useLoginOpen();
  const { token, setToken } = useUser();

  return (
    <Wrapper className={className}>
      <Row>
        <Logo to="/">GIG</Logo>
        <Search />
        <Nav>
          {!!token && <NavLink to="/saved">Saved</NavLink>}
          {!!token ? (
            <NavLink
              to="#"
              onClick={(e) => {
                e.preventDefault();
                setToken(undefined);
              }}
            >
              Logout
            </NavLink>
          ) : (
            <NavLink
              to="#"
              onClick={(e) => {
                e.preventDefault();
                setLoginOpen(true);
              }}
            >
              Login
            </NavLink>
          )}
        </Nav>
        <Suspense fallback={null}>
          <Login open={loginOpen} setOpen={setLoginOpen} />
        </Suspense>
      </Row>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-gray);
`;

const Row = styled.div`
  ${maxWidth};

  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 60rem) {
    flex-direction: column;
  }
`;

const Logo = styled(Link)`
  ${pixelFont};

  position: relative;
  top: -5px;
  display: inline-block;
  line-height: 0.9;
  font-size: 76px;
  background: linear-gradient(
    90deg,
    var(--color-secondary),
    var(--color-primary),
    var(--color-secondary)
  );
  -webkit-background-clip: text;
  background-clip: text;
  background-size: 200% auto;
  color: rgba(0, 0, 0, 0.2);
  border-bottom: 6px solid transparent;
  transition: 0.2s ease-in;
  animation: shine 2.5s linear infinite;

  :focus {
    outline: none;
  }

  :focus,
  :hover {
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
    text-decoration: none;
    transition: 0.25s ease-out;
  }

  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
`;

const NavLink = styled(Link)`
  font-weight: bold;
  :not(:last-child) {
    margin-right: 1em;
  }

  @media (max-width: 60rem) {
    margin: 0.5rem 0;
  }
`;

export default Header;
