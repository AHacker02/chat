import { useRef } from "react";

export const useScrollToBttom = () => {
  const bottomRef = useRef();

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return [bottomRef, scrollToBottom];
};
