import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TextField from "@atlaskit/textfield";
import { CheckboxSelect } from "@atlaskit/select";

function Filters({
  dateGte,
  setDateGte,
  dateLte,
  setDateLte,
  selectedGenres,
  setSelectedGenres,
}) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/genres/`)
      .then((res) => res.json())
      .then(({ results }) => {
        if (results) {
          setGenres(
            results.map(({ id, name }) => ({ label: name, value: id }))
          );
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <Wrapper method="POST">
      <FieldWrap>
        <Label htmlFor="year-from">Year from</Label>
        <TextField
          id="year-from"
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
          id="year-to"
          name="year-to"
          placeholder="2020"
          maxLength={4}
          value={dateLte}
          onChange={(e) => setDateLte(e.target.value)}
        />
      </FieldWrap>
      <FieldWrap>
        <Label htmlFor="genres">Genres</Label>
        <CheckboxSelect
          id="genres"
          name="genres"
          options={genres}
          value={selectedGenres}
          onChange={setSelectedGenres}
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
