import React from "react";
import styled from "styled-components";
import TextField from "@atlaskit/textfield";

function Filters({ dateGte, setDateGte, dateLte, setDateLte }) {
  return (
    <Wrapper method="POST">
      <FieldWrap>
        <Label htmlFor="year-from">Year from</Label>
        <TextField
          name="year-from"
          placeholder="2000"
          maxLength={4}
          value={dateGte}
          onChange={(e) => setDateGte(e.target.value)}
        />
      </FieldWrap>
      <FieldWrap>
        <Label htmlFor="year-to">Year to</Label>
        <TextField
          name="year-to"
          placeholder="2020"
          maxLength={4}
          value={dateLte}
          onChange={(e) => setDateLte(e.target.value)}
        />
      </FieldWrap>
    </Wrapper>
  );
}

const Wrapper = styled.form`
  display: flex;
  align-items: center;
`;

const FieldWrap = styled.div`
  flex: 1;
`;

const Label = styled.label``;

export default Filters;
