import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { useAppContext } from './AppContext';

// A simple XOR cipher for light obfuscation. Not for high security.
const cipher = (salt: string) => {
    const textToChars = (text: string) => text.split('').map((c) => c.charCodeAt(0));
    const byteHex = (n: number) => ('0' + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code: number) => textToChars(salt).reduce((a, b) => a ^ b, code);

    return {
        encode: (text: string) => textToChars(text).map(applySaltToChar).map(byteHex).join(''),
        decode: (encoded: string) => encoded.match(/.{1,2}/g)?.map((hex) => parseInt(hex, 16)).map(applySaltToChar).map((charCode) => String.fromCharCode(charCode)).join('') || '',
    };
};
const { encode, decode } = cipher('sales-tracker-secret-key');


interface LockContextType {
  isUnlocked: boolean;
  isPasswordSet: boolean;
  unlock: (passwordAttempt: string) => boolean;
  lock: () => void;
  setPassword: (newPassword: string) => void;
  checkPassword: (passwordAttempt: string) => boolean;
  clearPassword: (passwordAttempt: string) => boolean;
}

const LockContext = createContext<LockContextType | undefined>(undefined);

export const LockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state, setState } = useAppContext();
  const { app_password: storedPassword } = state;

  const [isUnlocked, setIsUnlocked] = useState(false);
  const isPasswordSet = !!decode(storedPassword);

  useEffect(() => {
    if (!isPasswordSet) {
      setIsUnlocked(true);
    } else {
      // Keep unlocked state within the same browser session
      if (sessionStorage.getItem('isUnlockedSession') === 'true') {
        setIsUnlocked(true);
      } else {
        setIsUnlocked(false);
      }
    }
  }, [isPasswordSet]);


  const unlock = useCallback((passwordAttempt: string) => {
    if (passwordAttempt === decode(storedPassword)) {
      setIsUnlocked(true);
      sessionStorage.setItem('isUnlockedSession', 'true');
      return true;
    }
    return false;
  }, [storedPassword]);

  const lock = () => {
    if (isPasswordSet) {
        setIsUnlocked(false);
        sessionStorage.removeItem('isUnlockedSession');
    }
  };

  const setPassword = (newPassword: string) => {
    setState(prev => ({ ...prev, app_password: encode(newPassword) }));
    setIsUnlocked(true);
    sessionStorage.setItem('isUnlockedSession', 'true');
  };
  
  const checkPassword = (passwordAttempt: string) => {
    return passwordAttempt === decode(storedPassword);
  }

  const clearPassword = (passwordAttempt: string) => {
    if (checkPassword(passwordAttempt)) {
        setState(prev => ({ ...prev, app_password: '' }));
        setIsUnlocked(true);
        sessionStorage.removeItem('isUnlockedSession');
        return true;
    }
    return false;
  }

  return (
    <LockContext.Provider value={{ isUnlocked, isPasswordSet, unlock, lock, setPassword, checkPassword, clearPassword }}>
      {children}
    </LockContext.Provider>
  );
};

export const useLock = (): LockContextType => {
  const context = useContext(LockContext);
  if (!context) {
    throw new Error('useLock must be used within a LockProvider');
  }
  return context;
};