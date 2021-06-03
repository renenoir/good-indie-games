import React, { useEffect, memo } from "react";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroller";
import List from "./List";
import Loader from "../common/Loader";
import Filters from "./Filters";
import Sorts from "./Sorts";
import useUser from "../../hooks/useUser";
import useFavorites from "../../hooks/useFavorites";
import { useCatalog } from "../../contexts/catalog";

function Catalog({ modifier = "games" }) {
  const { token } = useUser();
  const { data, fetchGames, setModifier, loading, next } = useCatalog();
  const { favoritesHashmap, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    setModifier(modifier);
  }, []);

  if (modifier === "saved" && !token) {
    return null;
  }

  return (
    <Wrapper>
      <Top>
        <Filters />
        <Sorts />
      </Top>
      <InfiniteScroll
        pageStart={0}
        loadMore={(page) => fetchGames(page, false, token)}
        hasMore={!loading && !!next}
        loader={<CustomLoader key={0} />}
      >
        <List
          games={data}
          loading={loading}
          addFavorite={async (id) => {
            await addFavorite(id);
            if (modifier === "saved") {
              await fetchGames(0, true, token);
            }
          }}
          removeFavorite={async (id) => {
            await removeFavorite(id);
            if (modifier === "saved") {
              await fetchGames(0, true, token);
            }
          }}
          favoritesHashmap={favoritesHashmap}
        />
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

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
`;

const CustomLoader = styled(Loader)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
`;

export default memo(Catalog);
