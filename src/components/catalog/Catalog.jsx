import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useDebounce from "../../utils/hooks/useDebounce";
import getUndef from "../../utils/getUndef";
import List from "./List";

function Catalog({ query }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const debouncedQuery = useDebounce(query, 250);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
    }, 200);

    fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/games/?search=${debouncedQuery}`
    )
      .then((res) => res.json())
      .then(({ results }) => {
        setData(results);
        clearTimeout(timer);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [debouncedQuery]);

  return (
    <Wrapper>
      <List loading={loading} games={getUndef(() => data) || []} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export default Catalog;
