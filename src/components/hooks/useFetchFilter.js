import { useState, useEffect } from "react";

function useFetchFilter(name) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/${name}/`)
      .then((res) => res.json())
      .then(({ results }) => {
        if (results) {
          setItems(results.map(({ id, name }) => ({ label: name, value: id })));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return items;
}

export default useFetchFilter;
