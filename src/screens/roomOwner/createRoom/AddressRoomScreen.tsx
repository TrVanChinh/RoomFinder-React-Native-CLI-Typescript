
import React, { memo, useEffect, useRef, useState } from 'react';
import { View, Alert, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput, Pressable, Dimensions, SafeAreaView, FlatList } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import MapAPI from '../../../core/map/api/MapAPI'
import { Icon } from '@rneui/themed';
import Geolocation from '@react-native-community/geolocation';
import colors from '../../../constants/colors';
import { useAddress } from '../../../context/AddressContext';
import { IAddress, ResponseAddress, ResultMapApi } from '../../../type/address.interface';
import { BottomModal, SlideAnimation, ModalContent } from "react-native-modals";

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootStackParamList';

MapboxGL.setAccessToken('pk.eyJ1IjoiY2hpbmh0cmFuMTAwNSIsImEiOiJjbTRhcGdodHgwYnRzMnFzZW96eTV3ZDlrIn0.10AKRRbq5mQ2eGCg_HQVrA');

type AddressRoomScreenProps = NativeStackScreenProps<RootStackParamList, 'AddressRoom'>;
const AddressRoomScreen: React.FC<AddressRoomScreenProps>  = ({ navigation, route }) => {
  const { height, width } = Dimensions.get("window");
  const Screen = route.params.fromScreen
  const { address, setAddress } = useAddress();
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([108.211, 16.074]);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const mapRef = React.useRef<MapboxGL.MapView>(null);
  const [showMarker, setShowMarker] = useState<boolean>();

  const [addressList, setAddressList] = useState<IAddress[]>([])
  const [search, setSearch] = useState("");
  const [street, setStreet] = useState("");
  const [valueProvinces, setValueProvinces] = useState("");
  const [valueDistrict, setValueDistrict] = useState("");
  const [valueWard, setValueWard] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [loadMap, setLoadMap] = useState(
    'https://tiles.goong.io/assets/goong_map_web.json?api_key=lb3ODvIFozZ1q6pXcT0rfuJ9ZsWv6ekAmmpm2InJ',
  );

  const handleMapPress = async (event: any) => {
    const { geometry } = event;
    const [longitude, latitude] = geometry.coordinates;
    setAddressList([])
    setShowMarker(true);

    try {
      const response = await MapAPI.getGeocoding(latitude, longitude);
      const address = response.results[0]?.formatted_address || 'Không tìm thấy địa chỉ';
      const address_components = response.results[0]?.address_components || 'Không tìm thấy địa chỉ';
      const results = response.results || 'Không tìm thấy địa chỉ';

      // Alert.alert('Thông tin vị trí', `Tọa độ: ${longitude}, ${latitude}\nĐịa chỉ: ${address}`);
      setCurrentLocation([longitude, latitude])
      // console.log("lần 2: ", results[0].geometry)
      // console.log("lần 3: ", results[1].geometry)
      // console.log("lần 4: ", results[2].geometry)

      const updatedAddressList = results.map((item: ResultMapApi) => {
        const province = item?.compound?.province || "Không xác định";
        const district = item?.compound?.district || "Không xác định";
        const commune = item?.compound?.commune || "Không xác định";
        const numberHouse = item.address_components[0]?.short_name || "Không xác định";
        const tstreet = item.address_components[1]?.short_name;

        const fullAddress =
          tstreet === commune || tstreet === district || tstreet === province
            ? numberHouse
            : `${numberHouse}, ${tstreet}`;

        return {
          soNha: fullAddress,
          phuongXa: commune,
          quanHuyen: district,
          tinhThanh: province,
          kinhDo: longitude,
          viDo: latitude,
        };
      });

      setAddressList(updatedAddressList);
      console.log("lần 4: ", updatedAddressList)
      // const province = response.results[0]?.compound.province
      // const district = response.results[0]?.compound.district
      // const compound = response.results[0]?.compound.commune
      // const numberHouse = address_components[0]?.short_name
      // const tstreet = address_components[1]?.short_name
      // let adfdress: String = ""

      // setValueProvinces(province)
      // setValueDistrict(district)
      // setValueWard(compound)
      // if (tstreet == compound || tstreet == district || tstreet == province) {
      //   adfdress = numberHouse
      //   setStreet(numberHouse)
      // } else {
      //   adfdress = (`${numberHouse}, ${tstreet}`)
      //   setStreet(`${numberHouse}, ${tstreet}`)
      // }

      // console.log("lần 1: ", adfdress + ", " + compound + ", " + district + "," + province)
      // console.log("lần 2: ", response.results[0]?.compound)

      // console.log(response.results[0]?.compound)
      // console.log(response.results[0]?.compound.commune)
      // console.log(response.results[0]?.name)
      // console.log("Good: ", address_components[0]?.short_name)
      // console.log(response.results[0]?.name)
      // console.log(address_components[1]?.short_name)
      // setShowMarker(true); 
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy địa chỉ từ API Goong');
    }
  };

  const getCurrentLocation = () => {
    setShowMarker(true);
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([longitude, latitude]);
        
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const handleFindPlace = async (search: string) => {
    if (search.trim() === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập từ khóa tìm kiếm');
      return;
    }
    try {
      const response = await MapAPI.getFindText(search);
      // console.log('Place found:', response);
      // console.log('Place found:', response.candidates[0].geometry);
      const location = response.candidates[0]?.geometry?.location;
      const latitude = parseFloat(location?.lat);
      const longitude = parseFloat(location?.lng);
      setCurrentLocation([longitude, latitude]);
      setShowMarker(false);
    } catch (error) {
      console.error('Error finding place:', error);
    }
  };

  const handleChooseSuggert = (address: IAddress) => {
    setModalVisible(true)
    setStreet(address.soNha),
    setValueWard(address.phuongXa), 
    setValueDistrict(address.quanHuyen), 
    setValueProvinces(address.tinhThanh)
  }

  const submit = () => { 
    if(street=="") {
      Alert.alert('Thông báo', 'Vui lòng nhập thông tin đầy đủ')
      return;
    } 
    setAddress({
      maDiaChi:0,
      soNha: street,
      phuongXa: valueWard,
      quanHuyen: valueDistrict,
      tinhThanh: valueProvinces,
      kinhDo: currentLocation[0],
      viDo: currentLocation[1],
    })
    if(Screen === "GeneralInforScreen") {
      navigation.navigate('GeneralInfor')
    } else {
      navigation.navigate('CreateRoom')
    }
    
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <MapboxGL.MapView
            styleURL={loadMap}
            style={{ flex: 1 }}
            projection="globe"
            zoomEnabled={true}
            onPress={handleMapPress}
            ref={mapRef}
          >
            <MapboxGL.Camera
              ref={cameraRef}
              centerCoordinate={currentLocation}
              //   centerCoordinate={locationsState[0].coordinates}
              zoomLevel={15}
            />
            {showMarker && ( 
              <MapboxGL.PointAnnotation id={'location.Address'} coordinate={currentLocation}>
                <View>
                  <Icon name="location-on" size={30} color="blue" />
                </View>
              </MapboxGL.PointAnnotation>
            )}
          </MapboxGL.MapView>
          <View style={[styles.searchbar, styles.shadowStyle]}>
            <TextInput
              placeholder='Tìm kiếm'
              style={styles.inputSearch}
              onChangeText={setSearch}
              value={search}
            />
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => handleFindPlace(search)}
            >
              <Icon name='search' size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View style={styles.address_container}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                onPress={getCurrentLocation}
                style={[styles.btn_Geolocation, styles.shadowStyle]}
              >
                <Icon name='my-location' size={30} color={colors.blue} />
              </TouchableOpacity>
            </View>

            {addressList.length > 0 ? (
              <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 5, height: height * 0.35 }}>

                <FlatList
                  style={{ flex: 1 }}
                  keyExtractor={(item, index) => index.toString()}
                  data={addressList}
                  showsVerticalScrollIndicator={true}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity style={styles.suggestAddress}
                        onPress={() => 
                          handleChooseSuggert(item)
                        }
                      >
                        <Icon name='location-on' size={20} color={colors.blue} />
                        <Text style={{ fontSize: 16, paddingHorizontal: 5 }}>{item.soNha}, {item.phuongXa}, {item.quanHuyen}, {item.tinhThanh}</Text>
                      </TouchableOpacity>
                    );
                  }}
                />

              </View>
            ) : (
              <View></View>
            )}
          </View>
        </View>
      </SafeAreaView>
      <BottomModal
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => {
          setModalVisible(!modalVisible);
          return false; // Trả về boolean
        }}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent
          style={{ width: "100%", height: height * 0.35, alignItems: "center" }}
        >
          <View style={{ width: "100%" }}>

            <Text style={styles.inputAddress}>
              {valueWard}, {valueDistrict}, {valueProvinces}
            </Text>

            <TextInput
              placeholder='Địa chỉ'
              style={styles.inputAddress}
              onChangeText={setStreet}
              value={street} />

            <TouchableOpacity style={styles.btn_confirm}
              onPress={submit}
            >
              <Text style={styles.btn_text}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </ModalContent>
      </BottomModal>
    </>

  )
}


export default AddressRoomScreen

const styles = StyleSheet.create({
  btn_Geolocation: {
    // position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    zIndex: 1,
    bottom: 10,
    right: 10,
    borderRadius: 15,
    backgroundColor: colors.Background,
    padding: 10,
  },
  address_container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
  },
  searchbar: {
    flexDirection: "row",
    position: "absolute",
    top: 30,
    left: 30,
    right: 30,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'space-between',
    // width:"80%", 
    height: 40,
    backgroundColor: 'white',
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
  inputSearch: {
    paddingLeft: 20,
    width: "85%",
    fontSize: 16,
  },

  inputAddress: {
    margin: 10,
    padding:10,
    justifyContent:'center',
    backgroundColor: colors.Background,
    borderRadius: 15,
    fontSize:16,
    height: 50,
    color:'black'
  },

  suggestAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    borderColor: colors.gray_text
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