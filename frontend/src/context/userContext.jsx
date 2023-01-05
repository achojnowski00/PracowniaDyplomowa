import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { ApiContext } from "./apiContext";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const BACKEND_LINK = useContext(ApiContext);
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [userdata, setUserdata] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      await axios
        .get(`${BACKEND_LINK}/api/users/me`, {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserdata(response.data);
        })
        .catch(() => {
          setToken(null);
        });
      localStorage.setItem("access_token", token);
    };

    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={[token, setToken, userdata, setUserdata]}>
      {props.children}
    </UserContext.Provider>
  );
};
