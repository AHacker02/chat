import { useEffect, useRef, useState } from "react";

export const useButtonLoader = (defaultText) => {
  const [isLoading, setLoading] = useState(false);
  const element = useRef(null);
  useEffect(() => {
    if (isLoading) {
      element.current.disabled = true;
      element.current.innerHTML = "Loading";
    } else {
      element.current.disabled = false;
      element.current.innerHTML = defaultText;
    }
  }, [isLoading]);
  return [element, setLoading];
};
