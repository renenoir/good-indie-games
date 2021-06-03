import React from "react";
import styled from "styled-components";
import TextField from "@atlaskit/textfield";
import { useLocation } from "react-router-dom";
import { useCatalog } from "../../contexts/catalog";

function Search() {
  const { query, setQuery } = useCatalog();
  let location = useLocation();

  const disabled = location.pathname !== "/" && location.pathname !== "/saved";

  return (
    <Form
      action=""
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className={disabled ? "disabled" : ""}
    >
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
  transition: 0.25s ease-in-out;

  &.disabled {
    opacity: 0;
    visibility: hidden;
  }

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
