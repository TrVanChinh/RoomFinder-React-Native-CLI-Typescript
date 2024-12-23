import { UserProvider } from './UserContext';
import { AddressProvider } from './AddressContext';
import { RoomUpdateProvider } from './UpdateRoomContext';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <RoomUpdateProvider>
        <AddressProvider>
          {children}
        </AddressProvider>
      </RoomUpdateProvider>
    </UserProvider>
  );
};
