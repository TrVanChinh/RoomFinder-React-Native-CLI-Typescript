import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native'
import React, { useState } from 'react'
import { RootStackParamList } from "../navigation/RootStackParamList";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import colors from '../constants/colors';
import { Icon } from '@rneui/themed';
import DatePicker from 'react-native-date-picker'
type UserInfoScreenProps = NativeStackScreenProps<RootStackParamList, 'UserInfo'>;
type OnChangeEvent = {
  type: string;
  nativeEvent: any;
};
const UserInfoScreen: React.FC<UserInfoScreenProps> = ({ navigation }) => {
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);



  return (
    <View style={{ flex: 1, backgroundColor:"#F5F5F5" }}>
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
                    require("../assets/image/Room.jpg")
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
                // onPress={changeAvatar}
              >
              <Icon name='camera-alt' size={25} color={colors.blue}/>
              </TouchableOpacity>
            </View>

            <View style={{ padding: 15 }}>
                <View>
                  <Text style={styles.catalog_text}>Họ và tên:</Text>
                  <View style={styles.component}>
                  <TextInput
                    style={styles.input}
                    onChangeText={setName}
                    // value={name}
                  />
                  </View>
                </View>
                <View>
                  <Text style={styles.catalog_text}>Email:</Text>
                  <View style={styles.component}>
                  <TextInput
                    style={styles.input}
                    onChangeText={setName}
                    // value={name}
                  />
                  </View>
                </View>
                <View>
                  <Text style={styles.catalog_text}>Số điện thoại:</Text>
                  <View style={styles.component}>
                  <TextInput
                    style={styles.input}
                    onChangeText={setName}
                    // value={name}
                  />
                  </View>
                </View>
                <View>
                  <Text style={styles.catalog_text}>Ngày sinh:</Text>
                  <View style={styles.component}>
                    <TextInput
                      style={styles.input}
                      onChangeText={setName}
                      // value={name}
                    />
                    <TouchableOpacity
                      onPress={() => setShow(true)}
                    >
                      <Icon name='calendar-month' size={25} color={colors.blue} style={{marginRight: 10,}}/>
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
                      onChangeText={setName}
                      value={name}
                      editable={false} // Không cho phép chỉnh sửa
                      selectTextOnFocus={false} // Ngăn chọn văn bản
                    />
                    <Image source={require('../assets/icon/angle-right.png')} style={styles.icon} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.btn_confirm}>
                  <Text style={styles.btn_text}>Xác nhận</Text>
                </TouchableOpacity>
            </View>
    </View>
  )
}

export default UserInfoScreen

const styles = StyleSheet.create({
  component: {
    backgroundColor: colors.BackgroundHome,
    borderRadius: 15,
    shadowColor: "#000",
    justifyContent:'space-between',
    marginVertical: 5,
    flexDirection:'row',
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
    width:'85%',
    marginLeft: 12,
    fontSize:16,
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
    fontSize:16
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