import React from "react";
import styled from "styled-components";

function Loader({ className }) {
  return (
    <Wrapper className={className}>
      <Spinner />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 3px solid var(--color-primary);
  border-top-color: transparent;
  animation: spin 1000ms linear infinite;

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Loader;
