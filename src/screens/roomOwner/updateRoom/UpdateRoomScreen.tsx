import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import colors from '../../../constants/colors'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { useRoomUpdate } from '../../../context/UpdateRoomContext';

type UpdateRoomScreenProps = NativeStackScreenProps<RootStackParamList, 'UpdateRoom'>;

const UpdateRoomScreen: React.FC<UpdateRoomScreenProps> = ({ navigation, route }) => {
  const room = route.params
  const { roomUpdate, setRoomUpdate } = useRoomUpdate();
  useEffect(() =>{
    setRoomUpdate(room)
  },[room])
  return (
    <View style={styles.container}>
      <Pressable 
        style={[styles.component, styles.shadowStyle]}
        onPress={() => navigation.navigate("GeneralInfor")}
      >
        <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
          <Image source={require('../../../assets/icon/clipboard-list.png')} style={styles.icon} />
          <Text style={styles.label}>Thông tin chung</Text>
        </View>
        <Image source={require('../../../assets/icon/angle-small-right.png')} style={styles.icon} />
      </Pressable>

      <Pressable 
        style={[styles.component, styles.shadowStyle]}
        onPress={() => navigation.navigate("DepositFee", room)}
      >
        <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
          <Image source={require('../../../assets/icon/tags.png')} style={styles.icon} />
          <Text style={styles.label}>Phí đặt cọc</Text>
        </View>
        <Image source={require('../../../assets/icon/angle-small-right.png')} style={styles.icon} />
      </Pressable>

      <Pressable 
        style={[styles.component, styles.shadowStyle]}
        onPress={() => navigation.navigate("Media", room)}
      >
        <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
          <Image source={require('../../../assets/icon/picture.png')} style={styles.icon} />
          <Text style={styles.label}>Hình ảnh và video</Text>
        </View>
        <Image source={require('../../../assets/icon/angle-small-right.png')} style={styles.icon} />
      </Pressable>
    </View>
  )
}

export default UpdateRoomScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Background,
    alignItems: 'center',

  },
  component: {
    marginTop: 10,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.BackgroundHome,
    width: "95%",
    height: 80
  },

  shadowStyle: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  icon: {
    width: 25,
    height: 25,
    marginHorizontal: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
})