import React from "react";
import styled from "styled-components";

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
`;

const Input = styled.input`
  display: block;
  width: 100%;
  height: 42px;
  padding: 0 1rem;
  border-radius: 5px;
  border: 1px solid var(--color-gray);
  font-size: 1.125rem;
`;

export default Search;
