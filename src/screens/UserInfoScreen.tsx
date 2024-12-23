import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RootStackParamList } from "../navigation/RootStackParamList";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import colors from '../constants/colors';
import { Icon } from '@rneui/themed';
import DatePicker from 'react-native-date-picker'
import { useUser } from '../context/UserContext';
import { addressService, mediaService } from '../service';
import { IAddress } from '../type/address.interface';
import axiosInstance from '../service/axiosInstance';
import axios from 'axios';
import { launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker';

type UserInfoScreenProps = NativeStackScreenProps<RootStackParamList, 'UserInfo'>;
type OnChangeEvent = {
  type: string;
  nativeEvent: any;
};
const UserInfoScreen: React.FC<UserInfoScreenProps> = ({ navigation }) => {

  const { user, setUser } = useUser();
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);


  const uploadAvar = async (avatar: string) => {
    try {
      const response = await mediaService.uploadAvatar(avatar);
      setAvatar(response.data)
    } catch (error) {
      console.error("Upload ảnh thất bại:", error);
    }
  }

  const handleSelectImage = async (
    setImage: React.Dispatch<React.SetStateAction<string>>,
    mediaType: MediaType,
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
                  console.log(response.errorCode);
                } else if (response.assets && response.assets.length > 0) {
                  const selectedImage = response.assets[0].uri || ''; 
                  uploadAvar(selectedImage)
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
                const selectedImage = response.assets[0].uri || ''; 
                uploadAvar(selectedImage)
              }
            });
          },
        },
        { text: 'Hủy', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };
  
 

  const getAddress = async (maDiaChi: string) => {
    try {
      const address: IAddress = await addressService.getAddress(maDiaChi);
      if (address) {
        setAddress(`${address.soNha}, ${address.phuongXa}, ${address.quanHuyen}, ${address.tinhThanh}`);
      }
    } catch (error) {

    }
  }

  const updateUser = async () => {
    try {
      const data = {
        maNguoiDung: user?.maNguoiDung,
        tenNguoiDung: name,
        sdt: phone,
        ngaySinh: date.toString(),
        hinhDaiDien: avatar,
      }
      const response = await axiosInstance.put("/api/v1/users/update/user", data);
      setUser(response.data)
      Alert.alert("Thông báo", "Cập nhật thông tin thành công.");
    } catch (error) {
      if (error instanceof Error) {
        if (axios.isAxiosError(error) && error.response && error.response.data.message) {
          Alert.alert("Lỗi", error.response.data.message);
        } else {
          Alert.alert("Lỗi", error.message);
        }
      } else {
        Alert.alert("Lỗi", "Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
        console.error("Cập nhât thất bại:", error);
      }

    }
  }

  useEffect(() => {
    const formattedDate = date.toLocaleDateString('en-CA');
    setDateOfBirth(formattedDate);
  },[date])

  useEffect(() => {
    if (user) {
      setName(user.tenNguoiDung);
      setEmail(user.email);
      setPhone(user.sdt || "");
      setAvatar(user.hinhDaiDien || "");
      if (user.maDiaChi) {
        getAddress(user.maDiaChi);
        console.log(address)
      }
      if (user && user.ngaySinh) {
        const userDate = new Date(user.ngaySinh);
        const formattedDate = userDate.toLocaleDateString();
        setDateOfBirth(formattedDate);
      } else {
        setDateOfBirth("");
      }
    }
    
  }, [])

  return (
    <>
      {user == null ? (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 100 }}>
          <Text style={styles.catalog_text}>
            Đăng nhập để xem hồ sơ
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.catalog_text, { color: colors.blue }]}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      ) : (

        <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
          <View
            style={{
              marginVertical: 10,
              alignSelf: "center",
            }}
          >
            {/* Image Container */}
            <View style={styles.imageContainer}>
              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.blue} />
                </View>
              )}
              <Image
                source={
                  avatar? { uri: avatar } : require("../assets/image/Room.jpg")
                }
                style={{
                  width: 120,
                  height: 120,
                  borderWidth: 5,
                  borderColor: "white",
                  borderRadius: 100,
                }}
              />
            </View>

            {/* Button */}
            <TouchableOpacity
              style={{
                backgroundColor: colors.BackgroundHome,
                padding: 3,
                alignSelf: "center",
                marginTop: -24,
                marginLeft: 60,
                borderRadius: 100,
              }}
            onPress={() => handleSelectImage(setAvatar, 'photo')}
            >
              <Icon name='camera-alt' size={25} color={colors.blue} />
            </TouchableOpacity>
          </View>

          <View style={{ padding: 15 }}>
            <View>
              <Text style={styles.catalog_text}>Họ và tên:</Text>
              <View style={styles.component}>
                <TextInput
                  style={styles.input}
                  onChangeText={setName}
                  value={name}
                />
              </View>
            </View>
            <View>
              <Text style={styles.catalog_text}>Email:</Text>
              <View style={styles.component}>
                <TextInput
                  style={styles.input}
                  onChangeText={setEmail}
                  value={email}
                  editable={false}
                />
              </View>
            </View>
            <View>
              <Text style={styles.catalog_text}>Số điện thoại:</Text>
              <View style={styles.component}>
                <TextInput
                  style={styles.input}
                  onChangeText={setPhone}
                  value={phone}
                />
              </View>
            </View>
            <View>
              <Text style={styles.catalog_text}>Ngày sinh:</Text>
              <View style={styles.component}>
                <Text style={[styles.input, { paddingVertical: 14, fontWeight: '500' }]}>{dateOfBirth}</Text>
                <TouchableOpacity
                  onPress={() => setShow(true)}
                >
                  <Icon name='calendar-month' size={25} color={colors.blue} style={{ marginRight: 10, }} />
                </TouchableOpacity>
                <DatePicker
                  modal
                  mode='date'
                  open={show}
                  date={date}
                  onConfirm={(date) => {
                    setShow(false);
                    setDate(date);
                  }}
                  onCancel={() => {
                    setShow(false);
                  }}
                />
              </View>
            </View>
            <View>
              <Text style={styles.catalog_text}>Địa chỉ:</Text>
              <TouchableOpacity style={styles.component}
                onPress={() => navigation.navigate("Address")}
              >
                <TextInput
                  style={styles.input}
                  onChangeText={setAddress}
                  value={address}
                  editable={false} // Không cho phép chỉnh sửa
                  selectTextOnFocus={false} // Ngăn chọn văn bản
                />
                <Image source={require('../assets/icon/angle-right.png')} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.btn_confirm}
              onPress={() => updateUser()}
            >
              <Text style={styles.btn_text}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>

  )
}

export default UserInfoScreen

const styles = StyleSheet.create({
  component: {
    backgroundColor: colors.BackgroundHome,
    borderRadius: 15,
    shadowColor: "#000",
    justifyContent: 'space-between',
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  list_items: {
    marginVertical: 1,
    width: "100%",
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  input: {
    width: '85%',
    marginLeft: 12,
    fontSize: 16,
  },

  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure the loading indicator is above the image
  },
  imageContainer: {
    position: "relative",
  },
  catalog_text: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  btn_confirm: {
    backgroundColor: colors.blue,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    fontSize: 18,
    fontWeight: 'bold',
  },
  btn_text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
})