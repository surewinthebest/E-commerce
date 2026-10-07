import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';


type NetworkContextType = {
  isOffline: boolean;
  isServerDown: boolean;
  setIsServerDown: (status: boolean) => void;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const netInfo = useNetInfo();
  const [isServerDown, setIsServerDown] = useState(false);

  // Derive offline state automatically from the hook
  const isOffline = netInfo.isConnected === false || netInfo.isInternetReachable === false;

  return (
    <NetworkContext.Provider value={{ isOffline, isServerDown, setIsServerDown }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};