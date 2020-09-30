import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "../../components/Button";
import request from "../../request";

import styles from "./List.module.css";

function AccountRow({ account }) {
  return (
    <li className={styles.item}>
      <Link to={`/account/${account.id}`} className={styles.itemInner}>
        <div className={styles.nameText}>{account.name}</div>
        <div className={styles.balanceText}>${account.balance.toFixed(2)}</div>
      </Link>
    </li>
  );
}

function AccountList({ accounts }) {
  const newAccountButton = <Button to={"/account/new"}>New Account</Button>;

  if (accounts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateMessage}>
          You don't have any accounts.
        </div>
        <div>{newAccountButton}</div>
      </div>
    );
  }

  return (
    <>
      <ul className={styles.list}>
        {accounts.map((account) => (
          <AccountRow key={account.id} account={account} />
        ))}
      </ul>

      <div className={styles.actions}>{newAccountButton}</div>
    </>
  );
}

function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(function () {
    async function loadAccounts() {
      const response = await request("/accounts", {
        method: "GET",
      });
      if (response.ok) {
        setAccounts(response.body);
        setStatus("loaded");
      } else {
        setStatus("error");
      }
    }

    loadAccounts();
  }, []);

  let content;
  if (status === "loading") {
    content = <LoadingIndicator />;
  } else if (status === "loaded") {
    content = <AccountList accounts={accounts} />;
  } else if (status === "error") {
    content = <ErrorMessage />;
  } else {
    throw new Error(`Unexpected status: ${status}`);
  }

  return content;
}

export default AccountsPage;
