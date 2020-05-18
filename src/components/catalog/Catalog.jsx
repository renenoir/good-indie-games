import React, { useEffect, useState } from "react";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroller";
import { stringify } from "query-string";
import { parse, formatISO, startOfYear, endOfYear } from "date-fns";

import useDebounce from "../../utils/hooks/useDebounce";
import List from "./List";
import Loader from "../common/Loader";
import Filters from "./Filters";

function Catalog({ query }) {
  const [dateGte, setDateGte] = useState("");
  const [dateLte, setDateLte] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [next, setNext] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 250);

  function fetchGames(page, clear) {
    setLoading(true);

    const query = {
      limit: 20,
      offset: 20 * page,
    };

    if (debouncedQuery) {
      query.search = debouncedQuery;
    }

    if (dateGte.length === 4) {
      query.first_release_date__gte = formatISO(
        startOfYear(parse(dateGte, "yyyy", new Date()))
      );
    }

    if (dateLte.length === 4) {
      query.first_release_date__lte = formatISO(
        endOfYear(parse(dateLte, "yyyy", new Date()))
      );
    }

    if (selectedGenres && selectedGenres.length) {
      query.genres = selectedGenres.map(({ value }) => value);
    }
    return fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/games/?${stringify(query)}`
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
    fetchGames(0, true);
  }, [debouncedQuery, dateGte, dateLte, selectedGenres]);

  return (
    <Wrapper>
      <Filters
        dateGte={dateGte}
        setDateGte={setDateGte}
        dateLte={dateLte}
        setDateLte={setDateLte}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
      />
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
