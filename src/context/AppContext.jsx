/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useEffect } from 'react';
import { encryptData, decryptData } from '../utils/crypto';

// Create AppContext
export const AppContext = createContext();

const savedUsers = localStorage.getItem('securepay_users');
const initialUsers = savedUsers ? JSON.parse(savedUsers) : [];

const savedUser = localStorage.getItem('securepay_currentUser');
const initialCurrentUser = savedUser ? JSON.parse(savedUser) : null;

const initialTransactions = initialCurrentUser
  ? JSON.parse(localStorage.getItem(`securepay_transactions_${initialCurrentUser.username}`) || '[]')
  : [];

const initialState = {
  users: initialUsers,
  currentUser: initialCurrentUser,
  balance: 0, // In-memory decrypted balance, defaults to 0 and auto-loads/decrypts on login
  transactions: initialTransactions,
  aesKey: sessionStorage.getItem('securepay_aesKey') || null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'REGISTER_USER': {
      const userExists = state.users.some(u => u.username === action.payload.username);
      const newUsers = userExists
        ? state.users.map(u => u.username === action.payload.username ? action.payload : u)
        : [...state.users, action.payload];
      return {
        ...state,
        users: newUsers
      };
    }
    case 'LOGIN': {
      const userTx = localStorage.getItem(`securepay_transactions_${action.payload.username}`);
      return {
        ...state,
        currentUser: action.payload,
        transactions: userTx ? JSON.parse(userTx) : [],
        aesKey: sessionStorage.getItem('securepay_aesKey') || state.aesKey
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        currentUser: null,
        transactions: [],
        aesKey: null,
        balance: 0
      };
    }
    case 'SET_AES_KEY': {
      return {
        ...state,
        aesKey: action.payload
      };
    }
    case 'UPDATE_BALANCE': {
      return {
        ...state,
        balance: action.payload
      };
    }
    case 'ADD_TRANSACTION': {
      const updatedTx = [action.payload, ...state.transactions];
      return {
        ...state,
        transactions: updatedTx
      };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Sync users to localStorage
  useEffect(() => {
    localStorage.setItem('securepay_users', JSON.stringify(state.users));
  }, [state.users]);

  // Sync currentUser to localStorage
  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem('securepay_currentUser', JSON.stringify(state.currentUser));
    } else {
      localStorage.removeItem('securepay_currentUser');
    }
  }, [state.currentUser]);

  // Sync transactions to localStorage
  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem(
        `securepay_transactions_${state.currentUser.username}`,
        JSON.stringify(state.transactions)
      );
    }
  }, [state.transactions, state.currentUser]);

  // Auto-decrypt and load balance on login/mount
  useEffect(() => {
    const loadAndDecryptBalance = async () => {
      if (state.currentUser) {
        const username = state.currentUser.username;
        const key = sessionStorage.getItem('securepay_aesKey') || state.aesKey;
        if (key) {
          const encryptedDataStr = localStorage.getItem(`securepay_balance_${username}`);
          if (encryptedDataStr) {
            try {
              const { cipher, iv } = JSON.parse(encryptedDataStr);
              const decryptedStr = await decryptData(cipher, iv, key);
              const decryptedNum = Number(decryptedStr);
              if (!isNaN(decryptedNum)) {
                dispatch({ type: 'UPDATE_BALANCE', payload: decryptedNum });
              }
            } catch (err) {
              console.error('Failed to auto-decrypt balance:', err);
            }
          } else {
            // New user scenario: initialize encrypted balance to 1,000,000
            try {
              const encrypted = await encryptData('1000000', key);
              localStorage.setItem(`securepay_balance_${username}`, JSON.stringify(encrypted));
              dispatch({ type: 'UPDATE_BALANCE', payload: 1000000 });
            } catch (err) {
              console.error('Failed to initialize balance:', err);
            }
          }
        }
      } else {
        dispatch({ type: 'UPDATE_BALANCE', payload: 0 });
      }
    };

    loadAndDecryptBalance();
  }, [state.currentUser, state.aesKey]);

  // User registration helper
  const registerUser = async (user, aesKey) => {
    dispatch({ type: 'REGISTER_USER', payload: user });
    if (aesKey) {
      sessionStorage.setItem('securepay_aesKey', aesKey);
      dispatch({ type: 'SET_AES_KEY', payload: aesKey });
      
      // Persist starting balance of 1,000,000 encrypted
      try {
        const encrypted = await encryptData('1000000', aesKey);
        localStorage.setItem(`securepay_balance_${user.username}`, JSON.stringify(encrypted));
        dispatch({ type: 'UPDATE_BALANCE', payload: 1000000 });
      } catch (err) {
        console.error('Failed to encrypt initial balance on registration:', err);
      }
    }
  };

  // Auth functions
  const login = (username, passwordHash) => {
    const userToLogin = (typeof username === 'object' && username !== null)
      ? username
      : state.users.find(
          u => u.username === username && (!passwordHash || u.passwordHash === passwordHash)
        );

    if (userToLogin) {
      dispatch({ type: 'LOGIN', payload: userToLogin });
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('securepay_aesKey');
    dispatch({ type: 'LOGOUT' });
  };

  // State update helpers
  const updateBalance = async (newBalance) => {
    const username = state.currentUser?.username;
    if (!username) return;

    const key = sessionStorage.getItem('securepay_aesKey') || state.aesKey;
    if (key) {
      try {
        const encrypted = await encryptData(newBalance.toString(), key);
        localStorage.setItem(`securepay_balance_${username}`, JSON.stringify(encrypted));
      } catch (err) {
        console.error('Failed to encrypt balance:', err);
      }
    }
    dispatch({ type: 'UPDATE_BALANCE', payload: Number(newBalance) });
  };

  const addTransaction = (tx) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: tx });
  };

  const getDecryptedBalance = async () => {
    const username = state.currentUser?.username;
    if (!username) return 0;

    const key = sessionStorage.getItem('securepay_aesKey') || state.aesKey;
    if (!key) {
      return state.balance;
    }

    const encryptedDataStr = localStorage.getItem(`securepay_balance_${username}`);
    if (!encryptedDataStr) {
      return 1000000;
    }

    try {
      const { cipher, iv } = JSON.parse(encryptedDataStr);
      const decryptedStr = await decryptData(cipher, iv, key);
      const decryptedNum = Number(decryptedStr);
      if (!isNaN(decryptedNum)) {
        dispatch({ type: 'UPDATE_BALANCE', payload: decryptedNum });
        return decryptedNum;
      }
    } catch (err) {
      console.error('Error decrypting balance:', err);
    }
    return state.balance;
  };

  return (
    <AppContext.Provider
      value={{
        users: state.users,
        currentUser: state.currentUser,
        balance: state.balance,
        transactions: state.transactions,
        aesKey: state.aesKey,
        registerUser,
        login,
        logout,
        updateBalance,
        addTransaction,
        getDecryptedBalance
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
