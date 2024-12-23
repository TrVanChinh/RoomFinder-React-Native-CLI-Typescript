import { StyleSheet, Text, View, ScrollView, Pressable, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import RoomItem from '../../../components/Room/RoomItem'
import colors from '../../../constants/colors'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { roomService} from "../../../service"
import { useUser } from '../../../context/UserContext';
import { RoomInfo } from '../../../type/room.interface';

type ListRoomScreenProps = NativeStackScreenProps<RootStackParamList, 'ListRoom'>;

const ListRoomScreen: React.FC<ListRoomScreenProps> = ({ navigation }) => {
  const { user } = useUser()
  const [listRoom, setListRoom] = useState<RoomInfo[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(user) {
          const room = await roomService.getRoomByIdUser(user.maNguoiDung.toString());
          setListRoom(room);
        }
        

      } catch (error) {
        console.error("Thông báo lỗi:", error);
      } finally {
        setLoading(false); // Kết thúc tải dữ liệu
      }
    };
  
    fetchData();
  },[])

  const handleItemPress = (room: RoomInfo) => {
    navigation.navigate("Detail", { roomInfo: room, fromScreen: 'ListRoomScreen',});
  };

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
       {/* <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >

      </ScrollView> */}

            <FlatList
              style={{ flex: 1 }}
              keyExtractor={(item) => item.maPhong.toString()}
              data={listRoom}
              renderItem={({ item }) => 
              <RoomItem item={item} onPress={() => handleItemPress(item)}/>}
            />
    </View>
  )
}

export default ListRoomScreen

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:colors.Background
  
      },
      scrollContent: {
        alignItems: 'center', 
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.Background,
      },
})