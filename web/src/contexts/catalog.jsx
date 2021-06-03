import React, { createContext, useState, useContext, useEffect } from "react";
import { stringify } from "query-string";
import { parse, formatISO, startOfYear, endOfYear } from "date-fns";

import useFavorites from "../hooks/useFavorites";
import useUser from "../hooks/useUser";
import useDebounce from "../utils/hooks/useDebounce";

export const SORTS = [
  {
    name: "Date",
    code: "first_release_date",
  },
  {
    name: "Popularity",
    code: "popularity",
  },
  {
    name: "Rating",
    code: "rating",
  },
];

const CatalogContext = createContext();
const CatalogProvider = ({ children }) => {
  const { favoritesHashmap, addFavorite, removeFavorite } = useFavorites();
  const { token } = useUser();
  const [query, setQuery] = useState("");
  const [modifier, setModifier] = useState("games");
  const [dateGte, setDateGte] = useState("");
  const [dateLte, setDateLte] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [sort, setSort] = useState("-" + SORTS[0].code);
  const [next, setNext] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 250);

  function fetchGames(page, clear, token) {
    if (modifier === "saved" && !token) {
      setLoading(false);
      setData([]);
      return;
    }

    setLoading(true);

    const query = {
      limit: 20,
      offset: 20 * page,
      ordering: sort,
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

    if (selectedThemes && selectedThemes.length) {
      query.themes = selectedThemes.map(({ value }) => value);
    }

    if (selectedPlatforms && selectedPlatforms.length) {
      query.platforms = selectedPlatforms.map(({ value }) => value);
    }

    const headers = {};

    if (token) {
      headers.Authorization = `Token ${token}`;
    }

    return fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/gig/${modifier}/?${stringify(
        query
      )}`,
      {
        headers,
      }
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
    fetchGames(0, true, token);
  }, [
    debouncedQuery,
    dateGte,
    dateLte,
    selectedGenres,
    selectedThemes,
    selectedPlatforms,
    sort,
    token,
    modifier,
  ]);

  const value = {
    data,
    sort,
    query,
    loading,
    next,
    favoritesHashmap,
    setModifier,
    setDateGte,
    setDateLte,
    setSelectedGenres,
    setSelectedThemes,
    setSelectedPlatforms,
    setSort,
    setNext,
    setQuery,
    addFavorite,
    removeFavorite,
    fetchGames,
  };
  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
};

function useCatalog() {
  const context = useContext(CatalogContext);
  if (context === undefined) {
    throw new Error("useCatalog must be used within a CatalogProvider");
  }
  return context;
}

export { CatalogProvider, useCatalog };
