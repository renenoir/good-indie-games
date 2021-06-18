import React from "react";
import styled from "styled-components";

import Header from "./Header";
import maxWidth from "../../styles/maxWidth";

function Layout({ children }) {
  return (
    <Container>
      <GridHeader />
      <Main>{children}</Main>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-areas:
    "header"
    "main"
    "footer";
  grid-template-rows: auto 1fr auto;
`;

const GridHeader = styled(Header)`
  grid-area: header;
`;

const Main = styled.main`
  ${maxWidth};
  grid-area: main;
  display: flex;

  > * {
    width: 100%;
  }
`;

export default Layout;
