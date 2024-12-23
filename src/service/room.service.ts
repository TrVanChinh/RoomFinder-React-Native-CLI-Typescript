import { IAddress } from "../type/address.interface";
import { IDeposit, IRoom, RoomInfo } from "../type/room.interface";
import axiosInstance from "./axiosInstance";
interface IInterior {
    label: string;
    column: string;
    value: boolean;
  }


interface deposit {
    phiDatCoc: number;
    thoiHanDatCoc: number;
    donViThoiGian: string;
  }

const handleCreateInterior = async(interior: IInterior[]) => {
    try {
        const dataInterior = interior.reduce((acc, item) => {
            acc[item.column] = item.value;
            return acc;
          }, {} as Record<string, boolean>);
      
        const response = await axiosInstance.post("/api/interior/addNew", dataInterior);
        return response.data.maNoiThat;
    } catch (error) {
        console.error("Lỗi khởi tạo dữ liệu nội thất phòng trọ:", error); 
  }
};

const handleCreateDeposit = async(deposit: deposit[], maPhong: number) => {
    try {
        const dataDepost = {
            maPhong: maPhong,
            data: deposit
        }
      
        const response = await axiosInstance.post("/api/deposit/addNew", dataDepost);
        return response.data;

    } catch (error) {
        console.error("Lỗi khởi tạo dữ phí đặt cọc phòng:", error); 
  }
};

const createOneDeposit = async(deposit: deposit, maPhong: number) => {
    try {
        const dataDepost = {
            maPhong: maPhong,
            data: deposit
        }
        const response = await axiosInstance.post("/api/deposit/addANewOne", dataDepost);
        return response.data;
    } catch (error) {
        console.error("Lỗi tạo dữ phí đặt cọc phòng:", error); 
  }
};

const createRoom = async( roomData: IRoom) => {
    try {
        const response = await axiosInstance.post("/api/room/addNew", roomData);
        return response.data
    } catch (error) {
        console.error("Lỗi khởi tạo phòng trọ:", error);
    }
}

const getRoomByIdUser = async (userId: string) =>{
    try {
        const response = await axiosInstance.get(`/api/room/user/${userId}`);
        return response.data
    } catch (error) {
        console.error("Lỗi khởi tạo phòng trọ:", error);
    }
}

const getRoomByDistrict = async (district: string) =>{
    try {
        const response = await axiosInstance.get('/api/room/address/district', {
            params: { district }, // Gửi qua query parameters
        });

        // if (response.data) {
        //     console.log('Danh sách phòng:', response.data);
        // }
        return response.data; 
    } catch (error) {
        console.error("Lỗi khởi tạo phòng trọ:", error);
    }
}

const getDepositByRoom = async (roomId: string) =>{
    try { 
        const response = await axiosInstance.get(`/api/deposit/room/${roomId}`);
        return response.data
    } catch (error) {
        console.error("Lỗi khởi tạo phòng trọ:", error);
    }
}

const updateInterior = async (interiorId: number, interior: IInterior[]) => { 
    try {
        const dataInterior = interior.reduce((acc, item) => {
            acc[item.column] = item.value;
            return acc;
          }, {} as Record<string, boolean>);
        const data = {...dataInterior, maNoiThat: interiorId}
        console.log("nội thất:", data)
        const response = await axiosInstance.put("/api/interior/update", data);
        return response.data.maNoiThat;
    } catch (error) {
        console.error("Lỗi update dữ liệu nội thất phòng trọ:", error);
        throw new Error("Lỗi cập nhật nội thất phòng ."); 
  }
}

const updateBasicInfoRoom = async (room: IRoom) => { 
    try {
        const response = await axiosInstance.put("/api/room/updateBasicRoomInfo", room);
    } catch (error) {
        console.error("Lỗi cập nhật phòng :", error); 
        throw new Error("Lỗi cập nhật phòng .");
  }
}

const updateDeposit = async (depositId: string, depositData: IDeposit) => { 
    try {
        await axiosInstance.put(`/api/deposit/update/${depositId}`, depositData)
    } catch (error) {
        console.error("Lỗi cập nhật thông tin đặt cọc :", error); 
        throw new Error("Lỗi cập nhật thông tin đặt cọc.");
    }
}

const deleteDeposit = async (depositId: string) => { 
    try {
        await axiosInstance.delete(`/api/deposit/delete/${depositId}`)
    } catch (error) {
        console.error("Lỗi xóa thông tin đặt cọc :", error); 
        throw new Error("Lỗi xóa thông tin đặt cọc.");
    }
}

export const roomService = {
    handleCreateInterior,
    handleCreateDeposit,
    createOneDeposit,
    createRoom,
    getRoomByIdUser,
    getDepositByRoom,
    getRoomByDistrict,
    updateInterior,
    updateBasicInfoRoom,
    deleteDeposit,
    updateDeposit
}