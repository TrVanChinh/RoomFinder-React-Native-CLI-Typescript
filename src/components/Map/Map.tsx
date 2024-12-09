import React, { useEffect, useRef, useState } from 'react';
import { View, Alert, Text, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import MapAPI from '../../core/map/api/MapAPI';
import { Icon } from '@rneui/themed';
import Geolocation from '@react-native-community/geolocation';

MapboxGL.setAccessToken('pk.eyJ1IjoiY2hpbmh0cmFuMTAwNSIsImEiOiJjbTRhcGdodHgwYnRzMnFzZW96eTV3ZDlrIn0.10AKRRbq5mQ2eGCg_HQVrA');


const Map = () => {
    const [currentLocation, setCurrentLocation] = useState<[number, number]>([108.085, 16.161]);
    const cameraRef = useRef<MapboxGL.Camera>(null);
    const mapRef = React.useRef<MapboxGL.MapView>(null);
    const [street, setStreet] = useState("");
    const [valueProvinces, setValueProvinces] = useState<string | null>(null);
    const [valueDistrict, setValueDistrict] = useState<string | null>(null);
    const [valueWard, setValueWard] = useState<string | null>(null);
    const [loadMap, setLoadMap] = useState(
        'https://tiles.goong.io/assets/goong_map_web.json?api_key=lb3ODvIFozZ1q6pXcT0rfuJ9ZsWv6ekAmmpm2InJ',
      );
    const handleMapPress = async (event: any) => {
    const { geometry } = event;
    const [longitude, latitude] = geometry.coordinates;

    try {
        const response = await MapAPI.getGeocoding(latitude, longitude);
        const address = response.results[0]?.formatted_address || 'Không tìm thấy địa chỉ';
        const address_components = response.results[0]?.address_components || 'Không tìm thấy địa chỉ';

        Alert.alert('Thông tin vị trí', `Tọa độ: ${longitude}, ${latitude}\nĐịa chỉ: ${address}`);
        setCurrentLocation([longitude, latitude])

        const province = response.results[0]?.compound.province
        const district = response.results[0]?.compound.district
        const compound = response.results[0]?.compound.commune
        const numberHouse = address_components[0]?.short_name
        const tstreet = address_components[1]?.short_name
        let adfdress: String = ""

        setValueProvinces(province)
        setValueDistrict(district)
        setValueWard(compound)
        if ( tstreet==compound || tstreet==district || tstreet==province) {
            adfdress = numberHouse
            setStreet(numberHouse)
        } else {
            adfdress = (`${numberHouse}, ${tstreet}`)
            setStreet(`${numberHouse}, ${tstreet}`)
        }

        console.log("lần 1: " ,adfdress + ", " + compound + ", " + district + "," + province)
        console.log("lần 2: ",response.results[0]?.compound)

        // console.log(response.results[0]?.compound)
        // console.log(response.results[0]?.compound.commune)
        // console.log(response.results[0]?.name)
        console.log("Good: ",address_components[0]?.short_name)
        console.log(response.results[0]?.name)
        console.log(address_components[1]?.short_name)
        // kết quả:
        // lần 1:
        // LOG  {"commune": "Hải Châu 2", "district": "Hải Châu", "province": "Đà Nẵng"}
        // LOG  Trạm Y tế phường Hải Châu 2
        // LOG  Good:  Trạm Y tế phường Hải Châu 2
        // LOG  564 Ông Ích Khiêm
        // so sánh 
        // nếu 



        // if(address_components.length == 5) {
        //     console.log("Số nhà: ",address_components[0]?.short_name, address_components[1]?.short_name)
        //     console.log("Phường xã: ",address_components[2].short_name)
        // } else if(address_components.length == 4) {

        // } else if(address_components.length == 4) {

        // }
        // if(address_components.length < 4) {
        //     Alert.alert('Thông tin vị trí',`Số nhà: ${address_components[0].short_name}\nQuận Huyên: ${address_components[2].short_name}\nThành phố: ${address_components[3].short_name}`);
        // } else {
        //     Alert.alert('Thông tin vị trí',`Số nhà: ${address_components[0].short_name}\nPhường xã: ${address_components[2].short_name}\nQuận Huyên: ${address_components[3].short_name}\nThành phố: ${address_components[4].short_name}`);

        // }
        // console.log(response.results[0]?.address_components[0].short_name)
        // console.log(response.results[0]?.address_components)

    } catch (error) {
        Alert.alert('Lỗi', 'Không thể lấy địa chỉ từ API Goong');
    }
    };

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation([longitude, latitude]); // Cập nhật vị trí hiện tại
          },
          (error) => {
            console.error("Error getting location:", error);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      };
    
  return (
    <View style={{ flex: 1 }}>
      <MapboxGL.MapView
        styleURL={loadMap}
        style={{ flex: 1 }}
        projection="globe" //Phép chiếu được sử dụng khi hiển thị bản đồ
        zoomEnabled={true}
        onPress={handleMapPress}
        ref={mapRef}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          centerCoordinate={currentLocation}
        //   centerCoordinate={locationsState[0].coordinates}
          zoomLevel={16}
        /> 
         <MapboxGL.PointAnnotation
            id={'location.Address'}
            coordinate={currentLocation}
          >
            <View>
                <Icon name='location-on' size={25} color='blue'/>
            </View>
        </MapboxGL.PointAnnotation>
      </MapboxGL.MapView>
      <TouchableOpacity
            onPress={getCurrentLocation}
            style={{position: 'absolute', zIndex:1, right:10, bottom:20}}
        >
            <Icon name='my-location' size={30} color="blue"/>
        </TouchableOpacity>
    </View>
  )
}

export default Map

const styles = StyleSheet.create({})