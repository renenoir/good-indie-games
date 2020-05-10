import React, { useEffect, useState } from "react";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroller";

import useDebounce from "../../utils/hooks/useDebounce";
import getUndef from "../../utils/getUndef";
import List from "./List";
import Loader from "../common/Loader";

function Catalog({ query }) {
  const [next, setNext] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prevQuery, setPrevQuery] = useState(query || "");

  const debouncedQuery = useDebounce(query, 250);

  function fetchGames(page, clear) {
    setLoading(true);
    return fetch(
      `${
        process.env.REACT_APP_API_ENDPOINT
      }/games/?search=${debouncedQuery}&limit=20&offset=${20 * page}`
    )
      .then((res) => res.json())
      .then(({ next, results }) => {
        setNext(next);
        setData(clear ? results : [...data, ...results]);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }

  useEffect(() => {
    if (debouncedQuery === prevQuery) {
      return;
    }
    setPrevQuery(debouncedQuery);
    fetchGames(0, true);
  }, [debouncedQuery]);

  return (
    <Wrapper>
      <InfiniteScroll
        pageStart={-1}
        loadMore={fetchGames}
        hasMore={!loading && !!next}
        loader={<CustomLoader key={0} />}
      >
        <List games={data} />
      </InfiniteScroll>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 30px;
`;

const CustomLoader = styled(Loader)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
`;

export default Catalog;
