import { UserProvider } from './UserContext';
import { AddressProvider } from './AddressContext';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
        <AddressProvider>
            {children}
        </AddressProvider>
    </UserProvider>
  );
};
