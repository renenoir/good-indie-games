import React from "react";
import styled from "styled-components";

import TextField from "@atlaskit/textfield";

function Search({ query, setQuery }) {
  return (
    <Form action="">
      <Input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Enter game name, theme or genre"
      />
    </Form>
  );
}

const Form = styled.form`
  flex: 1;
  padding: 0 30px;

  @media (max-width: 60rem) {
    width: 100%;
    padding: 0.5rem 0;
  }
`;

const Input = styled(TextField)`
  height: 42px;
  font-size: 1.125rem;
`;

export default Search;
