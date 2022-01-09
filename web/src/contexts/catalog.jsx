import React, { createContext, useState, useContext, useEffect } from "react";
import { stringify, parse } from "query-string";
import {
  parse as parseDate,
  formatISO,
  startOfYear,
  endOfYear,
} from "date-fns";
import { useHistory, useLocation } from "react-router-dom";

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
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [modifier, setModifier] = useState("games");
  const [dateGte, setDateGte] = useState("");
  const [dateLte, setDateLte] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const defaultSort = "-" + SORTS[0].code;
  const [sort, setSort] = useState(defaultSort);
  const [next, setNext] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 250);
  const history = useHistory();
  const location = useLocation();

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
        startOfYear(parseDate(dateGte, "yyyy", new Date()))
      );
    }

    if (dateLte.length === 4) {
      query.first_release_date__lte = formatISO(
        endOfYear(parseDate(dateLte, "yyyy", new Date()))
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
        setPage(page);
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
    saveFilters();
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

  useEffect(() => {
    restoreFilters();
  }, []);

  function saveFilters() {
    const filters = {};

    function stringifyParams(v) {
      return stringify(v.map((s) => [s.label, s.value]));
    }

    if (sort !== "" && sort !== defaultSort) {
      filters["sort"] = sort;
    }
    if (dateGte !== "") {
      filters["dateGte"] = dateGte;
    }
    if (dateLte !== "") {
      filters["dateLte"] = dateLte;
    }
    if (selectedGenres && selectedGenres.length > 0) {
      filters["selectedGenres"] = stringifyParams(selectedGenres);
    }
    if (selectedThemes && selectedThemes.length > 0) {
      filters["selectedThemes"] = stringifyParams(selectedThemes);
    }
    if (selectedPlatforms && selectedPlatforms.length > 0) {
      filters["selectedPlatforms"] = stringifyParams(selectedPlatforms);
    }

    if (!Object.keys(filters).length) {
      return;
    }

    const qs = stringify(filters);
    history.push(`${location.pathname}?${qs}`);
  }

  function restoreFilters() {
    const filters = parse(location.search);

    function paramsFromArray(v) {
      const obj = parse(v);
      return Object.keys(obj).map((key) => {
        const item = obj[key];
        return {
          label: item[0],
          value: item[1],
        };
      });
    }

    if (filters["sort"]) {
      setSort(filters["sort"]);
    }
    if (filters["dateGte"]) {
      setDateGte(filters["dateGte"]);
    }
    if (filters["dateLte"]) {
      setDateLte(filters["dateLte"]);
    }
    try {
      if (filters["selectedGenres"]) {
        setSelectedGenres(paramsFromArray(filters["selectedGenres"]));
      }
      if (filters["selectedThemes"]) {
        setSelectedThemes(paramsFromArray(filters["selectedThemes"]));
      }
      if (filters["selectedPlatforms"]) {
        setSelectedPlatforms(paramsFromArray(filters["selectedPlatforms"]));
      }
    } catch (error) {
      console.error(error);
    }
  }

  const value = {
    page,
    data,
    sort,
    query,
    loading,
    next,
    favoritesHashmap,
    dateGte,
    dateLte,
    selectedGenres,
    selectedPlatforms,
    selectedThemes,
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
