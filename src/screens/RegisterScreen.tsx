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

type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;
  
  const RegisterScreen: React.FC<RegisterScreenProps>  = ({ navigation }) => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setconfirmPassword] = useState<string>("");
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [ConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const clearNameInput = (): void => {
      setName("");
    };

    const clearInput = (): void => {
      setEmail("");
  };
    const togglePasswordVisibility = (): void => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!ConfirmPasswordVisible);
      };

      const handleRegister = async () => {
        if (password.length < 7) {
          Alert.alert("Mật khẩu phải có ít nhất 7 ký tự");
        } else if (password !== confirmPassword) {
          Alert.alert("Mật khẩu nhập lại không trùng khớp");
        } else {
          try {
            const userInfo = {
              tenNguoiDung: name,
              email: email,
              matKhau: password,
            };
      
            // Lưu email vào AsyncStorage
            await AsyncStorage.setItem("email", email);
            const userInfoString = JSON.stringify(userInfo);
      
            // Gửi yêu cầu API
            const response = await axiosInstance.post("/api/v1/users/sendOTP", { email });
      
            // Lưu thông tin người dùng vào AsyncStorage nếu thành công
            await AsyncStorage.setItem("hashedOTP", response.data);
            await AsyncStorage.setItem("userInfo", userInfoString);
      
            // Điều hướng đến màn hình Verify
            navigation.navigate("Verify", { verifiedAccountType: "Người dùng"});
          } catch (error) {
            if (error instanceof Error) {
              // Kiểm tra phản hồi từ server
              if (axios.isAxiosError(error) && error.response && error.response.data.message) {
                Alert.alert("Lỗi", error.response.data.message);
              } else {
                Alert.alert("Lỗi ss", error.message); 
              }
            } else {
              Alert.alert("Lỗi", "Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
            console.error("Đăng ký thất bại:", error); // Log lỗi để debug
          }
        }
      };
      
        
      }

    return (
      <SafeAreaView style={{ width: "100%", alignItems: "center", flex:1, backgroundColor:colors.Background    }}>
        <View style={{justifyContent:'center', alignItems:'center', flex: 3}}> 
          <Image source={require("../assets/image/logoRoomFinder.png")} style={{ height: 220, width: 220,  }} />
          <Text style={{ fontSize: 30, fontFamily:'outfit-bold', position:"absolute", bottom: 5}}>RoomFinder</Text>
        </View>
        <ScrollView style={{ width: "90%",   }}>
          <KeyboardAvoidingView behavior="padding">
          <Input
              placeholder="name"
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
                <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
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

          >
            <Text style={{ color: email.length > 0 ? "white" : "#857E7C" }}>
              Tiếp theo
            </Text>
          </TouchableOpacity>
          {/* <AuthGoogleButton onLoginSuccess={onLoginSuccess} /> */}
          {/* <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor:'#D5DBCD',
              backgroundColor:'#357EFF',
              padding: 12,
              alignItems: "center",
              marginBottom: 10,
            }}
            onPress={() => {
              console.log("Facebook");
            }}
          > 
            
            <Text style={{color:'white'}}>Facebook</Text>
          </TouchableOpacity> */}
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
  
  export default RegisterScreen
  
  const styles = StyleSheet.create({

    iconSeePassword: {
        height: 30,
        width: 30,
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