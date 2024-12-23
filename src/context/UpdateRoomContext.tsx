import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RoomInfo } from '../type/room.interface';

// Định nghĩa kiểu dữ liệu cho context
interface RoomUpdateContextType {
  roomUpdate: RoomInfo | null;
  setRoomUpdate: React.Dispatch<React.SetStateAction<RoomInfo | null>>;
}

const RoomUpdateContext = createContext<RoomUpdateContextType | undefined>(undefined);

export const RoomUpdateProvider = ({ children }: { children: ReactNode }) => {
  const [roomUpdate, setRoomUpdate] = useState<RoomInfo | null>(null);

  return (
    <RoomUpdateContext.Provider value={{ roomUpdate, setRoomUpdate }}>
      {children}
    </RoomUpdateContext.Provider>
  );
};

export const useRoomUpdate = () => {
  const context = useContext(RoomUpdateContext);
  if (!context) {
    throw new Error("useRoomUpdate must be used within a RoomUpdateProvider");
  }
  return context;
};
