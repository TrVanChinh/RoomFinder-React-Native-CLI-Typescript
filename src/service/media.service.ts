import { IMedia } from "../type/media.interface";
import axiosInstance from "./axiosInstance";
import axiosMedia from "./axiosMedia";

const uploadAvatar = async (avatar: string) => {
  const formData = new FormData();
  formData.append('avatar', {
    uri: avatar,
    type: 'image/jpeg',
    name: 'image.jpg',
  });

  try {
    const response = await axiosMedia.post(`/api/media/upload/avatar`, formData);
    return response.data;
  } catch (error) {
    console.error('Failed to upload images:', error);
    throw error;
  }
};

const uploadCCCDImages = async (frontImage: string, backImage: string) => {
  const formData = new FormData();
  formData.append('matTruocCCCD', {
    uri: frontImage,
    type: 'image/jpeg',
    name: 'image.jpg',
  });
  formData.append('matSauCCCD', {
    uri: backImage,
    type: 'image/jpeg',
    name: 'image.jpg',
  });

  try {
    const response = await axiosMedia.post(`/api/v1/users/upload/cccd`, formData);
    console.log('Upload successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to upload images:', error);
    throw error;
  }
};

const uploadRoomImage = async (images: string[]) => {
  const formData = new FormData();
  for (let index = 0; index < images.length; index++) { 
    const imageUri = images[index];
    formData.append('roomImages', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `image-${index}.jpg`,
    });
  }
 
  try {
    const response = await axiosMedia.post(`/api/room/upload/images`, formData);
    console.log('Upload successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Tải ảnh phòng lỗi:', error);
    throw error;
  }
};

const uploadRoomVideo = async (videos: string[]) => {
  const formData = new FormData();
  videos.forEach((video, index) => {
    formData.append('roomVideos', {
      uri: video,
      type: 'video/mp4',
      name: `video-${index}.mp4`, 
    } as any); 
  });
 
  try {
    const response = await axiosMedia.post(`/api/room/upload/videos`, formData);
    console.log('Upload successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Tải video phòng lỗi:', error);
    throw error;
  }
};

const addMedia = async( maPhong:number, maDanhMucHinhAnh: number, loaiTep:string, data: string[]) => {
  try {
    const dataMedia = {
        maPhong: maPhong,
        maDanhMucHinhAnh: maDanhMucHinhAnh,
        loaiTep: loaiTep,
        data: data
    }
  
    const response = await axiosInstance.post("/api/media/addNew", dataMedia);
    return response.data;

} catch (error) {
    console.error("Lỗi khởi tạo dữ hình ảnh phòng:", error); 
}
}

const updateMediaofRoom = async( deleteMedia:IMedia[], createMedia:IMedia[]) => {
  try { 
    console.log("deleteMedia:", deleteMedia)
    console.log("createMedia:", createMedia)

    const response = await axiosInstance.put("/api/media/updateMediaOfRoom",{ deleteMedia, createMedia} );
} catch (error) {
    console.error("Lỗi cập nhật hình ảnh phòng:", error); 
}
}

const updateAvatar = async( userId:string, AvatarUri: string) => {
  try { 
    const response = await axiosInstance.put(`/api/media/updateAvatar/user/${userId}`, AvatarUri );
} catch (error) {
    console.error("Lỗi cập nhật hình đại diện:", error); 
}
}

export const mediaService = {
    uploadCCCDImages,
    uploadRoomImage,
    uploadRoomVideo,
    addMedia,
    updateMediaofRoom,
    uploadAvatar,
    updateAvatar,
}
