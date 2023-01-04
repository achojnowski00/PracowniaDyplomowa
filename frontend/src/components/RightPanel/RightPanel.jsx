import React, { useContext, useState, useEffect } from "react";
import "./RightPanel.sass";

import { Notes } from "../Notes/Notes";

export const RightPanel = () => {
  return (
    <>
      <div className="RightPanel">
        <Notes />
      </div>
    </>
  );
};
