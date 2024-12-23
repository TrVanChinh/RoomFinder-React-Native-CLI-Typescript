import  IUser from "../type/user.interface";
import axiosInstance from "./axiosInstance";

// const getInfoUser = async (userId: string) =>{
//     try {
//         const response = await axiosInstance.get(`/api/room/user/${userId}`);
//         return response.data
//     } catch (error) {
//         console.error("Lỗi khởi tạo phòng trọ:", error);
//     }
// }

const updateUser = async () => { 
//     try {
//         const dataInterior = interior.reduce((acc, item) => {
//             acc[item.column] = item.value;
//             return acc;
//           }, {} as Record<string, boolean>);
//         const data = {...dataInterior, maNoiThat: interiorId}
//         console.log("nội thất:", data)
//         const response = await axiosInstance.put("/api/interior/update", data);
//         return response.data.maNoiThat;
//     } catch (error) {
//         console.error("Lỗi update dữ liệu nội thất phòng trọ:", error);
//         throw new Error("Lỗi cập nhật nội thất phòng ."); 
//   }
}


export const userService = {
    updateUser
}