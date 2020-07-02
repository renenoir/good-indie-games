import React from "react";
import styled from "styled-components";
import maxWidth from "../../styles/maxWidth";

function Footer({ className }) {
  return (
    <Wrapper className={className}>
      <Content>footer</Content>
    </Wrapper>
  );
}

const Wrapper = styled.footer``;

const Content = styled.div`
  ${maxWidth}
`;

export default Footer;
