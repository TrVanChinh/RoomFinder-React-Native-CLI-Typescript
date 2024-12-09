import {
    StyleSheet,
    Text,
    Image,
    SafeAreaView,
    TouchableOpacity,
    KeyboardAvoidingView,
    View,
    ScrollView,
    Alert,
  } from "react-native";
  import React from "react";
  import { useState } from "react";
import { Input, Icon } from "@rneui/base";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from "../navigation/RootStackParamList";
import colors from "../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../service/axiosInstance";
import axios from "axios";
import IRegister from "../type/register.interface";

type RegisterRoomMasterScreennProps = NativeStackScreenProps<RootStackParamList, 'RegisterRoomMaster'>;
  
  const RegisterRoomMasterScreen: React.FC<RegisterRoomMasterScreennProps>  = ({ navigation }) => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [cccd, setCCCD] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [sdt, setSdt] = useState<string>("");
    const [confirmPassword, setconfirmPassword] = useState<string>("");
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [ConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const clearNameInput = (): void => {
      setName("");
    };
    const clearCCCDInput = (): void => {
      setCCCD("");
    };
    const clearInput = (): void => {
      setEmail("");
    };
    const clearSDTInput = (): void => {
      setSdt("");
    };
    const togglePasswordVisibility = (): void => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!ConfirmPasswordVisible);
      };

      const handleRegister = async () => {
        if (password.length < 7) {
          Alert.alert("Mật khẩu phải có ít nhất 7 ký tự.");
        } else if (password !== confirmPassword) {
          Alert.alert("Mật khẩu nhập lại không trùng khớp.");
        } else if(sdt.length > 10 || sdt.length <10) {
          Alert.alert("Số điện thoại không hợp lệ.");
        } else if (cccd.length !== 12) {
          Alert.alert("Căn cước công dân không hợp lệ.");
        } else 
        {
          try {
            const userInfo: IRegister = {
              tenNguoiDung: name,
              email: email,
              matKhau: password,
              soCCCD: cccd,
              sdt: sdt,
            };

            const response = await axiosInstance.post("/api/v1/users/checkInfo", userInfo);
      
            await AsyncStorage.setItem("email", email);
            navigation.navigate("IdCard", userInfo);

            //const userInfoString = JSON.stringify(userInfo);
            //const response = await axiosInstance.post("/api/v1/users/sendOTP", { email });
            // await AsyncStorage.setItem("hashedOTP", response.data);
            // await AsyncStorage.setItem("userInfo", userInfoString);
          } catch (error) {
            if (error instanceof Error) {
              if (axios.isAxiosError(error) && error.response && error.response.data.message) {
                Alert.alert("Lỗi", error.response.data.message);
              } else {
                Alert.alert("Lỗi ss", error.message); 
              }
            } else {
              Alert.alert("Lỗi", "Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
            console.error("Đăng ký thất bại:", error);
          }
        }
        
      };
      
        
      }
    
    return (
      <SafeAreaView style={{ width: "100%", alignItems: "center", flex:1,backgroundColor:colors.Background
    }}>
        <View style={{justifyContent:'center', alignItems:'center', flex: 3}}> 
          <Image source={require("../assets/image/logoRoomFinder.png")} style={{ height: 220, width: 220,  }} />
          <Text style={{ fontSize: 30, fontFamily:'outfit-bold', position:"absolute", bottom: 5}}>RoomFinder</Text>
        </View>
        <ScrollView style={{ width: "90%"  }}>
          <KeyboardAvoidingView behavior="padding">
          <Input
              placeholder="Name"
              onChangeText={(text: string) => setName(text)}
              value={name}
              leftIcon={<Icon name="person" size={24} color="#857E7C" />}
              rightIcon={
                name ? (
                  <Icon
                    name="close"
                    size={24}
                    color="#857E7C"
                    onPress={clearNameInput}
                  />
                ) : undefined
              }
            />
            <Input
              placeholder="Email"
              onChangeText={(text: string) => setEmail(text)}
              value={email}
              leftIcon={<Icon name="email" size={24} color="#857E7C" />}
              rightIcon={
                email ? (
                  <Icon
                    name="close"
                    size={24}
                    color="#857E7C"
                    onPress={clearInput}
                  />
                ) : undefined
              }
            />

            <Input
              placeholder="SDT"
              onChangeText={(text: string) => setSdt(text)}
              value={sdt}
              leftIcon={<Icon name="phone" size={24} color="#857E7C" />}
              rightIcon={
                sdt ? (
                  <Icon
                    name="close"
                    size={24}
                    color="#857E7C"
                    onPress={clearSDTInput}
                  />
                ) : undefined
              }
            />

            <Input
              placeholder="CCCD"
              onChangeText={(text: string) => setCCCD(text)}
              value={cccd}
              leftIcon={<Icon name="person" size={24} color="#857E7C" />}
              rightIcon={
                email ? (
                  <Icon
                    name="close"
                    size={24}
                    color="#857E7C"
                    onPress={clearCCCDInput}
                  />
                ) : undefined
              }
            />
            
            <Input
              secureTextEntry={!isPasswordVisible}
              placeholder="Mật khẩu"
              onChangeText={(text: string)=> setPassword(text)}
              value={password}
              leftIcon={<Icon name="lock" size={24} color="#857E7C" />}
              rightIcon={
                <TouchableOpacity onPress={togglePasswordVisibility}>
                    <Image 
                        source={ isPasswordVisible ? require("../assets/icon/glass.png") : require("../assets/icon/glass_close.png")}
                        // size={24} 
                        // color="#857E7C" 
                        style={styles.iconSeePassword}
                    />
                </TouchableOpacity>
                  
              }
            />
             <Input
              secureTextEntry={!ConfirmPasswordVisible}
              placeholder="Xác nhận mật khẩu"
              onChangeText={(text: string)=> setconfirmPassword(text)}
              value={confirmPassword}
              leftIcon={<Icon name="lock" size={24} color="#857E7C" />}
              rightIcon={
                <TouchableOpacity 
                  onPress={toggleConfirmPasswordVisibility}
                >
                    <Image 
                        source={ isPasswordVisible ? require("../assets/icon/glass.png") : require("../assets/icon/glass_close.png")}
                        // size={24} 
                        // color="#857E7C" 
                        style={styles.iconSeePassword}
                    />
                </TouchableOpacity>
                  
              }
            />
          </KeyboardAvoidingView>
          <TouchableOpacity
            style={{
              backgroundColor: email.length > 0 && password.length > 0 ? colors.blue : "lightgray",
              padding: 12,
              alignItems: "center",
            }}
            disabled={email.length === 0}
            onPress={handleRegister}
              // onPress={() => navigation.navigate("IdCard")}
          >
            <Text style={{ color: email.length > 0 ? "white" : "#857E7C" }}>
              Tiếp theo
            </Text>
          </TouchableOpacity>
          <View style={{flexDirection:'row', justifyContent:'center', alignItems:"center", paddingTop:20}}>
            <Text>Bạn đã có tài khoản?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ color:'blue'}}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
            
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default RegisterRoomMasterScreen
  
  const styles = StyleSheet.create({

    iconSeePassword: {
        height: 30,
        width: 30,
    }
  })