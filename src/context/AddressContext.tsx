import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Address {
    street: string;
    city: string;
    country: string;
  }
  
  interface AddressContextType {
    address: Address | null;
    setAddress: React.Dispatch<React.SetStateAction<Address | null>>;
  }
  
  const AddressContext = createContext<AddressContextType | undefined>(undefined);
  
  export const AddressProvider = ({ children }: { children: ReactNode }) => {
    const [address, setAddress] = useState<Address | null>(null);
  
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
  