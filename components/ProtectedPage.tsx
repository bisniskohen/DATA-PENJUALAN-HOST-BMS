import React from 'react';
import { useLock } from '../contexts/LockContext';
import LockScreen from './LockScreen';

interface ProtectedPageProps {
  children: React.ReactNode;
}

const ProtectedPage: React.FC<ProtectedPageProps> = ({ children }) => {
  const { isUnlocked } = useLock();

  if (!isUnlocked) {
    return <LockScreen />;
  }

  return <>{children}</>;
};

export default ProtectedPage;
