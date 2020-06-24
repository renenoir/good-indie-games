import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import TextField from "@atlaskit/textfield";
import { CheckboxSelect } from "@atlaskit/select";
import Button from "@atlaskit/button";
import { Modal } from "react-responsive-modal";

import useFetchFilter from "./useFetchFilter";

function Filters({
  // Dates
  dateGte,
  setDateGte,
  dateLte,
  setDateLte,
  // Filters
  selectedGenres,
  setSelectedGenres,
  selectedThemes,
  setSelectedThemes,
  selectedPlatforms,
  setSelectedPlatforms,
}) {
  const [isOpen, setIsOpen] = useState(false);

  function onOpen() {
    setIsOpen(true);
  }

  function onClose() {
    setIsOpen(false);
  }

  const genres = useFetchFilter("genres");
  const themes = useFetchFilter("themes");
  const platforms = useFetchFilter("platforms");

  return (
    <Wrapper>
      <Button appearance="primary" onClick={onOpen}>
        Filters
      </Button>
      <Modal
        open={isOpen}
        onClose={onClose}
        center
        classNames={{
          modal: "filtersModal",
        }}
      >
        <Form method="POST">
          <Header>Filters</Header>
          <Fields>
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
          </Fields>
        </Form>
        <ModalStyles />
      </Modal>
    </Wrapper>
  );
}

const ModalStyles = createGlobalStyle`
  .filtersModal {
    width: 500px;
  }
`;

const Wrapper = styled.div``;

const Form = styled.form`
  padding: 0.5rem 0;
`;

const Header = styled.h2`
  margin-top: 0;
`;

const Fields = styled.div`
  @media (min-width: 40rem) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin: 0 -1.25rem -1.25rem 0;
  }
`;

const FieldWrap = styled.div`
  &:not(:last-child) {
    margin-bottom: 1.25rem;
  }

  @media (min-width: 40rem) {
    flex-basis: calc(50% - 1.25rem);
    max-width: calc(50% - 1.25rem);
    margin: 0 1.25rem 1.25rem 0;
  }
`;

const Label = styled.label``;

export default Filters;
