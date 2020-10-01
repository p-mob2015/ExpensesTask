import React from "react";
import { Link } from "react-router-dom";

import styles from "./Row.module.css";

function ExpenseRow({ expense }) {
  return (
    <li className={styles.item}>
      <Link to={`/expense/${expense.id}`} className={styles.itemInner}>
        <div className={styles.descriptionText}>{expense.description}</div>
        <div className={styles.amountText}>${expense.amount.toFixed(2)}</div>
      </Link>
    </li>
  );
}

export default ExpenseRow;
