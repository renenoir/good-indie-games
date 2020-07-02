import { useEffect } from "react";

function useOutline() {
  function handleTabbing(e) {
    if (e.keyCode === 9) {
      document.documentElement.classList.add("is-tabbing");
      document.removeEventListener("keydown", handleTabbing);
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleTabbing);
    return () => {
      document.removeEventListener("keydown", handleTabbing);
    };
  }, []);
}

export default useOutline;
