import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ApiContext = createContext();

export const ApiProvider = (props) => {
  const BACKEND_URL = "http://192.168.1.17:8000";

  return (
    <ApiContext.Provider value={BACKEND_URL}>
      {props.children}
    </ApiContext.Provider>
  );
};
