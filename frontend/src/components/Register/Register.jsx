import React, { useState, useContext } from "react";
import axios from "axios";

import { UserContext } from "../../context/userContext";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";

import "./Register.sass";

export const Register = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);

  const submitRegister = async (e) => {
    await axios
      .post(
        "http://localhost:8000/api/users/register",
        {
          login: login,
          hashed_password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setToken(response.data.access_token);
        setErrorMessage("");
      })
      .catch((error) => {
        setErrorMessage(error.response.data.detail);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!(password.length >= 8)) {
      setErrorMessage("Hasło musi składać się z conajmniej 8 znaków");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Hasła nie są takie same");
      return;
    }

    submitRegister();
  };

  return (
    <div className="authform">
      <form onSubmit={handleSubmit}>
        <h1 className="authform__title">Zarejestruj się</h1>

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

        <div className="authform__field ">
          <div>
            <input
              type="password"
              placeholder="Powtórz hasło"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="authform__input"
              required
            />
          </div>
        </div>
        <br />
        <ErrorMessage message={errorMessage} />
        <button className="authform__button" type="submit">
          Zarejestruj
        </button>
      </form>
    </div>
  );
};
