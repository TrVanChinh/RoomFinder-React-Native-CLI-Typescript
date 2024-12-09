import IRegister from "../type/register.interface";
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
    CreateRoom: undefined;
    AddMedia: undefined;
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