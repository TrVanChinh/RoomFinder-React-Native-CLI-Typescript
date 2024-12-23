import { IAddress } from "../type/address.interface";
import axiosInstance from "./axiosInstance";

const handleCreateRoomAddress = async(address: IAddress): Promise<number> => {
    try {
      const response = await axiosInstance.post("/api/address/addNew", address);
      // console.log("Service: ",response.data.maDiaChi)
      const maDiaChi = response.data.maDiaChi
      return maDiaChi;
    } catch (error) {
        console.error("Lỗi khởi tạo địa chỉ phòng trọ:", error); 
        throw new Error("Không thể tạo địa chỉ phòng trọ.");
  }
};
const getAddress = async (addressId: string) => {
  try {
    const response = await axiosInstance.get(`/api/address/${addressId}`);
    const address = response.data;
    return address;
  } catch (error) {
    console.error("Lỗi lấy địa chỉ phòng trọ:", error);
    throw new Error("Không thể lấy địa chỉ chỉ phòng trọ.");
  }
}
const updateAddress = async(address: IAddress, addressId: number) => {
  try {
    const data = { ...address, maDiaChi: addressId }; 
    console.log("data address:", data)
    const response = await axiosInstance.put("/api/address/update", data);
    const maDiaChi = response.data.maDiaChi
    return maDiaChi;
  } catch (error) {
    console.error("Lỗi cập nhật địa chỉ phòng :", error); 
    throw new Error("Lỗi cập nhật địa chỉ phòng .");
  }
}

export const addressService = {
    handleCreateRoomAddress,
    getAddress,
    updateAddress
}

