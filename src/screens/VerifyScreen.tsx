import React, { useState, useRef, useEffect } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import colors from '../constants/colors';
import { Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../service/axiosInstance";
import axios from "axios";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from "../navigation/RootStackParamList";

type VerifyScreenProps = NativeStackScreenProps<RootStackParamList, 'Verify'>;
  
const VerifyScreen: React.FC<VerifyScreenProps>  = ({ navigation, route }) => {
  const accountType = route.params.verifiedAccountType
  const [code, setCode] = useState(['', '', '', '', '']);
  const inputs = useRef<TextInput[]>([]); // Quản lý tham chiếu tới từng ô nhập
  const [hashedOTP, setHashedOTP] = useState('')
  const [userInfo, setUserInfo] = useState([])
  const handleInputChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Tự động chuyển sang ô tiếp theo
    if (text.length === 1 && index < inputs.current.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleDataStorage = async() => { 
    const hashedOTP = await AsyncStorage.getItem("hashedOTP")
    const infoUserRegister: string | null = await AsyncStorage.getItem("userInfo")
    if (infoUserRegister && hashedOTP) {
      const userInfo = JSON.parse(infoUserRegister);
      console.log("verify",userInfo)
      setUserInfo(userInfo);
      setHashedOTP(hashedOTP);
    } else {
      console.error("dữ liệu trong storage trống.");
    }
  }

  const handleSubmit = async() => {
    if (code.join('').length < 5) {
      Alert.alert("Mã otp không đủ số");
    } else {
      try {
        const data = {
          otp: code.join(''),
          hashedOTP: hashedOTP,
          user: userInfo,
        }
        console.log(data)
        if(accountType=="Người dùng") {
          const response = await axiosInstance.post("/api/v1/users", { data });
          Alert.alert("Đăng ký tài khoản thành công.");

        } else if(accountType =="Chủ phòng") {
          const response = await axiosInstance.post("/api/v1/users/roomOwner", { data });
          Alert.alert("Đăng ký tài khoản thành công");

        }
        navigation.navigate("Login");
        
      } catch (error) {
        if (error instanceof Error) {
          if (axios.isAxiosError(error) && error.response && error.response.data.message) {
            Alert.alert("Lỗi", error.response.data.message);
          } else {
            Alert.alert("Lỗi", error.message); 
          }
        } else {
          Alert.alert("Lỗi", "Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
          console.error("Xác minh thất bại:", error);
      }
      }
  }
}

  useEffect(() => {
    handleDataStorage()
  },[])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác minh tài khoản</Text>
      <View>
        <Text style={styles.label}>Email</Text>
        <Text>Nhập mã xác minh nhận được qua email.</Text>
        <View style={styles.codeContainer}>
          {code.map((value, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputs.current[index] = el!)} // Lưu tham chiếu của từng TextInput
              style={styles.codeInput}
              keyboardType="numeric"
              maxLength={1}
              value={value}
              onChangeText={(text) => handleInputChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>
        <Pressable style={styles.btn_confirm} onPress={handleSubmit}>
          <Text style={styles.btn_text}>Xác nhận</Text>
        </Pressable>

        <Pressable>
          <Text style={styles.link}>Không nhận được mã xác minh Email?</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default VerifyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:colors.Background
  },
  title: {
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 30,
    color: colors.blue,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  codeInput: {
    marginTop: 20,
    width: 40,
    height: 50,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    fontSize: 18,
    fontWeight: 'bold',
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
  link: {
    alignSelf: 'center',
    color: 'black',
  },
})
