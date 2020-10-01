import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import ExpenseRow from "../../components/Expense/Row";
import LoadingIndicator from "../../components/LoadingIndicator";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "../../components/Button";
import { useNotifications } from "../../components/Notifications";
import request from "../../request";

import styles from "./Edit.module.css";

function AccountForm({ account, onSave, disabled, onDelete }) {
  const [changes, setChanges] = useState({});

  function changeField(field, value) {
    setChanges({
      ...changes,
      [field]: value,
    });
  }

  const formData = {
    ...account,
    ...changes,
  };

  function handleSubmit(event) {
    event.preventDefault();
    onSave(changes);
  }

  return (
    <form autoComplete={"off"} onSubmit={handleSubmit} className={styles.form}>
      <fieldset disabled={disabled ? "disabled" : undefined}>
        {account.id && (
          <div className={styles.formRow}>
            <label htmlFor="balance">Balance</label>
            <span id="balance">${account.balance}</span>
          </div>
        )}

        <div className={styles.formRow}>
          <label htmlFor="name">Name</label>
          <input
            required
            id={"name"}
            type={"text"}
            value={formData.name}
            onChange={(event) => changeField("name", event.target.value)}
          />
        </div>

        <div className={styles.formRow}>
          <label htmlFor="number">Number</label>
          <input
            required
            id={"number"}
            type={"text"}
            value={formData.number}
            onChange={(event) => changeField("number", event.target.value)}
          />
        </div>
      </fieldset>

      <div className={styles.formFooter}>
        {account.id && (
          <Button action={onDelete} kind={"danger"} disabled={disabled}>
            Delete
          </Button>
        )}
        <Button
          type={"submit"}
          disabled={Object.keys(changes).length === 0 || disabled}
        >
          Save
        </Button>
      </div>
    </form>
  );
}

const defaultAccountData = {
  name: "",
  number: "",
};

function AccountExpenseList({ expenses }) {
  if (!expenses || !expenses.length) return null;

  return (
    <>
      <h3>Expenses</h3>
      <ul className={styles.expenseList}>
        {expenses.map((expense) => (
          <ExpenseRow key={expense.id} expense={expense} />
        ))}
      </ul>
    </>
  );
}

function AccountEdit() {
  const { id } = useParams();
  const history = useHistory();
  const [account, setAccount] = useState(id ? null : defaultAccountData);
  const [loadingStatus, setLoadingStatus] = useState(id ? "loading" : "loaded");
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const { notifyError } = useNotifications();

  useEffect(
    function () {
      async function loadAccount() {
        try {
          const response = await request(`/accounts/${id}`, {
            method: "GET",
          });
          if (response.ok) {
            setAccount(response.body);
            setLoadingStatus("loaded");
          } else {
            setLoadingStatus("error");
          }
        } catch (error) {
          setLoadingStatus("error");
        }
      }

      if (id) {
        loadAccount();
      }
    },
    [id]
  );

  async function handleSave(changes) {
    try {
      setSaving(true);
      const url = account.id ? `/accounts/${account.id}` : "/accounts";
      const method = account.id ? "PATCH" : "POST";
      const body = account.id ? changes : { ...defaultAccountData, ...changes };
      const response = await request(url, {
        method,
        body,
      });
      if (response.ok) {
        setAccount(response.body);
      } else {
        notifyError("Failed to save account. Please try again");
      }
    } catch (error) {
      notifyError(
        "Failed to save account. Please check your internet connection"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure to want to delete this account? It will also delete all the associated expenses.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await request(`/accounts/${account.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        history.push("/accounts");
      } else {
        notifyError("Failed to delete account. Please try again");
      }
    } catch (error) {
      notifyError(
        "Failed to delete account. Please check your internet connection"
      );
    } finally {
      setDeleting(false);
    }
  }

  let content;
  if (loadingStatus === "loading") {
    content = <LoadingIndicator />;
  } else if (loadingStatus === "loaded") {
    content = (
      <>
        <AccountForm
          key={account.updated_at}
          account={account}
          onSave={handleSave}
          disabled={isSaving || isDeleting}
          onDelete={handleDelete}
        />
        <AccountExpenseList expenses={account.expenses} />
      </>
    );
  } else if (loadingStatus === "error") {
    content = <ErrorMessage />;
  } else {
    throw new Error(`Unexpected loadingStatus: ${loadingStatus}`);
  }

  return <div>{content}</div>;
}

export default AccountEdit;
