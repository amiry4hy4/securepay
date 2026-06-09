import React, { createContext, useState, useEffect } from 'react';

// Create AppContext
export const AppContext = createContext();

export function AppProvider({ children }) {
  // Initialize state from localStorage if available
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('securepay_currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem('securepay_balance');
    return savedBalance ? Number(savedBalance) : 1000000; // default balance (Rp 1.000.000) for demo
  });

  const [transactions, setTransactions] = useState(() => {
    const savedTx = localStorage.getItem('securepay_transactions');
    return savedTx ? JSON.parse(savedTx) : [];
  });

  // Sync state to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('securepay_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('securepay_currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('securepay_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('securepay_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Auth functions
  const login = (userData) => {
    setCurrentUser(userData);
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('securepay_aesKey'); // clear session storage key as well
  };

  // State update helpers
  const updateBalance = (newBalance) => {
    setBalance(newBalance);
  };

  const addTransaction = (tx) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        balance,
        transactions,
        login,
        logout,
        updateBalance,
        addTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
