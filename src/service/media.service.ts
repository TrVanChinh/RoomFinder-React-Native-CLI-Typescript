import axiosMedia from "./axiosMedia";

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
    console.error('Failed to upload images:', error);
    throw error;
  }
};

const uploadRoomVideo = async (videos: string[]) => {
  const formData = new FormData();
  videos.forEach((video, index) => {
    formData.append('roomVideos', {
      uri: video,
      type: 'image/jpeg', 
      name: `image-${index}.jpg`, 
    } as any); 
  });
 
  try {
    const response = await axiosMedia.post(`/api/room/upload/images`, formData);
    console.log('Upload successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to upload images:', error);
    throw error;
  }
};

export const mediaService = {
    uploadCCCDImages,
    uploadRoomImage,
    uploadRoomVideo
}
