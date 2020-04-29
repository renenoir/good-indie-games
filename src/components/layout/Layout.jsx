import React from "react";
import styled from "styled-components";

import Header from "./Header";
import Footer from "./Footer";
import maxWidth from "../../styles/maxWidth";

function Layout({ children, query, setQuery }) {
  return (
    <Container>
      <GridHeader query={query} setQuery={setQuery} />
      <Main>{children}</Main>
      <GridFooter />
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

const GridFooter = styled(Footer)`
  grid-area: footer;
`;

export default Layout;
