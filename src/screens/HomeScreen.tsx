import { View, Image, Text, StyleSheet, Pressable, ScrollView, Dimensions, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Icon } from '@rneui/themed';
import colors from '../constants/colors';
import RoomItem from '../components/Room/RoomItem';
import Config from 'react-native-config';
import { roomService } from "../service"

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from "../navigation/RootStackParamList";
import { RoomInfo } from '../type/room.interface';
type HomeScreenProps = BottomTabScreenProps<RootStackParamList, 'Home'>;

console.log(Config.BASE_URL);
console.log(Config.API_KEY);

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { height, width } = Dimensions.get("window");
  const [loading, setLoading] = useState<boolean>(true)

  const [roomAtHaiChau, setRoomAtHaiChau] = useState<RoomInfo[]>([])
  const [roomAtSonTra, setRoomAtSonTra] = useState<RoomInfo[]>([])
  const [roomAtThanhKhe, setRoomAtThanhKhe] = useState<RoomInfo[]>([])
  const [roomAtLienChieu, setRoomAtLienChieu] = useState<RoomInfo[]>([])

  const handleItemPress = (room: RoomInfo) => {
    navigation.navigate("Detail", { roomInfo: room, fromScreen: 'HomeScreen', });
  };

  const getRoomForDistrict = async (district: string) => {
    try {
      const dataRoom = await roomService.getRoomByDistrict(district)
      return dataRoom
    } catch (error) {
      console.log("Lỗi lấy dữ liệu phòng.")
    }
  }

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomAtHaiChauData = await getRoomForDistrict("Hải Châu");
        setRoomAtHaiChau(roomAtHaiChauData);
        const roomAtSonTraData = await getRoomForDistrict('Sơn Trà');
        setRoomAtSonTra(roomAtSonTraData);
        const roomAtThanhKheData = await getRoomForDistrict('Thanh Khê');
        setRoomAtThanhKhe(roomAtThanhKheData);
        const roomAtLienChieuData = await getRoomForDistrict('Liên Chiểu');
        setRoomAtLienChieu(roomAtLienChieuData);
      } catch (error) {
        console.error('Error fetching room data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [])
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue} />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }
  return (

    <View style={styles.container}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent} // Chỉ định cách bố trí nội dung
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.containerSearch}>
          <Image
            source={
              require("../assets/image/streetlinemap.jpg")
            }
            style={styles.imagebackgroundSearch}

          />
          <Pressable style={styles.button_Search}
            onPress={() => navigation.navigate('Map')}
          >
            <View style={{ flexDirection: 'row' }}>
              <Icon name="map" size={24} color={colors.blue} />
              <Text style={styles.text_blue}>Tìm kiếm phòng</Text>
            </View>
            <Icon name="arrow-right" size={24} color={colors.blue} />
          </Pressable>
        </View>
{/* 
        <View style={styles.listRoom}>
            <View style={styles.category_Title}>
              <Text style={styles.category_Text}>Phòng Quận Hải Châu</Text>
              <Text style={{ color: colors.blue, marginRight: 10 }}>Xem thêm</Text>
            </View>
            <FlatList
              horizontal
              style={{ flex: 1 }}
              keyExtractor={(item) => item.maPhong.toString()}
              data={roomAtHaiChau}
              renderItem={({ item }) => {
                return (
                  <RoomItem item={item} onPress={() => handleItemPress(item)} />
                )
              }}
            /> 
          </View> */}

        {roomAtHaiChau.length > 0 ? (
          <View style={styles.listRoom}>
            <View style={styles.category_Title}>
              <Text style={styles.category_Text}>Phòng Quận Hải Châu</Text>
              <Text style={{ color: colors.blue, marginRight: 10 }}>Xem thêm</Text>
            </View>
            <FlatList
              horizontal
              style={{ flex: 1 }}
              keyExtractor={(item) => item.maPhong.toString()}
              data={roomAtHaiChau}
              renderItem={({ item }) => {
                return (
                  <RoomItem item={item} onPress={() => handleItemPress(item)} />
                )
              }}
            />
          </View>
        ) : null}

        {roomAtThanhKhe.length > 0 ? (
          <View style={styles.listRoom}>
            <View style={styles.category_Title}>
              <Text style={styles.category_Text}>Phòng Quận Thanh khê</Text>
              <Text style={{ color: colors.blue, marginRight: 10 }}>Xem thêm</Text>
            </View>
            <FlatList
              horizontal
              style={{ flex: 1 }}
              keyExtractor={(item) => item.maPhong.toString()}
              data={roomAtThanhKhe}
              renderItem={({ item }) => {
                return (
                  <RoomItem item={item} onPress={() => handleItemPress(item)} />
                )
              }}
            />
          </View>
        ) : null}

        {roomAtLienChieu.length > 0 ? (
          <View style={styles.listRoom}>
            <View style={styles.category_Title}>
              <Text style={styles.category_Text}>Phòng Quận Liên Chiểu</Text>
              <Text style={{ color: colors.blue, marginRight: 10 }}>Xem thêm</Text>
            </View>
            <FlatList
              horizontal
              style={{ flex: 1 }}
              keyExtractor={(item) => item.maPhong.toString()}
              data={roomAtLienChieu}
              renderItem={({ item }) => {
                return (
                  <RoomItem item={item} onPress={() => handleItemPress(item)} />
                )
              }}
            />
          </View>
        ) : null}

        {roomAtSonTra.length > 0 ? (
          <View style={styles.listRoom}>
            <View style={styles.category_Title}>
              <Text style={styles.category_Text}>Phòng Quận Sơn Trà</Text>
              <Text style={{ color: colors.blue, marginRight: 10 }}>Xem thêm</Text>
            </View>
            <FlatList
              horizontal
              style={{ flex: 1 }}
              keyExtractor={(item) => item.maPhong.toString()}
              data={roomAtSonTra}
              renderItem={({ item }) => {
                return (
                  <RoomItem item={item} onPress={() => handleItemPress(item)} />
                )
              }}
            />
          </View>
        ) : null} 
      </ScrollView>

    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.Background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.Background

  },
  scrollContent: {
    alignItems: 'center',
  },
  containerSearch: {
    padding: 10,
    alignSelf: "center",
    width: "100%",
    height: 100,
    position: 'relative',
    justifyContent: 'center'
  },
  imagebackgroundSearch: {
    width: "100%",
    height: "100%",
    resizeMode: 'cover',
  },

  button_Search: {
    position: 'absolute',
    width: '80%',
    height: 40,
    backgroundColor: colors.BackgroundHome,
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignSelf: 'center',
    zIndex: 2,
  },

  text_blue: {
    color: colors.blue,
    fontSize: 14,
    paddingLeft: 10
  },

  listRoom: {
    width: "95%",
    height: 200,
    marginBottom: 30,
  },
  category_Text: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    color: 'black'
  }, 
  category_Title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    alignItems: 'center'
  },
})
