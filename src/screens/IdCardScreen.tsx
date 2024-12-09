import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from "../navigation/RootStackParamList";
import colors from '../constants/colors';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { mediaService } from '../service';
import { useUser } from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from '../service/axiosInstance';


type IdCardScreennProps = NativeStackScreenProps<RootStackParamList, 'IdCard'>;
const IdCardScreen: React.FC<IdCardScreennProps>= ({ navigation, route }) => {
 console.log(route.params)
  const {  user, setUser } = useUser();
  const email = route.params.email
  const userInfoParams = route.params
  const [frontImageUri, setFrontImageUri] = useState<string | null>(null);
  const [backImageUri, setBackImageUri] = useState<string | null>(null);
    
  const handleSelectImage = async (
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    title: string
  ) => {
    Alert.alert(
      title,
      'Bạn muốn chọn ảnh từ đâu?',
      [
        {
          text: 'Chụp bằng Camera',
          onPress: () => {
            launchCamera(
              { mediaType: 'photo', cameraType: 'back' },
              (response) => {
                if (response.didCancel) {
                  Alert.alert('Hủy', 'Bạn đã hủy chụp ảnh');
                } else if (response.errorCode) {
                  Alert.alert('Lỗi', `Mã lỗi: ${response.errorCode}`);
                  console.log(response.errorCode)
                } else if (response.assets && response.assets.length > 0) {
                  setImage(response.assets[0].uri || null);
                }
              }
            );
          },
        },
        {
          text: 'Chọn từ Thư viện',
          onPress: () => {
            launchImageLibrary({ mediaType: 'photo' }, (response) => {
              if (response.didCancel) {
                Alert.alert('Hủy', 'Bạn đã hủy chọn ảnh');
              } else if (response.errorCode) {
                Alert.alert('Lỗi', `Mã lỗi: ${response.errorCode}`);
              } else if (response.assets && response.assets.length > 0) {
                setImage(response.assets[0].uri || null);
              }
            });
          },
        },
        { text: 'Hủy', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleUpload = async () => {
    if (!frontImageUri || !backImageUri) {
      Alert.alert('Hãy chọn ảnh!');
      return;
    }

    try {
      const result = await mediaService.uploadCCCDImages(frontImageUri, backImageUri);
      Alert.alert('Tải ảnh thành công!');

      const userInfo = {
        tenNguoiDung: userInfoParams.tenNguoiDung,
        email: userInfoParams.email,
        matKhau: userInfoParams.matKhau,
        sdt:userInfoParams.sdt,
        soCCCD: userInfoParams.soCCCD,
        matTruocCCCD: result.data.matTruocCCCD,
        matSauCCCD: result.data.matSauCCCD,
      };
      console.log('Upload result:', userInfo);

      // Lưu email vào AsyncStorage
      if (email) {
        await AsyncStorage.setItem("email", email);
      } else {
        console.error("Không có email");
      }
      const userInfoString = JSON.stringify(userInfo);

      const response = await axiosInstance.post("/api/v1/users/sendOTP", {email});

      await AsyncStorage.setItem("hashedOTP", response.data);
      await AsyncStorage.setItem("userInfo", userInfoString);
      navigation.navigate("Verify", { verifiedAccountType: "Chủ phòng"});

    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Tải ảnh thất bại');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin căn cước</Text>
      <View  >
            <Text style={styles.text}>1, Ảnh mặt trước của căn cước</Text>
            <View style={styles.inforIdCard}>
                <View style={styles.idCardContainer}>
                    <View
                        // source={require("../assets/image/cccd_matSau1.png")}
                        style={styles.idCardImg}
                    >
                        {/* Lớp phủ màu */}
                        {frontImageUri ? (
                          <Image 
                            style={styles.idCard}
                            source={{uri:frontImageUri}}/>
                        ) : (
                          <View style={styles.overlay} />
                        )}
                    </View>
                    <Pressable style={{position: "absolute"}}
                       onPress={() => handleSelectImage(setFrontImageUri, 'Mặt trước căn cước')}
                    >
                        <Image source={require("../assets/icon/plusIcon.jpg")} style={styles.plusIcon} />
                    </Pressable>
                </View>
            </View>


            <Text style={styles.text}>2, Ảnh mặt sau của căn cước</Text>
            <View style={styles.inforIdCard}>
                <View style={styles.idCardContainer}>
                <View
                    // source={require("../assets/image/cccd_matSau1.png")}
                    style={styles.idCardImg}
                >
                    {/* Lớp phủ màu */}
                    {backImageUri ? (
                      <Image 
                        style={styles.idCard}
                        source={{uri:backImageUri}}/>
                    ) : (
                      <View style={styles.overlay} />
                    )}
                </View>
                    <Pressable style={{position: "absolute"}}
                      onPress={() => handleSelectImage(setBackImageUri, 'Mặt sau căn cước')}

                    >
                        <Image source={require("../assets/icon/plusIcon.jpg")} style={styles.plusIcon} />
                    </Pressable>
                </View>
            </View>     
        </View>
      <TouchableOpacity
        style={styles.btn_next}
        // onPress={() => navigation.navigate('Verify')}
        // onPress={() => console.log(frontImageUri, backImageUri)}
        onPress={handleUpload}            
      >
        <Text style={styles.text_next}>Tiếp Theo</Text>
      </TouchableOpacity>
    </View>
  )
}

export default IdCardScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.Background
    },
    title: {
        alignSelf: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        marginVertical: 30,
        color: colors.blue
    },
    idCard: {
      width: 250,
      height: 170,
      resizeMode:'cover'
    },
    
    overlay: {
        width: 250,
        height: 170,
        ...StyleSheet.absoluteFillObject, // Trải đều lớp phủ
        backgroundColor: "rgba(0, 0, 0, 0.2)", // Màu đen mờ
      },

    text: {
        fontSize: 16,
        color: colors.blue,
        fontWeight: "bold",

    },
    inforIdCard: {
        marginVertical: 10, // Khoảng cách giữa các nhóm căn cước
        padding:10,
      },
      idCardContainer: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
      },
      idCardImg: {
        width: 250,
        height: 170,
        resizeMode: "cover",
        borderRadius: 10,
        alignSelf: "center",
        overflow: "hidden",
        
      },
      plusIcon: {
        // position: "absolute",
        width: 40,
        height: 40,
        resizeMode: "contain",
        backgroundColor: "#fff",
        borderRadius: 20,
      },
      btn_next: {
        alignSelf: "center",
        backgroundColor: colors.blue,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 50,
        width: 150,
      },
      text_next: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
      }
})