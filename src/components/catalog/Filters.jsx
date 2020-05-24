import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TextField from "@atlaskit/textfield";
import { CheckboxSelect } from "@atlaskit/select";
import Button from "@atlaskit/button";
import ModalDialog, { ModalTransition } from "@atlaskit/modal-dialog";

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
      <ModalTransition>
        {isOpen && (
          <ModalDialog scrollBehavior="outside" onClose={onClose}>
            <Form method="POST">
              <h1>Filters</h1>
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
          </ModalDialog>
        )}
      </ModalTransition>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 1rem 0 1.25rem;
`;

const Form = styled.form`
  padding: 0.5rem 0 1.5rem;
`;

const Fields = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 -1.25rem -1.25rem 0;
`;

const FieldWrap = styled.div`
  flex-basis: calc(50% - 1.25rem);
  max-width: calc(50% - 1.25rem);
  margin: 0 1.25rem 1.25rem 0;
`;

const Label = styled.label``;

export default Filters;
