import {
    StyleSheet,
    Text,
    Image,
    SafeAreaView,
    TouchableOpacity,
    KeyboardAvoidingView,
    View,
    Alert,
  } from "react-native";
  import React from "react";
  import { useState } from "react";
import { Input, Icon } from "@rneui/base";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from "../navigation/RootStackParamList";
import colors from "../constants/colors";
import axiosInstance from "../service/axiosInstance";
import axios from "axios";
import { useUser } from "../context/UserContext";

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
  
  const LoginScreen: React.FC<LoginScreenProps>  = ({ navigation }) => {
    const {  user, setUser } = useUser();
    const [inputValue, setInputValue] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  
    const clearInput = (): void => {
      setInputValue("");
    };
    const togglePasswordVisibility = (): void => {
      setIsPasswordVisible(!isPasswordVisible);
    };
  
    const handleLogin = async() => {
      try {
        const data = {
          email: inputValue,
          matKhau: password,
        }
        const response = await axiosInstance.post("/api/v1/auth/user", { data });
        console.log(response.data);
        navigation.navigate('Main');
        setUser(response.data)
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
          console.error("Đăng nhập thất bại:", error); // Log lỗi để debug
      }
    }
  };

    return (
      <SafeAreaView style={{ width: "100%", alignItems: "center", flex:1,backgroundColor:colors.Background
    }}>
        <View style={{justifyContent:'center', alignItems:'center', flex: 3}}> 
          <Image source={require("../assets/image/logoRoomFinder.png")} style={{ height: 220, width: 220,  }} />
          <Text style={{ fontSize: 30, fontFamily:'outfit-bold', position:"absolute", bottom: 5}}>RoomFinder</Text>
        </View>
        <View style={{ width: "90%", top: 30, flex: 7 }}>
          <KeyboardAvoidingView behavior="padding">
            <Input
              placeholder="Email"
              onChangeText={(text: string) => setInputValue(text)}
              value={inputValue}
              leftIcon={<Icon name="email" size={24} color="#857E7C" />}
              rightIcon={
                inputValue ? (
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
          </KeyboardAvoidingView>
          <TouchableOpacity
            style={{
              backgroundColor: inputValue.length > 0 && password.length > 0 ? "#F1582C" : "lightgray",
              padding: 12,
              alignItems: "center",
            }}
            disabled={inputValue.length === 0}
            onPress={handleLogin}
          >
            <Text style={{ color: inputValue.length > 0 ? "white" : "#857E7C" }}>
              Đăng nhập
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", alignItems: 'center', marginVertical: 20 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: "#D5DBCD" }}></View>
            <Text style={{ color:"#857E7C"}}>Hoặc</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "#D5DBCD"}}></View>
          </View>
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
            <Text>Bạn chưa có tài khoản?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{ color:'blue'}}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
            
        </View>
      </SafeAreaView>
    );
  };
  
  export default LoginScreen
  
  const styles = StyleSheet.create({

    iconSeePassword: {
        height: 30,
        width: 30,
    }
  })