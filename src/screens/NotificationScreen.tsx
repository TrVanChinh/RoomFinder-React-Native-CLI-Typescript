import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { Icon } from '@rneui/themed';
import MapboxGL from '@rnmapbox/maps';
import Checkbox from '../components/Checkbox';
// 'pk.eyJ1IjoiY2hpbmh0cmFuMTAwNSIsImEiOiJjbTRhcGdodHgwYnRzMnFzZW96eTV3ZDlrIn0.10AKRRbq5mQ2eGCg_HQVrA'
//lb3ODvIFozZ1q6pXcT0rfuJ9ZsWv6ekAmmpm2InJ
//Gzv00YTeVfzrMevtjeuvZ5dp8ol8i1sh0aMQF5Qm
// MapboxGL.setAccessToken('pk.eyJ1IjoiY2hpbmh0cmFuMTAwNSIsImEiOiJjbTRhcGdodHgwYnRzMnFzZW96eTV3ZDlrIn0.10AKRRbq5mQ2eGCg_HQVrA');
// MapboxGL.setConnected(true)
// MapboxGL.setTelemetryEnabled(false);
// MapboxGL.setWellKnownTileServer('Mapbox');
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from "../navigation/RootStackParamList";
import VideoPlayer, { type VideoPlayerRef } from 'react-native-video-player';
import { IAddress } from '../type/address.interface';
import { addressService } from '../service';

type NotificationScreenProps = BottomTabScreenProps<RootStackParamList, 'Notification'>;

const NotificationScreen : React.FC<NotificationScreenProps> = ({navigation}) => {
  const [isCheckbox1Selected, setIsCheckbox1Selected] = useState(false);
  const playerRef = useRef<VideoPlayerRef>(null);
  const handleCheckbox1Change = (value: boolean) => {
    setIsCheckbox1Selected(value);
    console.log(value)
  };

  const updateAddress = async (address: IAddress, addressId: number) => { 
    const maDiaChi = await addressService.updateAddress(address, addressId)
  }

  const address = {
      "maDiaChi": 2,
      "soNha": "số 1171 Đường 609",
      "phuongXa": "Điện Thọ",
      "quanHuyen": "Điện Bàn",
      "tinhThanh": "Quảng Nam",
      "kinhDo": 123.424,
      "viDo": 12.313
  }
  return (
    <View>
      <Text>NotificationScreen</Text>
      <Icon name='messenger-outline' size={20}/>
        <Icon name='message' size={20} color="gray"/>
        <Icon name='change-circle' size={20} color="gray"/>
        <Icon name='close' size={20} color="gray"/>
        <Icon name='my-location' size={20} color="gray"/>
        <Icon name='radio-button-checked' size={20} color="gray"/>
        <Icon name='more-time' size={20} color="gray"/>
        <Icon name='delete' size={20} color="gray"/>
        <Icon name='edit' size={20} color="gray"/>

        <Checkbox onCheckbox1Change={handleCheckbox1Change}/>
        {/* "radio","radio-button-checked","radio-button-off","radio-button-on","radio-button-unchecked", */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Map')}
      >
        <Text>Map</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => updateAddress(address, 25)}
      >
        <Text>Chat</Text>
      </TouchableOpacity>
      
    </View>

  )
}

export default NotificationScreen

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: 300,
    width: 300,
  },
  map: {
    flex: 1
  }
});