import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, ImageBackground} from 'react-native'
import React, { useEffect, useState } from 'react'
import { RootStackParamList } from "../../../navigation/RootStackParamList";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import colors from '../../../constants/colors';
import { Dropdown } from 'react-native-element-dropdown';
import { launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker';
import { Icon } from '@rneui/themed';
import { useAddress } from '../../../context/AddressContext';
import { CheckBox } from '@rneui/themed';
import Title from '../../../components/Room/Title';
import Checkbox from '../../../components/Checkbox';
import DropdownComponent from '../../../components/DropBox';
import axiosInstance from "../../../service/axiosInstance";
import axios from "axios";
import { roomService, mediaService, addressService } from "../../../service"
import { IRoom } from '../../../type/room.interface';
import { useUser } from '../../../context/UserContext';

type CreateRoomScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateRoom'>;
interface DropDownItem {
  label: string;
  value: string;
}

interface listItem {
  label: string;
  column: string;
  value: boolean;
}

interface ImageOptions {
  mediaType: MediaType;
  selectionLimit: number;
}

interface deposit {
  phiDatCoc: number;
  thoiHanDatCoc: number;
  donViTienTe: string;
  donViThoiGian: string;
}

const CreateRoomScreen: React.FC<CreateRoomScreenProps> = ({ navigation }) => {
  const { address, setAddress } = useAddress();
  const {user, setUser} = useUser()
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    setAddress(null)
  },[])
  
  const [title, setTitle] = useState<string>("");
  const [describe, setDescribe] = useState<string>("");
  const [roomType, setRoomType] = useState<string>("");
  const [roomWithOwner, setRoomWithOwner] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [gacXep, setGacXep] = useState(false);
  const [kitchen, setkitchen] = useState(false);
  const [numberOfBedrooms, setNumberOfBedrooms] = useState(0)
  const [numberOfFloors, setNumberOfFloors] = useState(0)
  const [numberOfBathrooms, setNumberOfBathrooms] = useState(0)
  const [numberOfPeople, setNumberOfPeople] = useState(0)


  const [roomPrice, setRoomPrice] = useState(0)
  const [electricityPrice, setElectricityPrice] = useState(0)
  const [waterPrice, setWaterPrice] = useState(0)
  const [depositList, setDepositList] = useState<deposit[]>([]);


  const [video, setVideo] = useState<string[]>([])
  const [roomImages, setRoomImages] = useState<string[]>([]);
  const [hinhAnhQuyenSuDungDat, setHinhAnhQuyenSuDungDat] = useState<string[]>([]);
  const [hinhAnhGiayPhepKinhDoanh, setHinhAnhGiayPhepKinhDoanh] = useState<string[]>([]);
  const [hinhAnhGiayPhongChay, setHinhAnhGiayPhongChay] = useState<string[]>([]);


  const [interior, setInterior] = useState<listItem[]>([
    { label: 'Bàn ghế', column: "banGhe", value: false },
    { label: 'Sofa', column: "sofa", value: false },
    { label: 'wifi', column: "wifi", value: false },
    { label: 'Tủ lạnh', column: "tuLanh", value: false },
    { label: 'Giường', column: "giuong", value: false },
    { label: 'chăn ga gối', column: "chanGaGoi", value: false },
    { label: 'Tủ quần áo', column: "tuQuanAo", value: false },
    { label: 'Đồ dùng nhà bếp', column: "doDungBep", value: false },
    { label: 'Điều hòa', column: "dieuHoa", value: false },
    { label: 'Máy nóng lạnh', column: "nongLanh", value: false },
  ]);

  const [interiorStatus, setInteriorStatus] = useState<string>("false");

  const roomTypeData: DropDownItem[] = [
    { label: "Nhà ở", value: "1" },
    { label: "Chung cư", value: "2" },
    { label: "Phòng trọ", value: "3" },
  ];

  const roomWithOwnerData: DropDownItem[] = [
    { label: "Chung chủ", value: "true" },
    { label: "Không chung chủ", value: "false" },
  ];

  const interiorData: DropDownItem[] = [
    { label: "Có", value: "true" },
    { label: "Không", value: "false" },
  ];

  const timeData: DropDownItem[] = [
    { label: 'ngày', value: 'ngày' },
    { label: 'tuần', value: 'tuần' },
    { label: 'tháng', value: 'tháng' },
  ];
  const [time, setTime] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [index, setIndex] = useState(-1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAdd, setAdd] = useState(false);
  const [timeType, setTimeType] = useState<string>("");

  // const [roomImages, setRoomImages] = useState([]);
  const [menu, setMenu] = useState('Bước 1:Thông tin phòng');

  const toggleModal = () => {
    setIndex(-1);
    setDeposit(0);
    setTime(0);
    setModalVisible(!isModalVisible);
  };

  const closeModal = () => {
    setDeposit(0);
    setTime(0);
    setAdd(false);
    toggleModal();
  };

  const newDeposit = (time: number, deposit: number, timeType: string) => {
    setDepositList((prevList) => [
      ...prevList,
      { phiDatCoc: deposit, thoiHanDatCoc: time, donViTienTe: "VND", donViThoiGian: timeType },
    ]);
  };

  const updateDeposit = (index: number, time: number, deposit: number, timeType: string) => {
    setDepositList((prevList) =>
      prevList.map((item, i) =>
        i === index
          ? { ...item, phiDatCoc: deposit, thoiHanDatCoc: time, donViTienTe: "VND", donViThoiGian: timeType }
          : item
      )
    );
  };

  const deleteDeposit = (index: number) => {
    setDepositList((prevList) => prevList.filter((_, i) => i !== index));
  };

  const handleCheckboxGacXep = (value: boolean) => {
    setGacXep(value);
  };

  const handleCheckboxKitChen = (value: boolean) => {
    setkitchen(value);
  };

  // const handleSelectRoomImages = async () => {
  //   const options: ImageOptions = {
  //     mediaType: 'photo',
  //     selectionLimit: 10,
  //   };

  //   const result = await launchImageLibrary(options);

  //   if (result.didCancel) {
  //     console.log('User cancelled image picker');
  //   } else if (result.errorCode) {
  //     console.error('ImagePicker Error: ', result.errorMessage);
  //   } else if (result.assets) {
  //     // Extract URIs of selected images
  //     const selectedImages = result.assets.map((asset) => asset.uri || '');
  //     setRoomImages((prevImages) => {
  //       if (prevImages.length + selectedImages.length > 10) {
  //         Alert.alert('Tối đa 10 ảnh!');
  //         return prevImages;
  //       }
  //       return [...prevImages, ...selectedImages];
  //     });
  //   }
  // };

  const handleSelectImage = async (
    setImage: React.Dispatch<React.SetStateAction<string[]>>,
    mediaType: MediaType
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
                      Alert.alert('Tối đa 10 ảnh!');
                      return prevImages;
                    }
                    if (mediaType == 'video' && prevImages.length + selectedImages.length > 2) {
                      Alert.alert('Tối đa 2 video!');
                      return prevImages;
                    }
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
                  if (prevImages.length + selectedImages.length > 10) {
                    Alert.alert('Tối đa 10 ảnh!');
                    return prevImages;
                  }
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

  const changeImageItem = async (
    setImages: React.Dispatch<React.SetStateAction<string[]>>,
    mediaType: MediaType,
    imageUri: string
  ) => {
    const options: ImageOptions = {
      mediaType: mediaType,
      selectionLimit: 1, // Chỉ cho phép chọn một ảnh
    };

    const result = await launchImageLibrary(options);

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.error('ImagePicker Error: ', result.errorMessage);
    } else if (result.assets) {
      const selectedImageUri = result.assets[0]?.uri || '';

      setImages((prevImages) => {
        const index = prevImages.indexOf(imageUri);
        if (index === -1) {
          console.warn('Image to replace not found in the list.');
          return prevImages;
        }
        const updatedImages = [...prevImages];
        updatedImages[index] = selectedImageUri;
        return updatedImages;
      });
    }
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
  };

  const handleSelectItem = (selectedIndex: number) => {
    setInterior((prevItems) => {
      const updatedItems = [...prevItems];
      if (selectedIndex >= 0 && selectedIndex < updatedItems.length) {
        updatedItems[selectedIndex] = {
          ...updatedItems[selectedIndex],
          value: !updatedItems[selectedIndex].value,
        };
      } else {
        console.warn('Index không hợp lệ');
      }

      return updatedItems;
    });
  };

  const UploadMedia = async(maPhong: number) => {
    if (!roomImages || roomImages.length < 1) {
      Alert.alert("Thông báo", "Chưa có ảnh phòng.");

    } else if (!hinhAnhGiayPhepKinhDoanh || hinhAnhGiayPhepKinhDoanh.length < 1) {
      Alert.alert("Thông báo", "Chưa có hình ảnh giấy phép kinh doanh.");

    } else if (!hinhAnhGiayPhongChay || hinhAnhGiayPhongChay.length < 1) {
      Alert.alert("Thông báo", "Chưa có hình giấy phép phòng cháy.");

    } else if (!hinhAnhQuyenSuDungDat || hinhAnhQuyenSuDungDat.length < 1) {
      Alert.alert("Thông báo", "Chưa có hình ảnh giấy phép quyền sử dụng đất.");

    } else {
      const roomInmageUri = await mediaService.uploadRoomImage(roomImages)
      const GiayPhepKinhDoanhUri = await mediaService.uploadRoomImage(hinhAnhGiayPhepKinhDoanh)
      const GiayPhepPhongChayUri = await mediaService.uploadRoomImage(hinhAnhGiayPhongChay)
      const GiayPhepQuyenSuDungDatUri = await mediaService.uploadRoomImage(hinhAnhQuyenSuDungDat)
      
      await mediaService.addMedia(maPhong , 1 ,"Hình ảnh", roomInmageUri.data)
      await mediaService.addMedia(maPhong , 2 ,"Hình ảnh", GiayPhepQuyenSuDungDatUri.data)
      await mediaService.addMedia(maPhong , 3 ,"Hình ảnh", GiayPhepPhongChayUri.data)
      await mediaService.addMedia(maPhong , 4 ,"Hình ảnh", GiayPhepKinhDoanhUri.data)

      if (video) {
        const videoUri = await mediaService.uploadRoomVideo(video)
        await mediaService.addMedia(maPhong , 1 ,"Video", videoUri.data)
      }

    }
  }

  const createDeposit = async (maPhong: number) => {
    if (!depositList || depositList.length === 0) {
      Alert.alert("Thông báo lỗi", "Chưa có thông tin đặt cọc phòng.");
    } else {
      try {
        await roomService.handleCreateDeposit(depositList, maPhong)
      } catch (error) {
        Alert.alert("Thông báo lỗi", "Lỗi khởi tạo phí đặt cọc.");
        console.log(error)
      }
    }
  }

  const createRoom = async() => {
    if (!address) {
      Alert.alert("Thông báo lỗi", "Chưa có thông tin địa chỉ phòng.");
    } else if (!depositList || depositList.length === 0) {
      Alert.alert("Thông báo lỗi", "Chưa có thông tin đặt cọc phòng.");
    }
    else {
      const maDiaChi = await  addressService.handleCreateRoomAddress(address)
      const maNoiThat = await roomService.handleCreateInterior(interior)
      // console.log( maDiaChi)
      // console.log( maNoiThat)
      if( user) {
        const roomData: IRoom = {
          maPhong: null,
          maNguoiDung: user.maNguoiDung,
          maLoaiPhong: Number(roomType),
          maDiaChi: maDiaChi,
          maNoiThat: maNoiThat,
          tieuDe: title,
          moTa: describe,
          dienTich: area + "m2",
          phongChungChu: roomWithOwner === "true",
          soLuongPhongNgu: numberOfBedrooms,
          soTang: numberOfFloors,
          soNguoiToiDa: numberOfPeople,
          trangThaiPhong: "Chờ duyệt",
          gacXep: gacXep,
          nhaBep: kitchen,
          giaPhong: roomPrice,
          giaDien: electricityPrice,
          giaNuoc: waterPrice,
        }
        try {
          const room = await roomService.createRoom(roomData)
          await Promise.all([
            UploadMedia(room.maPhong),
            createDeposit(room.maPhong),
          ]);
  
          Alert.alert("Thông báo", "Tạo phòng thành công.",[
            {
              text: "OK",
              onPress: () => navigation.navigate('Main')
            }
          ]);
        } catch (error) {
          Alert.alert("Thông báo lỗi", "Tạo phòng thất bại.");
          console.log(error);
        }
      }
    }

  }
  return (
    <ScrollView style={styles.container}>
      <Title title={menu} />
      {menu === 'Bước 1:Thông tin phòng' ? (
        <View style={styles.component}>
          <View>
            <Text style={styles.input_title}>Tiêu đề:</Text>
            <View style={styles.input_container}
            >
              <TextInput
                style={styles.input}
                onChangeText={setTitle}
                value={title}
              />
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Mô tả:</Text>
            <View style={styles.input_container}
            >
              <TextInput
                style={styles.textArea}
                value={describe}
                onChangeText={(value) => setDescribe(value)}
                placeholder="Nhập nội dung tại đây..."
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Loại phòng:</Text>
            <View style={styles.input_container}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={roomTypeData}
                placeholder="Chọn"
                labelField="label"
                valueField="value"
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                value={roomType}
                onChange={(item) => {
                  setRoomType(item.value);;
                  setIsFocus(false);
                }}
              />
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Phòng chung chủ:</Text>
            <View style={styles.input_container}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={roomWithOwnerData}
                placeholder="Chọn"
                labelField="label"
                valueField="value"
                value={roomWithOwner}
                onChange={(item) => {
                  setRoomWithOwner(item.value);
                }}
              />
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Địa chỉ:</Text>
            <TouchableOpacity style={[styles.input_container]}
              onPress={() => navigation.navigate("AddressRoom",{ fromScreen: 'CreateRoomScreen'})}
            >
              {address ? (<Text
                style={[styles.input, { color: "black", }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              > {address?.soNha}, {address?.phuongXa}, {address?.quanHuyen}, {address?.tinhThanh}
              </Text>) : (<Text
                style={[styles.input, { color: "black", }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
              </Text>)}

              <Image source={require('../../../assets/icon/angle-right.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Diện tích:</Text>
            <View style={styles.input_container}>
              <TextInput
                style={styles.input}
                onChangeText={setArea}
                value={area}
              />
              <Text style={styles.unit}>m2</Text>

            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[styles.input_title, { marginRight: 100 }]}>Gác xếp:</Text>
              <Checkbox onCheckbox1Change={handleCheckboxGacXep} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[styles.input_title, { marginRight: 100 }]}>Nhà bếp:</Text>
              <Checkbox onCheckbox1Change={handleCheckboxKitChen} />
            </View>
          </View>

          <View style={{ marginTop: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text style={styles.input_title}>số phòng ngủ:</Text>
            <View style={{ flexDirection: 'row' }}>
              {numberOfBedrooms > 0 ? (
                <Pressable
                  onPress={() => setNumberOfBedrooms(numberOfBedrooms - 1)}
                  style={{
                    backgroundColor: "#6E7280",
                    padding: 7,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}
                >
                  <Image source={require('../../../assets/icon/minus_white.png')} style={styles.icon} />
                </Pressable>
              ) : (
                <Pressable
                  style={{
                    backgroundColor: "#D8D8D8",
                    padding: 7,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}
                >
                  <Image source={require('../../../assets/icon/minus_white.png')} style={styles.icon} />
                </Pressable>
              )}

              <View
                style={{
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: colors.gray_text,
                  paddingHorizontal: 18,
                  paddingVertical: 6,
                }}
              >
                <Text>{numberOfBedrooms}</Text>
              </View>

              <Pressable
                onPress={() => setNumberOfBedrooms(numberOfBedrooms + 1)}
                style={{
                  backgroundColor: "#6E7280",
                  padding: 7,
                  borderTopRightRadius: 6,
                  borderBottomRightRadius: 6,
                }}
              >
                <Image source={require('../../../assets/icon/plus_white.png')} style={styles.icon} />
              </Pressable>
            </View>
          </View>

          {/* <View style={{ marginTop: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text style={styles.input_title}>số phòng tắm, vệ sinh:</Text>
            <View style={{ flexDirection: 'row' }}>
              {numberOfBathrooms > 0 ? (
                <Pressable
                  onPress={() => setNumberOfBathrooms(numberOfBathrooms - 1)}
                  style={{
                    backgroundColor: "#6E7280",
                    padding: 7,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}
                >
                  <Image source={require('../../../assets/icon/minus_white.png')} style={styles.icon} />
                </Pressable>
              ) : (
                <Pressable
                  style={{
                    backgroundColor: "#D8D8D8",
                    padding: 7,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}
                >
                  <Image source={require('../../../assets/icon/minus_white.png')} style={styles.icon} />
                </Pressable>
              )}

              <View
                style={{
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: colors.gray_text,
                  paddingHorizontal: 18,
                  paddingVertical: 6,
                }}
              >
                <Text>{numberOfBathrooms}</Text>
              </View>

              <Pressable
                onPress={() => setNumberOfBathrooms(numberOfBathrooms + 1)}
                style={{
                  backgroundColor: "#6E7280",
                  padding: 7,
                  borderTopRightRadius: 6,
                  borderBottomRightRadius: 6,
                }}
              >
                <Image source={require('../../../assets/icon/plus_white.png')} style={styles.icon} />
              </Pressable>
            </View>
          </View> */}

          <View style={{ marginTop: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text style={styles.input_title}>số tầng:</Text>
            <View style={{ flexDirection: 'row' }}>
              {numberOfFloors > 0 ? (
                <Pressable
                  onPress={() => setNumberOfFloors(numberOfFloors - 1)}
                  style={{
                    backgroundColor: "#6E7280",
                    padding: 7,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}
                >
                  <Image source={require('../../../assets/icon/minus_white.png')} style={styles.icon} />
                </Pressable>
              ) : (
                <Pressable
                  style={{
                    backgroundColor: "#D8D8D8",
                    padding: 7,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}
                >
                  <Image source={require('../../../assets/icon/minus_white.png')} style={styles.icon} />
                </Pressable>
              )}

              <View
                style={{
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: colors.gray_text,
                  paddingHorizontal: 18,
                  paddingVertical: 6,
                }}
              >
                <Text>{numberOfFloors}</Text>
              </View>

              <Pressable
                onPress={() => setNumberOfFloors(numberOfFloors + 1)}
                style={{
                  backgroundColor: "#6E7280",
                  padding: 7,
                  borderTopRightRadius: 6,
                  borderBottomRightRadius: 6,
                }}
              >
                <Image source={require('../../../assets/icon/plus_white.png')} style={styles.icon} />
              </Pressable>
            </View>
          </View>

          <View style={{ marginTop: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text style={styles.input_title}>số người ở tối đa:</Text>
            <View style={{ flexDirection: 'row' }}>
              {numberOfPeople > 0 ? (
                <Pressable
                  onPress={() => setNumberOfPeople(numberOfPeople - 1)}
                  style={{
                    backgroundColor: "#6E7280",
                    padding: 7,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}
                >
                  <Image source={require('../../../assets/icon/minus_white.png')} style={styles.icon} />
                </Pressable>
              ) : (
                <Pressable
                  style={{
                    backgroundColor: "#D8D8D8",
                    padding: 7,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}
                >
                  <Image source={require('../../../assets/icon/minus_white.png')} style={styles.icon} />
                </Pressable>
              )}

              <View
                style={{
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: colors.gray_text,
                  paddingHorizontal: 18,
                  paddingVertical: 6,
                }}
              >
                <Text>{numberOfPeople}</Text>
              </View>

              <Pressable
                onPress={() => setNumberOfPeople(numberOfPeople + 1)}
                style={{
                  backgroundColor: "#6E7280",
                  padding: 7,
                  borderTopRightRadius: 6,
                  borderBottomRightRadius: 6,
                }}
              >
                <Image source={require('../../../assets/icon/plus_white.png')} style={styles.icon} />
              </Pressable>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Nội thất:</Text>
            <View style={styles.input_container}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={interiorData}
                placeholder="Chọn"
                labelField="label"
                valueField="value"
                value={interiorStatus}
                onChange={(item) => {
                  setInteriorStatus(item.value);
                }}
              />
            </View>

            {interiorStatus === "false" ? (
              <View></View>
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {interior.map((item, index) => (
                  <View key={index} style={{ margin: 5 }}>
                    <TouchableOpacity key={index} style={{ padding: 10, backgroundColor: item.value ? colors.pink_background : colors.gray, borderRadius: 15, }}
                      onPress={() => handleSelectItem(index)}
                    >
                      <Text style={{ fontSize: 16, color: item.value ? colors.red_text : 'black' }}>{item.label}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

          </View>
          <View style={{ marginTop: 10, alignItems: 'center' }}>
            <TouchableOpacity style={styles.btn_confirm}
              onPress={() => setMenu('Bước 2:Thông tin chi phí')}
            >
              <Text style={styles.btn_text}>Tiếp theo</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : menu === 'Bước 2:Thông tin chi phí' ? (
        <View style={styles.component}>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Giá thuê phòng:</Text>
            <View style={styles.input_container}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setRoomPrice(Number(text) || 0)}
                value={roomPrice.toString()}
                keyboardType="numeric"
              />
              <Text style={styles.unit}>vnđ</Text>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Giá điện:</Text>
            <View style={styles.input_container}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setElectricityPrice(Number(text) || 0)}
                value={electricityPrice.toString()}
                keyboardType="numeric"
              />
              <Text style={styles.unit}>đ/kwh</Text>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Giá nước:</Text>
            <View style={styles.input_container}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setWaterPrice(Number(text) || 0)}
                value={waterPrice.toString()}
                keyboardType="numeric"
              />
              <Text style={styles.unit}>khối</Text>
            </View>
          </View>

          {/* modal */}
          <Modal
            visible={isModalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={toggleModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Icon name='close' size={20} color="black" />
                </TouchableOpacity>

                <Text style={[styles.input_title, { alignSelf: 'center' }]}>Phí đặt cọc:</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Nhập phí đặt cọc"
                  value={deposit.toString()}
                  onChangeText={(text) => setDeposit(Number(text) || 0)}
                  keyboardType="numeric"
                />

                <Text style={[styles.input_title, { alignSelf: 'center' }]}>Thời gian đặt cọc:</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Nhập thời gian"
                    value={time.toString()}
                    onChangeText={(text) => setTime(Number(text) || 0)}
                    keyboardType="numeric"
                  />
                  <View style={[styles.modalInput]}>
                    <DropdownComponent
                      data={timeData}
                      placeholder="thời gian"
                      value={timeType}
                      onChange={(item) => setTimeType(item)}
                    />
                  </View>

                </View>

                <TouchableOpacity
                  style={[styles.btn_confirm, { alignSelf: 'center' }]}
                  onPress={() => {
                    if (!deposit || !time) {
                      Alert.alert("Thông báo", "Không được để trống");
                    } else {
                      if (isAdd) {
                        newDeposit(time, deposit, timeType);
                        toggleModal();
                      } else {
                        updateDeposit(index, time, deposit, timeType);
                        toggleModal();
                      }
                    }
                  }}
                >
                  <Text style={styles.btn_text}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Phí đặt cọc */}
          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Phí đặt cọc:</Text>

            {depositList?.map((item, index) =>
              <View
                key={index}
                style={styles.input_container}
              >
                <View style={{ margin: 10 }}>
                  <Text style={{ color: 'black', fontSize: 16 }}>Phí đặt cọc: {item.phiDatCoc} {item.donViTienTe}</Text>
                  <Text style={{ color: 'black', fontSize: 16 }}>thời hạn đặt cọc: {item.thoiHanDatCoc} {item.donViThoiGian}</Text>
                </View>
                <View style={{ flexDirection: 'row', margin: 10, }}>
                  <TouchableOpacity
                    style={styles.btn_icon}
                    onPress={() => {
                      setAdd(false);
                      toggleModal();
                      setIndex(index);
                      setTime(item.thoiHanDatCoc);
                      setDeposit(item.phiDatCoc)
                    }}
                  >
                    <Icon name='edit' size={20} color="gray" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btn_icon}
                    onPress={() => {
                      deleteDeposit(index);
                    }}
                  >
                    <Icon name='delete' size={20} color="gray" />

                  </TouchableOpacity>
                </View>
              </View>
            )}
            <TouchableOpacity
              style={[styles.input_container, { padding: 5, justifyContent: 'center', borderColor: 'red' }]}
              onPress={() => {
                setAdd(true);
                toggleModal();
              }}
            >
              <Text style={{ fontSize: 16, color: "red" }}>+ Thêm thông tin đặt cọc</Text>
            </TouchableOpacity>
          </View>

          {/* Nút chuyển trang */}
          <View style={{ marginTop: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
            <TouchableOpacity style={styles.btn_back}
              onPress={() => setMenu('Bước 1:Thông tin phòng')}
            >
              <Text style={[styles.btn_text, { color: 'black' }]}>Quay lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn_confirm}
              onPress={() => setMenu('Bước 3:Hình ảnh và video')}
            >
              <Text style={styles.btn_text}>Tiếp theo</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.component}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.input_title}>Hình ảnh phòng:</Text>
              <TouchableOpacity
              // onPress={handleDelete}
              >
                <Text style={{ color: "red" }}>Xóa ảnh</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.name_item}>
              <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap" }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "white" }}
                  onPress={() => handleSelectImage(setRoomImages, 'photo',)}                >
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
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => changeImageItem(setRoomImages, 'photo', String(image))}
                      style={{
                        // borderColor: selectedImages.includes(index)
                        //   ? "red"
                        //   : "lightgray",
                        // borderWidth: selectedImages.includes(index) ? 1 : 1,
                        margin: 3,
                        padding: 5,
                      }}
                    >
                      <Image
                        source={{ uri: String(image) }}
                        style={{
                          width: 200 / 3,
                          height: 200 / 3,
                        }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
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

            {/* <View style={styles.input_container_video}>

              <View>
                {video ? (
                  <Image
                    style={styles.inputImage}
                    source={{ uri: video }}
                  />
                ) : (
                  <View></View>
                )}
              </View>

              <Pressable style={styles.btn_chooseVideo}
                // onPress={() => handleSelectImage(setVideo, "video")}
              >
                <Image source={require("../../../assets/icon/plusIcon.jpg")} style={styles.plusIcon} />
                <Text style={{ color: video ? 'white' : colors.gray_text }}>Thêm video</Text>
              </Pressable>
            </View> */}
            <View style={styles.name_item}>
              <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap" }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "white" }}
                  onPress={() => handleSelectImage(setVideo, 'video',)}
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
                {video.map((video, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => changeImageItem(setRoomImages, 'video', String(video))}
                      style={{
                        // borderColor: selectedImages.includes(index)
                        //   ? "red"
                        //   : "lightgray",
                        // borderWidth: selectedImages.includes(index) ? 1 : 1,
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
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteImageItem(setVideo, String(video))}
                      style={styles.btn_ImageClose}
                    >
                      <Icon name='close' size={15} color="black" />
                    </TouchableOpacity>
                  </View>

                ))}
              </View>
              <Text style={{ paddingVertical: 5 }}>Thêm tối đa 3 video</Text>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Giấy chứng nhận quyền sử dụng đất:</Text>
            <View style={styles.name_item}>
              <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap" }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "white" }}
                  onPress={() => handleSelectImage(setHinhAnhQuyenSuDungDat, 'photo',)}
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
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => changeImageItem(setHinhAnhQuyenSuDungDat, 'photo', String(image))}
                      style={{
                        // borderColor: selectedImages.includes(index)
                        //   ? "red"
                        //   : "lightgray",
                        // borderWidth: selectedImages.includes(index) ? 1 : 1,
                        margin: 3,
                        padding: 5,
                      }}
                    >
                      <Image
                        source={{ uri: String(image) }}
                        style={{
                          width: 200 / 3,
                          height: 200 / 3,
                        }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
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
            {/* <View style={styles.input_container_video}>
              <Pressable style={styles.btn_chooseVideo}
              //  onPress={() => handleSelectImage(setFrontImageUri, 'Mặt trước căn cước')}
              >
                <Image source={require("../../../assets/icon/plusIcon.jpg")} style={styles.plusIcon} />
                <Text>Thêm ảnh</Text>
              </Pressable>
            </View> */}
            <View style={styles.name_item}>
              <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap" }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "white" }}
                  onPress={() => handleSelectImage(setHinhAnhGiayPhepKinhDoanh, 'photo',)}
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
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => changeImageItem(setHinhAnhGiayPhepKinhDoanh, 'photo', String(image))}
                      style={{
                        margin: 3,
                        padding: 5,
                      }}
                    >
                      <Image
                        source={{ uri: String(image) }}
                        style={{
                          width: 200 / 3,
                          height: 200 / 3,
                        }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
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
                  // style={{ backgroundColor: "white" }}
                  onPress={() => handleSelectImage(setHinhAnhGiayPhongChay, 'photo',)}
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
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => changeImageItem(setHinhAnhGiayPhongChay, 'photo', String(image))}
                      style={{
                        margin: 3,
                        padding: 5,
                      }}
                    >
                      <Image
                        source={{ uri: String(image) }}
                        style={{
                          width: 200 / 3,
                          height: 200 / 3,
                        }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
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
            <TouchableOpacity style={styles.btn_back}
              onPress={() => setMenu('Bước 2:Thông tin chi phí')}
            >
              <Text style={[styles.btn_text, { color: 'black' }]}>Quay lại</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn_confirm}
              onPress={() => createRoom()}
            >
              <Text style={styles.btn_text}>Tạo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
      }
    </ScrollView>
  )
}

export default CreateRoomScreen

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    marginBottom: 20,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.Background
  },

  component: {
    backgroundColor: colors.BackgroundHome,
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    justifyContent: 'center',
    height: "100%"
  },
  input_container: {
    backgroundColor: colors.BackgroundHome,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.gray_text,
    shadowColor: "#000",
    justifyContent: 'space-between',
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input_container_video: {
    marginVertical: 5,
    backgroundColor: colors.BackgroundHome,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.gray_text,
    shadowColor: "#000",
    borderStyle: "dashed",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
  },

  catalog_text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray_text,
  },

  icon: {
    width: 20,
    height: 20,
  },
  input: {
    width: '82%',
    height: 40,
    marginLeft: 12,
    fontSize: 16,
  },
  input_title: {
    fontSize: 18,
    color: 'black',
    fontWeight:'bold'

  },
  dropdown: {
    width: '95%',
    height: 40,
    marginLeft: 12,
    fontSize: 16,
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  textArea: {
    width: '85%',
    height: 120,
    marginLeft: 12,
    fontSize: 16,
    textAlignVertical: "top",
  },
  unit: {
    fontSize: 16,
    marginRight: 50,
  },
  btn_back: {
    backgroundColor: colors.Background,
    borderWidth: 1,
    borderColor: colors.gray_text,
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    fontSize: 18,
    fontWeight: 'bold',
    width: 100
  },
  btn_confirm: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    fontSize: 18,
    fontWeight: 'bold',
    width: 100
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
  btn_chooseVideo: {
    position: "absolute",
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.gray_text,
    borderRadius: 10,
    padding: 5,
  },
  plusIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  inputImage: {
    width: 150,
    height: 100,
    resizeMode: 'cover',
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  closeButton: {
    marginTop: -15,
    marginRight: -15,
    alignSelf: "flex-end",
  },
  modalInput: {
    marginVertical: 12,
    marginLeft: 5,
    paddingVertical: 0,
    padding: 15,
    height: 40,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "lightgray",
  },
  btn_icon: {
    borderRadius: 15,
    padding: 5,
    backgroundColor: colors.gray, margin: 5
  }
})