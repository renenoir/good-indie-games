import React from "react";
import styled from "styled-components";
import { SORTS, useCatalog } from "../../contexts/catalog";

function Sorts() {
  const { sort, setSort } = useCatalog();

  return (
    <Row>
      {SORTS.map(({ name, code }) => {
        const currentSort = sort.split("-");
        const isSelected = code === currentSort[currentSort.length - 1];
        const isDesc = currentSort.length !== 2 && isSelected;
        return (
          <Sort
            key={code}
            isSelected={isSelected}
            onClick={() => {
              setSort(`${isSelected ? (isDesc ? "-" : "") : "-"}${code}`);
            }}
          >
            <Direction isDesc={isDesc} />
            <Name>{name}</Name>
          </Sort>
        );
      })}
    </Row>
  );
}

const Row = styled.div`
  display: flex;
`;

const Sort = styled.button`
  display: flex;
  align-items: center;
  padding: 0;
  background: none;
  border: none;
  transition: 0.2s ease-in-out;
  cursor: pointer;

  opacity: ${({ isSelected }) => (isSelected ? 1 : 0.5)};
  &:not(:last-child) {
    margin-right: 1rem;
  }
`;

const Direction = styled.span`
  border: 5px solid transparent;
  border-top-color: #000;
  border-bottom: 0;
  margin-right: 0.5rem;
  transition: inherit;
  transform: rotate(${({ isDesc }) => (isDesc ? "180deg" : "0deg")});
`;

const Name = styled.span`
  font-size: 1rem;
`;

export default Sorts;
