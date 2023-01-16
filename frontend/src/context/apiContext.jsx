import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ApiContext = createContext();

export const ApiProvider = (props) => {
  // Change BACKEND_URL to your backend url
  // const BACKEND_URL = "http://192.168.1.17:8000"; // PC
  // const BACKEND_URL = "http://192.168.1.13:8000"; // Laptop
  const BACKEND_URL = "http://localhost:8000"; // Laptop
  // const BACKEND_URL = "https://homeorganizer.onrender.com";

  return (
    <ApiContext.Provider value={BACKEND_URL}>
      {props.children}
    </ApiContext.Provider>
  );
};
