import { createContext } from "react";

interface UserLocation {
  latitude: number;
  longitude: number;
}

// Giá trị mặc định ban đầu cho context
const defaultLocation: UserLocation = {
  latitude: 0,
  longitude: 0,
};

export const UserLocationContext = createContext<UserLocation>(defaultLocation);
