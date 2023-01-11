import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import "./Raport.sass";

// Contexts
import { FilterContext } from "../../context/filterContext";
import { BudgetContext } from "../../context/budgetContext";
import { UserContext } from "../../context/userContext";
import { ApiContext } from "../../context/apiContext";
import { ThemeContext } from "../../context/themeContext";

// Components
import { Charts } from "../Charts/Charts";

// Mui stuff
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CircularProgress from "@mui/material/CircularProgress";

export const Raport = (props) => {
  // Contexts
  const [month, , , , , , , transactionsData, , , ,] =
    useContext(FilterContext);
  const [budgetData, , currentBudget] = useContext(BudgetContext);
  const [token] = useContext(UserContext);
  const BACKEND_LINK = useContext(ApiContext);
  const [theme] = useContext(ThemeContext);

  // States
  const [raportData, setRaportData] = useState(null);

  // =================== //
  //      Functions      //
  // =================== //
  // Axios
  const fetchCategories = async () => {
    let resualt;
    await axios
      .get(`${BACKEND_LINK}/api/categories/get-all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        resualt = res.data;
      })
      .catch((err) => {
        // console.log("error pobierania kategorii (raport miesieczny)", err);
      });

    return resualt;
  };

  // helper functions
  const monthName = (monthNumber) => {
    switch (monthNumber) {
      case 1:
        return "ze stycznia";
      case 2:
        return "z lutego";
      case 3:
        return "z marca";
      case 4:
        return "z kwietnia";
      case 5:
        return "z maja";
      case 6:
        return "z czerwca";
      case 7:
        return "z lipca";
      case 8:
        return "z sierpnia";
      case 9:
        return "z września";
      case 10:
        return "z października";
      case 11:
        return "z listopada";
      case 12:
        return "z grudnia";
      default:
        return "nieznany miesiąc";
    }
  };

  const sumUpAmountOfCategory = (categoryID, data) => {
    let resualt = 0;
    data.forEach((transaction) => {
      if (transaction.category.id === categoryID) {
        resualt += Number(transaction.amount);
      }
    });
    return resualt;
  };

  const sumUpAmountOfUser = (userID, data, outcomes = true) => {
    let resualt = 0;
    if (outcomes) {
      data.forEach((transaction) => {
        if (transaction.who_created.id === userID && transaction.isOutcome) {
          resualt += Number(transaction.amount);
        }
      });
    } else {
      data.forEach((transaction) => {
        if (transaction.who_created.id === userID && !transaction.isOutcome) {
          resualt += Number(transaction.amount);
        }
      });
    }
    return resualt;
  };

  // Raport main function
  const raport = (transactionsData) => {
    if (!transactionsData) return;

    let resualt = {
      bilans: {
        labels: ["Wydatki", "Przychody"],
        datasets: [
          {
            label: "Wydatki i przychody",
            data: [0, 0],
            backgroundColor:
              theme === "light"
                ? ["#ECC1BD", "#B9ECCC"]
                : ["#C63939", "#39C680"],
            hoverBackgroundColor:
              theme === "light"
                ? ["#dbb0ac", "#a8dbbb"]
                : ["#d74a4a", "#4ad791"],
          },
        ],
      },
      outcomes: {
        labels: [],
        datasets: [
          {
            label: "Wydatki",
            data: [],
            // backgroundColor: theme === "light" ? [] : [],
            // hoverBackgroundColor: theme === "light" ? [] : [],
          },
        ],
      },
      incomes: {
        labels: [],
        datasets: [
          {
            label: "Przychody",
            data: [],
          },
        ],
      },
      usersOutcomes: {
        labels: [],
        datasets: [
          {
            label: "Użytkownicy",
            data: [],
            // backgroundColor: theme === "light" ? [] : [],
            // hoverBackgroundColor: theme === "light" ? [] : [],
          },
        ],
      },

      usersIncomes: {
        labels: [],
        datasets: [
          {
            label: "Użytkownicy",
            data: [],
            // backgroundColor: theme === "light" ? [] : [],
            // hoverBackgroundColor: theme === "light" ? [] : [],
          },
        ],
      },
    };

    // Ustawienie resualt.bilans
    transactionsData.find((transaction) => {
      transaction.isOutcome === true
        ? (resualt.bilans.datasets[0].data[0] += Number(transaction.amount))
        : (resualt.bilans.datasets[0].data[1] += Number(transaction.amount));
    });

    // Ustawienie resualt.categories
    let categories;
    fetchCategories()
      .then((res) => (categories = res))
      .then(() => {
        categories.forEach((category) => {
          let ammount = sumUpAmountOfCategory(category.id, transactionsData);

          if (ammount === 0) return;

          if (category.isOutcome) {
            resualt.outcomes.labels.push(category.name);
            resualt.outcomes.datasets[0].data.push(ammount);
          } else {
            resualt.incomes.labels.push(category.name);
            resualt.incomes.datasets[0].data.push(ammount);
          }
        });
      });

    // Ustawienie resualt.usersOutcomes
    budgetData.users.forEach((user) => {
      let out = sumUpAmountOfUser(user.id, transactionsData);
      let inc = sumUpAmountOfUser(user.id, transactionsData, false);

      if (out !== 0) {
        resualt.usersOutcomes.labels.push(user.name);
        resualt.usersOutcomes.datasets[0].data.push(out);
      }
      if (inc !== 0) {
        resualt.usersIncomes.labels.push(user.name);
        resualt.usersIncomes.datasets[0].data.push(inc);
      }
    });

    return resualt;
  };

  // UseEffects
  useEffect(() => {
    // // console.log(`😎`, transactionsData);
    // // console.log(`😅`, budgetData);
    let dupa = raport(transactionsData);
    setRaportData(raport(transactionsData));

    // console.log(`🤡`, dupa);
  }, []);

  return (
    <>
      <div onClick={props.turnOff} className="Raport__background"></div>
      <div className="Raport">
        <h1 className="Raport__title">Raport budżetu {budgetData.name}</h1>
        <h2 className="Raport__subtitle">
          Dane obejmują wszystkie transakcje {monthName(month)}
        </h2>
        <CloseRoundedIcon
          className="Raport__close-btn"
          onClick={props.turnOff}
        />

        {raportData && (
          <>
            <div className="Raport__stat">
              <div className="Raport__stat-info">
                <h3 className="Raport__stat-title">
                  Zestawienie wydatków i przychodów z miesiąca
                </h3>
                <p className="Raport__stat-amount">
                  W tym miesiącu do budżetu wpłynęło:
                  <span className="Raport__stat-amount--bold">
                    {" "}
                    {raportData.bilans.datasets[0].data[1]
                      .toFixed(2)
                      .toString()
                      .replace(".", ",")}{" "}
                    zł
                  </span>
                </p>
                <p className="Raport__stat-amount">
                  a wydane zostało
                  <span className="Raport__stat-amount--bold">
                    {" "}
                    {raportData.bilans.datasets[0].data[0]
                      .toFixed(2)
                      .toString()
                      .replace(".", ",")}{" "}
                    zł
                  </span>
                </p>
                <p className="Raport__stat-amount">
                  Saldo miesięczne:
                  <span
                    className={
                      (raportData.bilans.datasets[0].data[0] -
                      raportData.bilans.datasets[0].data[1]
                        ? "Raport__stat-amount--plus"
                        : "Raport__stat-amount--minus") +
                      " Raport__stat-amount--bold"
                    }
                  >
                    {" "}
                    {(
                      raportData.bilans.datasets[0].data[1] -
                      raportData.bilans.datasets[0].data[0]
                    )
                      .toFixed(2)
                      .toString()
                      .replace(".", ",")}{" "}
                    zł
                  </span>
                </p>
              </div>

              <Charts data={raportData.bilans} />
            </div>

            <div className="Raport__stat Raport__stat--two">
              <div className="Raport__stat-info">
                <h3 className="Raport__stat-title">
                  Podział wydatków i przychodów na poszczególnych użytkowników
                  budżetu
                </h3>
                <p className="Raport__stat-subtitle">
                  Dane pokazują sumę wydatków i przychodów każdego użytkownika
                </p>
              </div>

              <div className="Raport__stat-charts">
                <div className="Raport__stat-chart">
                  <h4 className="Raport__stat-chart-title">Wydatki</h4>
                  <Charts data={raportData.usersOutcomes} />
                </div>

                <div className="Raport__stat-chart">
                  <h4 className="Raport__stat-chart-title">Przychody</h4>
                  <Charts data={raportData.usersIncomes} />
                </div>
              </div>
            </div>

            <div className="Raport__stat Raport__stat--two">
              <div className="Raport__stat-info">
                <h3 className="Raport__stat-title">
                  Podział wydatków i przychodów na poszczególne kategorie
                </h3>
                <p className="Raport__stat-subtitle">
                  Dane pokazują sumę wydatków i przychodów każdej kategorii
                </p>
              </div>
              {raportData.outcomes.datasets[0].data.length > 0 ? (
                <div className="Raport__stat-charts">
                  <div className="Raport__stat-chart">
                    <h4 className="Raport__stat-chart-title">Wydatki</h4>
                    <Charts data={raportData.outcomes} />
                  </div>
                  <div className="Raport__stat-chart">
                    <h4 className="Raport__stat-chart-title">Przychody</h4>
                    <Charts data={raportData.incomes} />
                  </div>
                </div>
              ) : (
                <p className="Raport__stat-amount">
                  <CircularProgress />
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
