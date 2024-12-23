import React, { createContext, useContext, useState, ReactNode } from 'react';
import {IAddress } from '../type/address.interface';
  
  interface AddressContextType {
    address: IAddress | null;
    setAddress: React.Dispatch<React.SetStateAction<IAddress | null>>;
  }
  
  const AddressContext = createContext<AddressContextType | undefined>(undefined);
  
  export const AddressProvider = ({ children }: { children: ReactNode }) => {
    const [address, setAddress] = useState<IAddress | null>(null);
  
    return (
      <AddressContext.Provider value={{ address, setAddress }}>
        {children}
      </AddressContext.Provider>
    );
  };
  
  export const useAddress = () => {
    const context = useContext(AddressContext);
    if (!context) {
      throw new Error("useAddress must be used within an AddressProvider");
    }
    return context;
  };
  