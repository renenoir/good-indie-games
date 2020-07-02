import { useEffect, useState } from "react";
import useUser from "./useUser";

async function getFavorites(token) {
  try {
    if (!token) {
      throw new Error("Token was not provided");
    }
    const result = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/gig/saved/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    const json = await result.json();
    return json.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function toggleFavorite(token, action = "add", id) {
  try {
    if (!token) {
      throw new Error("Token was not provided");
    }
    if (!id) {
      throw new Error("Id was not provided");
    }
    await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/gig/games/${id}/${action}/`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
}

export default function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [favoritesHashmap, setFavoritesHashmap] = useState({});
  const { token } = useUser();

  async function updateFavorites(token) {
    const result = await getFavorites(token);
    setFavorites(result);

    const hashmap = result.reduce((acc, cur) => {
      acc[cur.id] = true;
      return acc;
    }, {});
    setFavoritesHashmap(hashmap);
  }

  useEffect(() => {
    if (!token) {
      return;
    }
    updateFavorites(token);
  }, [token]);

  async function addFavorite(id) {
    await toggleFavorite(token, "add-to-saved", id);
    await updateFavorites(token);
  }

  async function removeFavorite(id) {
    await toggleFavorite(token, "remove-from-saved", id);
    await updateFavorites(token);
  }

  return { favorites, favoritesHashmap, addFavorite, removeFavorite };
}
