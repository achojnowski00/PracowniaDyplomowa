import React, { useState, useContext } from "react";

import { UserContext } from "../../context/userContext";
import { ApiContext } from "../../context/apiContext";

import { ErrorMessage } from "../ErrorMessage/ErrorMessage";

export const Login = () => {
  const BACKEND_LINK = useContext(ApiContext);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);

  const submitLogin = async (e) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify(
        `grant_type=&username=${login}&password=${password}&scope=&client_id=&client_secret=`
      ),
    };

    const response = await fetch(
      `${BACKEND_LINK}/api/users/token`,
      requestOptions
    );
    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.detail);
      return;
    }

    setToken(data.access_token);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };

  return (
    <div className="authform">
      <form onSubmit={handleSubmit}>
        <h1 className="authform__title">Zaloguj się</h1>

        <div className="authform__field ">
          <div>
            <input
              type="text"
              placeholder="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="authform__input"
              required
            />
          </div>
        </div>

        <div className="authform__field ">
          <div>
            <input
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="authform__input"
              required
            />
          </div>
        </div>

        <br />
        <ErrorMessage message={errorMessage} />
        <button className="authform__button" type="submit">
          Zaloguj
        </button>
      </form>
    </div>
  );
};
