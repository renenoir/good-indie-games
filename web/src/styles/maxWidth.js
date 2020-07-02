import { css } from "styled-components";

const maxWidth = css`
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 1340px) {
    padding-left: 5%;
    padding-right: 5%;
  }
`;

export default maxWidth;
