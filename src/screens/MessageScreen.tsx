import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import axiosInstance from '../service/axiosInstance';
import { useUser } from "../context/UserContext";
import Map from '../components/Map/Map';
const MessageScreen = () => {
  const [data, setData] = useState()
  const {  user, setUser } = useUser();

  // const getUser = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:5000/api/v1/users/6`);
  //     const data = response.data;
  //     console.log("Shop info:", data.data);
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //   }
  // };
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/users/6');
      console.log('Users:', response);
      // setData(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  return (
    <View>
      <Pressable
        onPress={getAllUsers}
        style={{ backgroundColor: 'red', padding:10, width:100, height:100 }}
      >
        <Text>Test</Text>
      </Pressable>
      {/* <Text>{data}</Text> */}
      <View style={{width:"100%", height:"60%"}}>
        <Map />
      </View>
    </View>
  )
}

export default MessageScreen

const styles = StyleSheet.create({})