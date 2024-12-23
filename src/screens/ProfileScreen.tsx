import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from "../navigation/RootStackParamList";
import colors from '../constants/colors';
import { Icon } from '@rneui/themed';
import { useUser } from '../context/UserContext';

type ProfileScreenProps = BottomTabScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, setUser } = useUser();

  const handleLogOut = () => {
    setUser(null);
    navigation.navigate('Login');
  }
  return (
    <>
      {user == null ? (
        <View style={styles.container}>
          <Text style={styles.title}>Hồ sơ</Text>
          <View style={{ alignItems:'center', justifyContent:'center', marginTop:100}}>
            <Text style={styles.catalog_text}>
              Đăng nhập để xem hồ sơ
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={[styles.catalog_text, {color: colors.blue}]}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (

        <View style={styles.container}>
          <Text style={styles.title}>Hồ sơ</Text>
          <View style={styles.component}>
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <Image
                source={
                  user.hinhDaiDien? { uri: user.hinhDaiDien } : require("../assets/image/Room.jpg")
                }
                style={styles.avt_image}
              />
              <View style={{ marginLeft: 5, justifyContent: 'center' }}>
                <Text style={styles.label}>
                  {user.tenNguoiDung}
                </Text>
                <Text>
                {user.email}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.component}>
            <Text style={styles.catalog_text}>
              Tổng quan
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("UserInfo")}
            >
              <View style={styles.catalogContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.iconContainer}>
                    <Image source={require('../assets/icon/user.png')} style={styles.icon} />
                  </View>
                  <Text style={styles.label}>
                    Thông tin tài khoản
                  </Text>
                </View>
                <Image source={require('../assets/icon/angle-right.png')} style={styles.icon} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={()=> navigation.navigate("UpdatePassword")}
            >
              <View style={styles.catalogContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.iconContainer}>
                    <Image source={require('../assets/icon/lock.png')} style={styles.icon} />
                  </View>
                  <Text style={styles.label}>
                    Cập nhật mật khẩu
                  </Text>
                </View>
                <Image source={require('../assets/icon/angle-right.png')} style={styles.icon} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <View style={styles.catalogContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.iconContainer}>
                    <Image source={require('../assets/icon/bookmark.png')} style={styles.icon} />
                  </View>
                  <Text style={styles.label}>
                    Đã lưu
                  </Text>
                </View>
                <Image source={require('../assets/icon/angle-right.png')} style={styles.icon} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleLogOut()}
            >
              <View style={styles.catalogContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.iconContainer}>
                    <Image source={require('../assets/icon/exit_red.png')} style={styles.icon} />
                  </View>
                  <Text style={styles.label}>
                    Đăng xuất
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {user.maLTK === 3 && user.trangThaiTaiKhoan ==="Đang hoạt động" ? (
            <View style={styles.component}>
            <Text style={styles.catalog_text}>
              Quản lý phòng
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("CreateRoom")}
            >
              <View style={styles.catalogContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.iconContainer}>
                    <Image source={require('../assets/icon/square-plus.png')} style={styles.icon} />
                  </View>
                  <Text style={styles.label}>
                    Tạo thông tin phòng
                  </Text>
                </View>
                <Image source={require('../assets/icon/angle-right.png')} style={styles.icon} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("ListRoom")}
            >
              <View style={styles.catalogContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.iconContainer}>
                    <Image source={require('../assets/icon/apps.png')} style={styles.icon} />
                  </View>
                  <Text style={styles.label}>
                    Danh sách phòng
                  </Text>
                </View>
                <Image source={require('../assets/icon/angle-right.png')} style={styles.icon} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
            // onPress={() => navigation.navigate("CreateRoom")}
            >
              <View style={styles.catalogContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.iconContainer}>
                    <Image source={require('../assets/icon/stats.png')} style={styles.icon} />
                  </View>
                  <Text style={styles.label}>
                    Thống kê
                  </Text>
                </View>
                <Image source={require('../assets/icon/angle-right.png')} style={styles.icon} />
              </View>
            </TouchableOpacity>
          </View>
          ): null}
          

          {/* <TouchableOpacity
            style={styles.btn_login}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={{ color: "white" }}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn_login}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={{ color: "white" }}>Đăng kí</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn_login}
            onPress={() => navigation.navigate("RegisterRoomMaster")}
          >
            <Text style={{ color: "white" }}>Đăng kí chủ phòng</Text>
          </TouchableOpacity> */}
        </View>
      )}
    </>

  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.Background
  },
  title: {
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 10,
    color: colors.blue,
  },
  component: {
    backgroundColor: colors.BackgroundHome,
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    justifyContent: 'center',
    marginVertical: 5,
  },
  btn_login: {
    width: 100,
    borderWidth: 1,
    backgroundColor: 'blue',
    borderColor: "white",
    alignItems: "center",
    paddingVertical: 10,
    marginVertical: 10,
    marginLeft: 10,
  },
  avt_image: {
    width: 40,
    height: 40,
    borderRadius: 100,
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  catalog_text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray_text,
  },
  catalogContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10
  },
  iconContainer: {
    backgroundColor: '#F2F2F2',
    height: 40,
    width: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    width: 20,
    height: 20,
  }
});
