import React, { useContext, useState, useEffect, useRef } from "react";
import "./RightPanel.sass";

import { Notes } from "../Notes/Notes";

import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export const RightPanel = () => {
  const [hidden, setHidden] = useState(true);

  let rightPanel = useRef();

  useEffect(() => {
    let handler = (event) => {
      if (!rightPanel.current.contains(event.target)) {
        setHidden(true);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [hidden]);

  return (
    <>
      <div
        ref={rightPanel}
        className={"RightPanel" + (hidden ? " RightPanel--hidden" : "")}
      >
        {hidden ? (
          <TextSnippetRoundedIcon
            className="RightPanel__icon"
            onClick={() => setHidden(false)}
          />
        ) : (
          <CloseRoundedIcon
            className="RightPanel__icon RightPanel__icon--close"
            onClick={() => setHidden(true)}
          />
        )}

        <Notes />
      </div>
    </>
  );
};
