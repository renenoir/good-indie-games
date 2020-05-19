import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TextField from "@atlaskit/textfield";
import { CheckboxSelect } from "@atlaskit/select";
import useFetchFilter from "../hooks/useFetchFilter";

function Filters({
  dateGte,
  setDateGte,
  dateLte,
  setDateLte,
  selectedGenres,
  setSelectedGenres,
  selectedThemes,
  setSelectedThemes,
  selectedPlatforms,
  setSelectedPlatforms,
}) {
  const genres = useFetchFilter("genres");
  const themes = useFetchFilter("themes");
  const platforms = useFetchFilter("platforms");

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
      <FieldWrap>
        <Label htmlFor="themes">Themes</Label>
        <CheckboxSelect
          id="themes"
          name="themes"
          options={themes}
          value={selectedThemes}
          onChange={setSelectedThemes}
        />
      </FieldWrap>
      <FieldWrap>
        <Label htmlFor="platforms">Platforms</Label>
        <CheckboxSelect
          id="platforms"
          name="platforms"
          options={platforms}
          value={selectedPlatforms}
          onChange={setSelectedPlatforms}
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
