import IRegister from "../type/register.interface";
import { IRoom, RoomInfo } from "../type/room.interface";
import IUser from "../type/user.interface";

export type RootStackParamList = {
    Main: undefined;
    Home: undefined;
    Message: undefined;
    Map: undefined;
    Notification: undefined;
    Profile: undefined;
    Login: undefined;
    Register: undefined;
    RegisterRoomMaster: undefined;
    Search: undefined;
    Verify: {"verifiedAccountType": string};
    IdCard: IRegister;
    UserInfo: undefined;
    Address: undefined;
    AddressRoom: {fromScreen: string};
    CreateRoom: undefined;
    ListRoom: undefined;
    UpdateRoom: RoomInfo;
    AddMedia: undefined;
    Detail: { roomInfo: RoomInfo; fromScreen: string };
    GeneralInfor: undefined;
    Media: RoomInfo;
    DepositFee: RoomInfo;
    UpdatePassword: undefined
    // Detail: { data: any };
  };

// type HomeScreenParam = {
//     title: string;
// }

// type MessageScreenParam = {
//     title: string;
// }   

// type LoginScreenParam = { 
//     title: string
// }

// type RegisterScreenParam = { 
//     title: string
// }

// type RegisterRoomMasterParam = { 
//     title: string
// }

// export type RootStackParamList = { 
//     Home: HomeScreenParam;
//     Login: LoginScreenParam;
//     Register: RegisterScreenParam;
//     RegisterRoomMaster: RegisterRoomMasterParam;
// }