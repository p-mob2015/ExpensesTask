import React, { useEffect, useState } from "react";
import ExpenseRow from "../../components/Expense/Row";
import LoadingIndicator from "../../components/LoadingIndicator";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "../../components/Button";
import request from "../../request";

import styles from "./List.module.css";

function ExpenseList({ expenses }) {
  const newExpenseButton = <Button to={"/expense/new"}>New Expense</Button>;

  if (expenses.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateMessage}>
          You haven't recorded any expenses.
        </div>
        <div>{newExpenseButton}</div>
      </div>
    );
  }

  return (
    <>
      <ul className={styles.list}>
        {expenses.map((expense) => (
          <ExpenseRow key={expense.id} expense={expense} />
        ))}
      </ul>

      <div className={styles.actions}>{newExpenseButton}</div>
    </>
  );
}

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(function () {
    async function loadExpenses() {
      const response = await request("/expenses", {
        method: "GET",
      });
      if (response.ok) {
        setExpenses(response.body);
        setStatus("loaded");
      } else {
        setStatus("error");
      }
    }

    loadExpenses();
  }, []);

  let content;
  if (status === "loading") {
    content = <LoadingIndicator />;
  } else if (status === "loaded") {
    content = <ExpenseList expenses={expenses} />;
  } else if (status === "error") {
    content = <ErrorMessage />;
  } else {
    throw new Error(`Unexpected status: ${status}`);
  }

  return content;
}

export default ExpensesPage;
