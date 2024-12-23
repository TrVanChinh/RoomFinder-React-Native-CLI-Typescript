import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAddress } from '../../../context/AddressContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker';
import { Icon } from '@rneui/themed';
import colors from '../../../constants/colors';
import Video from 'react-native-video';
import { IMedia } from '../../../type/media.interface';
import { createThumbnail } from "react-native-create-thumbnail";
import { MediaFormat } from '../../../type/room.interface';
import { mediaService } from '../../../service';

interface ImageOptions {
  mediaType: MediaType;
  selectionLimit: number;
}

type MediaScreenProps = NativeStackScreenProps<RootStackParamList, 'Media'>;

const MediaScreen: React.FC<MediaScreenProps> = ({ navigation, route }) => {
  const room = route.params;
  const [roomId, setRoomId] = useState<number>()
  const [listMediaRoom, setListMediaRoom] = useState<MediaFormat[]>([])
  const [video, setVideo] = useState<string[]>([])
  const [roomImages, setRoomImages] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string[]>([]);
  const [hinhAnhQuyenSuDungDat, setHinhAnhQuyenSuDungDat] = useState<string[]>([]);
  const [hinhAnhGiayPhepKinhDoanh, setHinhAnhGiayPhepKinhDoanh] = useState<string[]>([]);
  const [hinhAnhGiayPhongChay, setHinhAnhGiayPhongChay] = useState<string[]>([]);
  const [deleteMedia, setDeleteMedia] = useState<IMedia[]>([]);
  const [addMedia, setAddMedia] = useState<IMedia[]>([]);

  const generateThumbnail = async (videoUri: string) => {
    try {
      const result = await createThumbnail({
        url: videoUri,
        timeStamp: 1000,
      });
      setThumbnail((thumbnail) => [...thumbnail, result.path])
    } catch (error) {
      console.error('Error tạo thumbnail:', error);
    }
  };

  const SaveTheNewMedia = (maDanhMucHinhAnh: number, loaiTep: string, duongDan: string) => {
    if(room) {
      const dataMedia = {
        maHinhAnh: 0,
        maPhong: room.maPhong,
        maDanhMucHinhAnh: maDanhMucHinhAnh,
        loaiTep: loaiTep,
        duongDan: duongDan,
      }
      setAddMedia((prevMedia) => [...prevMedia, dataMedia])
    } 
    
  }

  const saveDeleteMedia = (duongDan: string) => {
      const media = listMediaRoom.find(media => media.duongDan == duongDan)
      if (media) { 
        let danhMucHinhAnhId = 0
        if (media.danhMucHinhAnh === "Hình ảnh căn phòng") {
          danhMucHinhAnhId = 1
        } else if (media.danhMucHinhAnh === "Giấy chứng nhận quyền sử dụng đất") {
          danhMucHinhAnhId = 2
        } else if (media.danhMucHinhAnh === "Giấy chứng nhận đủ điều kiện về phòng cháy chữa cháy") {
          danhMucHinhAnhId = 3
        } else {
          danhMucHinhAnhId = 4
        }
        const dataMedia = {
          maHinhAnh: 0,
          maPhong: room.maPhong,
          maDanhMucHinhAnh: danhMucHinhAnhId,
          loaiTep: media.loaiTep,
          duongDan: duongDan,
        }
        setDeleteMedia((prevMedia) => [...prevMedia, dataMedia])
      } else {
        setAddMedia((prevMedia) => prevMedia.filter((media) => media.duongDan !== duongDan));
      }
    } 

  const handleSelectImage = async (
    setImage: React.Dispatch<React.SetStateAction<string[]>>,
    mediaType: MediaType,
    maDanhMucHinhAnh: number,
    loaiTep: string
  ) => {
    Alert.alert(
      'Tải ảnh và video từ thiết bị',
      'Bạn muốn chọn ảnh từ đâu?',
      [
        {
          text: 'Chụp bằng Camera',
          onPress: () => {
            launchCamera(
              { mediaType: mediaType, cameraType: 'back' },
              (response) => {
                if (response.didCancel) {
                  Alert.alert('Hủy', 'Bạn đã hủy chụp ảnh');
                } else if (response.errorCode) {
                  Alert.alert('Lỗi', `Mã lỗi: ${response.errorCode}`);
                  console.log(response.errorCode)
                } else if (response.assets && response.assets.length > 0) {
                  const selectedImages = response.assets.map((asset) => asset.uri || '');
                  setImage((prevImages) => {
                    if (mediaType == 'photo' && prevImages.length + selectedImages.length > 10) {
                      Alert.alert('Thông báo', 'Tối đa 10 ảnh!');
                      return prevImages;
                    }
                    if (mediaType == 'video' && prevImages.length + selectedImages.length > 2) {
                      Alert.alert('Thông báo', 'Tối đa 2 video!');
                      return prevImages;
                    }
                    selectedImages.forEach((uri) => {
                      SaveTheNewMedia(maDanhMucHinhAnh, loaiTep, uri);
                      if (mediaType === 'video') {
                        generateThumbnail(uri);
                      }
                    });
                    return [...prevImages, ...selectedImages];
                  });
                }
              }
            );
          },
        },
        {
          text: 'Chọn từ Thư viện',
          onPress: () => {
            launchImageLibrary({ mediaType: mediaType }, (response) => {
              if (response.didCancel) {
                Alert.alert('Hủy', 'Bạn đã hủy chọn ảnh');
              } else if (response.errorCode) {
                Alert.alert('Lỗi', `Mã lỗi: ${response.errorCode}`);
              } else if (response.assets && response.assets.length > 0) {
                const selectedImages = response.assets.map((asset) => asset.uri || '');
                setImage((prevImages) => {
                  if (mediaType == 'photo' && prevImages.length + selectedImages.length > 10) {
                    Alert.alert('Thông báo', 'Tối đa 10 ảnh!');
                    return prevImages;
                  }
                  if (mediaType == 'video' && prevImages.length + selectedImages.length > 2) {
                    Alert.alert('Thông báo', 'Tối đa 2 video!');
                    return prevImages;
                  }
                  selectedImages.forEach((uri) => {
                    SaveTheNewMedia(maDanhMucHinhAnh, loaiTep, uri);
                    if (mediaType === 'video') {
                      generateThumbnail(uri);
                    }
                  });
                  return [...prevImages, ...selectedImages];
                });
              }
            });
          },
        },
        { text: 'Hủy', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const deleteImageItem = async (
    setImages: React.Dispatch<React.SetStateAction<string[]>>,
    imageUri: string
  ) => {
    setImages((prevImages) => {
      const index = prevImages.indexOf(imageUri);
      if (index === -1) {
        console.warn('Ảnh không tồn tại trong danh sách.');
        return prevImages;
      }
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  
    saveDeleteMedia(imageUri);
  };

  const deleteVideoItem = async (
    setThumbnail: React.Dispatch<React.SetStateAction<string[]>>,
    setVideo: React.Dispatch<React.SetStateAction<string[]>>,
    imageUri: string
  ) => {
    let videoUriToDelete = '';
    setThumbnail((prevThumbnails) => {
      const index = prevThumbnails.indexOf(imageUri);
      if (index === -1) {
        console.warn('Ảnh không tồn tại trong danh sách thumbnail.');
        return prevThumbnails;
      }

      const updatedThumbnails = [...prevThumbnails];
      updatedThumbnails.splice(index, 1);

      setVideo((prevVideos) => {
        const updatedVideos = [...prevVideos];
        videoUriToDelete = prevVideos[index];
        saveDeleteMedia(videoUriToDelete);
        updatedVideos.splice(index, 1);
        return updatedVideos;
      });

      return updatedThumbnails;
    });
      
  };

  const UploadMedia = async(createMedia:IMedia[]) => {
    if (!roomImages || roomImages.length < 1) {
      Alert.alert("Thông báo", "Chưa có ảnh phòng.");

    } else if (!hinhAnhGiayPhepKinhDoanh || hinhAnhGiayPhepKinhDoanh.length < 1) {
      Alert.alert("Thông báo", "Chưa có hình ảnh giấy phép kinh doanh.");

    } else if (!hinhAnhGiayPhongChay || hinhAnhGiayPhongChay.length < 1) {
      Alert.alert("Thông báo", "Chưa có hình giấy phép phòng cháy.");

    } else if (!hinhAnhQuyenSuDungDat || hinhAnhQuyenSuDungDat.length < 1) {
      Alert.alert("Thông báo", "Chưa có hình ảnh giấy phép quyền sử dụng đất.");

    } else {
      try {
        let listImageUri: string[] = []
      let indexImageUri: number[] = []
      let listVideoUri: string[] = []
      let indexVideoUri: number[] = []

      createMedia.forEach((media, index) => {
        if (media.loaiTep === "Hình ảnh") {
          listImageUri.push(media.duongDan);
          indexImageUri.push(index);
        } else if (media.loaiTep === "Video") {
          listVideoUri.push(media.duongDan);
          indexVideoUri.push(index);
        }
      });
      

      if(listImageUri.length > 0) { 
        const roomImageUri = await mediaService.uploadRoomImage(listImageUri)
        indexImageUri.forEach((originalIndex, i) => {
            createMedia[originalIndex].duongDan = roomImageUri.data[i]; 
          });
      }

      if(listVideoUri.length > 0) { 
        const videoUri = await mediaService.uploadRoomVideo(listVideoUri)
        indexVideoUri.forEach((originalIndex, i) => {
            createMedia[originalIndex].duongDan = videoUri.data[i]; 
          });
      }
      
        setAddMedia(createMedia)
      } catch (error) {
        console.error("Lỗi khi tải media:", error);
      }
      
    }
  }

  const updateMedia = async () => {
    try {
      await UploadMedia(addMedia);
      await mediaService.updateMediaofRoom(deleteMedia, addMedia);
      console.log("Cập nhật media thành công.");
      Alert.alert("Thông báo", "Cập nhật hình ảnh phòng thành công.",  [
        {
            text: "OK",
            onPress: () => navigation.navigate('Main')
        }
    ]);
    } catch (error) {
      console.error("Lỗi cập nhật hình ảnh phòng:", error);
    }
}

  useEffect(() => {
    if (room) {
      setListMediaRoom(room.hinhAnh)
      setRoomId(room.maPhong)
      room.hinhAnh.map((item) => {
        if (item.danhMucHinhAnh === "Hình ảnh căn phòng" && item.loaiTep === "Hình ảnh") {
          setRoomImages((prevImages) => [...prevImages, item.duongDan])
        } else if (item.danhMucHinhAnh === "Hình ảnh căn phòng" && item.loaiTep === "Video") {
          setVideo((prevVideos) => [...prevVideos, item.duongDan])
          generateThumbnail(item.duongDan)
        } else if (item.danhMucHinhAnh === "Giấy chứng nhận quyền sử dụng đất") {
          setHinhAnhQuyenSuDungDat((prevImages) => [...prevImages, item.duongDan])
        } else if (item.danhMucHinhAnh === "Giấy chứng nhận đủ điều kiện về phòng cháy chữa cháy") {
          setHinhAnhGiayPhongChay((prevImages) => [...prevImages, item.duongDan])
        } else {
          setHinhAnhGiayPhepKinhDoanh((prevImages) => [...prevImages, item.duongDan])
        }
      })
    }
  }, [])

  console.log("delete", deleteMedia)
  console.log("add", addMedia)
  if (!video || !hinhAnhGiayPhepKinhDoanh) {
    return (
      <View>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.component}>
        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.input_title}>Hình ảnh phòng:</Text>
          </View>
          <View style={styles.name_item}>
            <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap" }}>
              <TouchableOpacity
                // style={{ backgroundColor: "white" }}
                onPress={() => handleSelectImage(setRoomImages, 'photo', 1, "Hình ảnh" )}
              >
                <View
                  style={{
                    margin: 3,
                    padding: 5,
                    borderColor: "lightgray",
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderStyle: "dashed",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "red",
                      textAlign: "center",
                      textAlignVertical: "center",
                      width: 200 / 3,
                      height: 200 / 3,
                    }}
                  >
                    +Thêm ảnh
                  </Text>
                </View>
              </TouchableOpacity>
              {roomImages.map((image, index) => (
                <View key={index}
                  style={{
                    margin: 3,
                    padding: 5,
                  }}>
                  <Image
                    source={{ uri: String(image) }}
                    style={{
                      width: 200 / 3,
                      height: 200 / 3,
                    }}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => deleteImageItem(setRoomImages, String(image))}
                    style={styles.btn_ImageClose}
                  >
                    <Icon name='close' size={15} color="black" />
                  </TouchableOpacity>
                </View>

              ))}
            </View>
            <Text style={{ paddingVertical: 5 }}>Thêm tối đa 10 ảnh</Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.input_title}>Video </Text>
            <Text>(không bắt buộc)</Text>
          </View>

          <View style={styles.name_item}>
            <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap" }}>
              <TouchableOpacity
                // style={{ backgroundColor: "white" }}
                onPress={() => handleSelectImage(setVideo, 'video',1, "Video")}
              >
                <View
                  style={{
                    margin: 3,
                    padding: 5,
                    borderColor: "lightgray",
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderStyle: "dashed",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "red",
                      textAlign: "center",
                      textAlignVertical: "center",
                      width: 200 / 3,
                      height: 200 / 3,
                    }}
                  >
                    +Thêm video
                  </Text>
                </View>
              </TouchableOpacity>
              {thumbnail.map((video, index) => (
                <View
                  key={index}
                  style={{
                    margin: 3,
                    padding: 5,
                  }}
                >
                  <Image
                    source={{ uri: String(video) }}
                    style={{
                      width: 200 / 3,
                      height: 200 / 3,
                    }}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => deleteVideoItem(setThumbnail, setVideo, String(video))}
                    style={styles.btn_ImageClose}
                  >
                    <Icon name='close' size={15} color="black" />
                  </TouchableOpacity>
                </View>

              ))}
            </View>
            <Text style={{ paddingVertical: 5 }}>Thêm tối đa 2 video</Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={styles.input_title}>Giấy chứng nhận quyền sử dụng đất:</Text>
          <View style={styles.name_item}>
            <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap" }}>
              <TouchableOpacity
                // style={{ backgroundColor: "white" }}
                onPress={() => handleSelectImage(setHinhAnhQuyenSuDungDat, 'photo',2, "Hình ảnh")}
              >
                <View
                  style={{
                    margin: 3,
                    padding: 5,
                    borderColor: "lightgray",
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderStyle: "dashed",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "red",
                      textAlign: "center",
                      textAlignVertical: "center",
                      width: 200 / 3,
                      height: 200 / 3,
                    }}
                  >
                    +Thêm ảnh
                  </Text>
                </View>
              </TouchableOpacity>
              {hinhAnhQuyenSuDungDat.map((image, index) => (
                <View key={index}
                  style={{
                    margin: 3,
                    padding: 5,
                  }}>

                  <Image
                    source={{ uri: String(image) }}
                    style={{
                      width: 200 / 3,
                      height: 200 / 3,
                    }}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => deleteImageItem(setHinhAnhQuyenSuDungDat, String(image))}
                    style={styles.btn_ImageClose}
                  >
                    <Icon name='close' size={15} color="black" />
                  </TouchableOpacity>
                </View>

              ))}
            </View>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={styles.input_title}>Giấy phép kinh doanh hộ gia đình:</Text>

          <View style={styles.name_item}>
            <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap" }}>
              <TouchableOpacity
                onPress={() => handleSelectImage(setHinhAnhGiayPhepKinhDoanh, 'photo', 4, 'Hình ảnh')}
              >
                <View
                  style={{
                    margin: 3,
                    padding: 5,
                    borderColor: "lightgray",
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderStyle: "dashed",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "red",
                      textAlign: "center",
                      textAlignVertical: "center",
                      width: 200 / 3,
                      height: 200 / 3,
                    }}
                  >
                    +Thêm ảnh
                  </Text>
                </View>
              </TouchableOpacity>
              {hinhAnhGiayPhepKinhDoanh.map((image, index) => (
                <View key={index} style={{
                  margin: 3,
                  padding: 5,
                }}>

                  <Image
                    source={{ uri: String(image) }}
                    style={{
                      width: 200 / 3,
                      height: 200 / 3,
                    }}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => deleteImageItem(setHinhAnhGiayPhepKinhDoanh, String(image))}
                    style={styles.btn_ImageClose}
                  >
                    <Icon name='close' size={15} color="black" />
                  </TouchableOpacity>
                </View>

              ))}
            </View>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={styles.input_title}>Giấy chứng nhận phòng cháy chữa cháy:</Text>
          <View style={styles.name_item}>
            <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap" }}>
              <TouchableOpacity
                onPress={() => handleSelectImage(setHinhAnhGiayPhongChay, 'photo',  3, "Hình ảnh")}
              >
                <View
                  style={{
                    margin: 3,
                    padding: 5,
                    borderColor: "lightgray",
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderStyle: "dashed",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "red",
                      textAlign: "center",
                      textAlignVertical: "center",
                      width: 200 / 3,
                      height: 200 / 3,
                    }}
                  >
                    +Thêm ảnh
                  </Text>
                </View>
              </TouchableOpacity>
              {hinhAnhGiayPhongChay.map((image, index) => (
                <View key={index}
                  style={{
                    margin: 3,
                    padding: 5,
                  }}>

                  <Image
                    source={{ uri: String(image) }}
                    style={{
                      width: 200 / 3,
                      height: 200 / 3,
                    }}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => deleteImageItem(setHinhAnhGiayPhongChay, String(image))}
                    style={styles.btn_ImageClose}
                  >
                    <Icon name='close' size={15} color="black" />
                  </TouchableOpacity>
                </View>

              ))}
            </View>
          </View>
        </View>


        <View style={{ marginTop: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
          <TouchableOpacity style={styles.btn_confirm}
          onPress={() => updateMedia()}
          >
            <Text style={styles.btn_text}>Cập nhật</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default MediaScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.BackgroundHome
  },

  component: {
    backgroundColor: colors.BackgroundHome,
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    height: "100%"
  },

  input_title: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold'
  },

  btn_confirm: {
    backgroundColor: colors.blue,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    width: "100%"
  },
  btn_text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  name_item: {
    marginVertical: 1,
    alignItems: "center",
    width: "100%",
    padding: 5,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: colors.gray_text,
    justifyContent: "space-between",
    backgroundColor: "white",
  },


  btn_ImageClose: {
    position: "absolute",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray_text,
    padding: 2,
    right: 0,
    backgroundColor: '#FFFFFF'
  },


})