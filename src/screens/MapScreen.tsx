// import React, { useEffect, useRef, useState } from 'react';
// import { StyleSheet, View } from 'react-native';
// import MapboxGL from "@rnmapbox/maps";
// // MapboxGL.setConnected(true);
// MapboxGL.setAccessToken('pk.eyJ1IjoiY2hpbmh0cmFuMTAwNSIsImEiOiJjbTRhcGdodHgwYnRzMnFzZW96eTV3ZDlrIn0.10AKRRbq5mQ2eGCg_HQVrA');
// const Map = () => {
//   const [loadMap, setLoadMap] = useState(
//     'https://tiles.goong.io/assets/goong_map_web.json?api_key=lb3ODvIFozZ1q6pXcT0rfuJ9ZsWv6ekAmmpm2InJ',
//   );



import React, { useEffect, useRef, useState } from 'react';
import { View, Alert, StyleSheet, Button, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Text } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import MapApi from '../core/map/api/MapAPI';
import colors from '../constants/colors';
import { Icon } from '@rneui/themed';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { RoomInfo } from '../type/room.interface';
import { roomService } from '../service';
import RoomItem from '../components/Room/RoomItem';

MapboxGL.setAccessToken('pk.eyJ1IjoiY2hpbmh0cmFuMTAwNSIsImEiOiJjbTRhcGdodHgwYnRzMnFzZW96eTV3ZDlrIn0.10AKRRbq5mQ2eGCg_HQVrA');
interface locationType {
  id: string;
  coordinates: [number, number];
  title: string;
  state: boolean
}
const locations: locationType[] = [
  { id: '1', coordinates: [108.211, 16.074], title: 'Điểm 1', state: false },
  { id: '2', coordinates: [108.210, 16.072], title: 'Điểm 2', state: true },
  { id: '3', coordinates: [108.210, 16.070], title: 'Điểm 3', state: false },
  { id: '4', coordinates: [108.2099359785628, 16.073034842395934], title: 'Điểm 3', state: true },
];

interface locationRoomType {
  roomId: number;
  coordinates: [number, number];
  price: number;
}

type CircleGeoJSON = {
  type: "Feature";
  geometry: {
    type: "Polygon";
    coordinates: [number, number][][];
  };
  properties: Record<string, unknown>;
};
type BoundingBox ={
  minLatitude: number,
  maxLatitude: number,
  minLongitude: number, 
  maxLongitude: number
}

type MapRoomScreenProps = NativeStackScreenProps<RootStackParamList, 'Map'>;
const MapRoomScreen: React.FC<MapRoomScreenProps> = ({ navigation, route }) => {
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([108.211, 16.074]);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const mapRef = React.useRef<MapboxGL.MapView>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [circleCenter, setCircleCenter] = useState<[number, number] | null>(null);
  const [circleGeoJSON, setCircleGeoJSON] = useState<CircleGeoJSON | undefined>(undefined);

  const [locationsState, setLocationsState] = useState(locations);

  const [radiusInKm, setRadiusInKm] = useState<number>(1);
  const [loadMap, setLoadMap] = useState(
    'https://tiles.goong.io/assets/goong_map_web.json?api_key=lb3ODvIFozZ1q6pXcT0rfuJ9ZsWv6ekAmmpm2InJ',
  );

  const [boundingBox, setBoundingBox] = useState<BoundingBox>()
  const [locationBoundingBox, setLocationBoundingBox] = useState<[number, number][]>([]);
  const [listDistrict, setListDistrict] = useState<string[]>([])
  const [listRoomByDistrict, setListRoomByDistrict] = useState<RoomInfo[]>([])
  const [roomResults, setRoomResults] = useState<RoomInfo[]>([])
  const [roomLocationResults, setRoomLocationResults] = useState<locationRoomType[]>([]);

  const handleItemPress = (room: RoomInfo) => {
    navigation.navigate("Detail", { roomInfo: room, fromScreen: 'MapScreen'});
  };

  // useEffect(() => {
  //   handleBoundingBox(locationBoundingBox)
  //   getRoomForDistrict(listDistrict)
  //  },[])
  // const getRoomForDistrict = async (listDistrict: string[]) => {
  //   try {
  //     const roomPromises = listDistrict.map((district) =>
  //       roomService.getRoomByDistrict(district)
  //     );
  //     const results = await Promise.all(roomPromises);
  //     const RoomBydistricts = results.flat().filter(Boolean);
  //     setListRoomByDistrict(RoomBydistricts);
  //   } catch (error) {
  //     console.log("Lỗi lấy dữ liệu phòng.");
  //   }
  // };
  

  // const handleBoundingBox = async (boundingBox: [number, number][]) => {
  //   try {
  //     const districts: string[] = [];
  //     for (const [longitude, latitude] of boundingBox) {
  //       try {
  //         const response = await MapApi.getGeocoding(latitude, longitude);
  //         const district = response.results[0]?.compound.district;
  //         if (district && !districts.includes(district)) {
  //           districts.push(district);
  //         }
  //       } catch (error) {
  //         console.warn("Không thể lấy địa chỉ từ API Goong:", error);
  //       }
  //     }
  //     console.log("Địa chỉ:", districts);
  //     return await getRoomForDistrict(districts);
  //   } catch (error) {
  //     console.error("Lỗi xử lý bounding box:", error);
  //     return [];
  //   }
  // };
  
  const getRoomForDistrict = async (listDistrict: string[]): Promise<RoomInfo[]> => {
    try {
      const roomPromises = listDistrict.map((district) =>
        roomService.getRoomByDistrict(district)
      );
      const results = await Promise.all(roomPromises);
      const roomByDistricts = results.flat().filter(Boolean);
      return roomByDistricts
      // setListRoomByDistrict(roomByDistricts);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu phòng:", error);
      throw error; // Đẩy lỗi để xử lý đồng bộ
    }
  };
  
  const handleBoundingBox = async (boundingBox: [number, number][]): Promise<string[]> => {
    try {
      const districts: string[] = [];
      for (const [longitude, latitude] of boundingBox) {
          try {
            const response = await MapApi.getGeocoding(latitude, longitude);
            const district = response.results[0]?.compound.district;
            if (district && !districts.includes(district)) {
              districts.push(district);
            }
          } catch (error) {
            console.log("Không thể lấy địa chỉ từ API Goong:", error);
          }
        }
      console.log("Danh sách quận huyện:", districts);
      return districts;
    } catch (error) {
      console.error("Lỗi xử lý bounding box:", error);
      throw error; // Đẩy lỗi để xử lý đồng bộ
    }
  };
  const retryHandleBoundingBox = async (
    boundingBox: [number, number][],
    retries: number = 5,
    delay: number = 1000
  ): Promise<string[]> => {
    for (let i = 0; i < retries; i++) {
      const districts = await handleBoundingBox(boundingBox);
      if (districts.length > 0) {
        return districts;
      }
      console.log(`Thử lần ${i + 1}/${retries}, chưa có dữ liệu. Đợi ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay)); // Chờ trước khi thử lại
    }
    throw new Error("Không tìm thấy quận nào sau nhiều lần thử.");
  };
  
  const retryGetRoomForDistrict = async (
    listDistrict: string[],
    retries: number = 5,
    delay: number = 2000
  )=> {
    for (let i = 0; i < retries; i++) {
      try {
        const listRoom = await getRoomForDistrict(listDistrict); 
        if (listRoom && listRoom.length > 0) {
          setListRoomByDistrict(listRoom)
        }
      } catch (error) {
        console.log(
          `Thử lần ${i + 1}/${retries} thất bại. Đợi ${delay}ms trước khi thử lại...`,
          error
        );
      }
      await new Promise((resolve) => setTimeout(resolve, delay)); 
    }
  
    console.log("Không thể lấy danh sách phòng sau nhiều lần thử. Trả về danh sách rỗng.");
    return []; 
  };
  
  const handleFindPlace = async (search: string) => {
    try {
      const response = await MapApi.getFindText(search);
      // console.log('Place found:', response.candidates[0].geometry.location);
      const location = response.candidates[0]?.geometry?.location;
      const latitude = parseFloat(location?.lat);
      const longitude = parseFloat(location?.lng);

      // Cập nhật vị trí hiện tại
      const foundCoordinates: [number, number] = [longitude, latitude];
      setCurrentLocation(foundCoordinates);

      // Gọi hàm handleClick với tọa độ tìm kiếm được
      await handleClick({
        geometry: {
          coordinates: foundCoordinates
        }
      });
    } catch (error) {
      console.error('Error finding place:', error);
    }
  };

  const getBoundingBox = (center: [number, number], radiusInKm: number) => {
    const earthRadius = 6371; // Bán kính Trái Đất (km)
    const lat = center[1];
    const lng = center[0];
    const radiusInRadians = radiusInKm / earthRadius;

    const minLatitude = lat - (radiusInRadians * 180) / Math.PI;
    const maxLatitude = lat + (radiusInRadians * 180) / Math.PI;
    const minLongitude = lng - (radiusInRadians * 180) / Math.PI / Math.cos((lat * Math.PI) / 180);
    const maxLongitude = lng + (radiusInRadians * 180) / Math.PI / Math.cos((lat * Math.PI) / 180);
    const LocationboundingBox: [number, number][] = [
      [maxLongitude, maxLatitude],  // top-right
      [maxLongitude, minLatitude],  // bottom-right
      [minLongitude, minLatitude],  // bottom-left
      [minLongitude, maxLatitude],  // top-left
    ];
    const boundingBox: BoundingBox = {
      minLatitude,
      maxLatitude, 
      minLongitude,
      maxLongitude,
    };
    console.log("BoundingBox:", LocationboundingBox);

    setBoundingBox(boundingBox);
    // setLocationBoundingBox(LocationboundingBox)
    return LocationboundingBox;
  };

  const filterByBoundingBox = (rooms: RoomInfo[], boundingBox: BoundingBox) => {
    if(rooms) {
      return rooms.filter((room) => {
        const [lng, lat]  = [room.diaChi.kinhDo, room.diaChi.viDo];
       if( lng && lat) {
          return (
            lat >= boundingBox.minLatitude &&
            lat <= boundingBox.maxLatitude &&
            lng >= boundingBox.minLongitude &&
            lng <= boundingBox.maxLongitude
          );
       } else {
        console.log("Lỗi lọc các điểm nằm trong bounding box")
       }
        
      });
    } else {
      console.log("Không có dữ liệu phòng để lọc")
    }
    console.log("Lỗi không có phòng để lọc")
  };


  const haversineDistance = (coord1: [number, number], coord2: [number, number]) => {
    const toRad = (x: number) => (x * Math.PI) / 180;

    const lat1 = coord1[1];
    const lon1 = coord1[0];
    const lat2 = coord2[1];
    const lon2 = coord2[0];

    const R = 6371; // Bán kính Trái Đất (km)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Khoảng cách tính bằng km
  };

  const createCircleGeoJSON = (center: [number, number], radiusInKm: number): CircleGeoJSON => {
    const radiusInMeters = radiusInKm * 1000;
    const steps = 64;
    const coordinates: [number, number][] = [];
    const earthRadius = 6371000;

    for (let i = 0; i < steps; i++) {
      const angle = (i * 360) / steps;
      const angleRad = (angle * Math.PI) / 180;

      const dx = radiusInMeters * Math.cos(angleRad) / earthRadius;
      const dy = radiusInMeters * Math.sin(angleRad) / earthRadius;

      const latitude = center[1] + (dy * 180) / Math.PI;
      const longitude = center[0] + (dx * 180) / Math.PI / Math.cos((center[1] * Math.PI) / 180);
      coordinates.push([longitude, latitude]);
    }

    coordinates.push(coordinates[0]);  // Đóng vòng tròn

    return {
      type: "Feature",  // Đảm bảo là "Feature"
      geometry: {
        type: "Polygon",  // Đảm bảo kiểu geometry là "Polygon"
        coordinates: [coordinates],  // Coordinates là mảng con
      },
      properties: {},
    };
  };

  // const handleClick = async (event: any) => {
  //   setRoomResults([])
  //   const clickedCoordinate = event.geometry.coordinates;
  //   const newCircleGeoJSON = createCircleGeoJSON(clickedCoordinate, radiusInKm);
  //   setCurrentLocation(clickedCoordinate);
  //   setCircleGeoJSON(newCircleGeoJSON);
  //   setCircleCenter(clickedCoordinate);
  //   const boundingBox = getBoundingBox(clickedCoordinate, radiusInKm);
  //   await handleBoundingBox(locationBoundingBox)
  //   const filteredLocations = filterByBoundingBox(listRoomByDistrict, boundingBox);
  
  //   if (filteredLocations && filteredLocations.length > 0) {
  //     const updatedLocations = filteredLocations
  //       .map(room => {
  //         if (room.diaChi.viDo && room.diaChi.kinhDo) {
  //           const distance = haversineDistance([room.diaChi.kinhDo, room.diaChi.viDo], clickedCoordinate);
  //           if (distance <= radiusInKm) {
  //             return {
  //               ...room,
  //             };
  //           }
  //         }
  //         return undefined; // Return undefined for rooms that do not match
  //       })
  //       .filter(Boolean); // Remove undefined values from the array
  
  //     if (updatedLocations.length > 0) {
  //       setRoomResults(updatedLocations as RoomInfo[]); 
  //       console.log("Kết quả cuối cùng:",updatedLocations)
  //     } else {
  //       console.log("Không tìm thấy phòng nào trong khoảng cách tới vị trí bạn đang chọn.");
  //     }
  //   } else {
  //     console.log("Không tìm thấy phòng nào trong khoảng cách tới vị trí bạn đang chọn.");
  //   }
  // };
  
  // const handleClick = async (event: any) => {
  //   setRoomResults([]);
  //   setLoading(true);
  //   try {
  //     const clickedCoordinate = event.geometry.coordinates;
  //     const newCircleGeoJSON = createCircleGeoJSON(clickedCoordinate, radiusInKm);
  //     setCurrentLocation(clickedCoordinate);
  //     setCircleGeoJSON(newCircleGeoJSON);
  //     setCircleCenter(clickedCoordinate);
  
  //     const boundingBox = getBoundingBox(clickedCoordinate, radiusInKm);  
  //     const districts = await handleBoundingBox(locationBoundingBox); // Chờ xử lý xong các district
  //     await getRoomForDistrict(districts); // Chờ lấy danh sách phòng theo district
  
  //     const filteredLocations = filterByBoundingBox(listRoomByDistrict, boundingBox); // Lọc các phòng trong bounding box
  //     if (filteredLocations && filteredLocations.length > 0) {
  //       const updatedLocations = filteredLocations
  //         .map((room) => {
  //           if (room.diaChi.viDo && room.diaChi.kinhDo) {
  //             const distance = haversineDistance(
  //               [room.diaChi.kinhDo, room.diaChi.viDo],
  //               clickedCoordinate
  //             );
  //             if (distance <= radiusInKm) {
  //               return { ...room };
  //             }
  //           }
  //           return undefined;
  //         })
  //         .filter(Boolean); // Lọc các giá trị hợp lệ
  
  //       if (updatedLocations.length > 0) {
  //         setRoomResults(updatedLocations as RoomInfo[]);
  //         console.log("Kết quả cuối cùng:", updatedLocations);
  //       } else {
  //         console.log("Không tìm thấy phòng nào trong khoảng cách tới vị trí bạn đang chọn.");
  //       }
  //     } else {
  //       console.log("Không tìm thấy phòng nào trong khoảng cách tới vị trí bạn đang chọn.");
  //     }
  //   } catch (error) {
  //     console.error("Lỗi trong quá trình xử lý sự kiện click:", error);
  //   }
  // };
  // const handleClick = async (event: any) => {
  //   setRoomResults([]);
  //   setLoading(true); // Bắt đầu tải
  //   try {
  //     const clickedCoordinate = event.geometry.coordinates;
  //     const newCircleGeoJSON = createCircleGeoJSON(clickedCoordinate, radiusInKm);
  //     setCurrentLocation(clickedCoordinate);
  //     setCircleGeoJSON(newCircleGeoJSON);
  //     setCircleCenter(clickedCoordinate);

  //     const boundingBox = getBoundingBox(clickedCoordinate, radiusInKm);

  //     const districts = await handleBoundingBox(locationBoundingBox); // Chờ xử lý xong bounding box
  //     await getRoomForDistrict(districts); // Chờ lấy danh sách phòng

  //     const filteredLocations = filterByBoundingBox(listRoomByDistrict, boundingBox);
  //     if (filteredLocations && filteredLocations.length > 0) {
  //       const updatedLocations = filteredLocations
  //         .map((room) => {
  //           if (room.diaChi.viDo && room.diaChi.kinhDo) {
  //             const distance = haversineDistance(
  //               [room.diaChi.kinhDo, room.diaChi.viDo],
  //               clickedCoordinate
  //             );
  //             if (distance <= radiusInKm) {
  //               return { ...room };
  //             }
  //           }
  //           return undefined;
  //         })
  //         .filter(Boolean);

  //       if (updatedLocations.length > 0) {
  //         setRoomResults(updatedLocations as RoomInfo[]);
  //         console.log("Kết quả cuối cùng:", updatedLocations);
  //       } else {
  //         console.log("Không tìm thấy phòng nào trong khoảng cách tới vị trí bạn đang chọn.");
  //       }
  //     } else {
  //       console.log("Không tìm thấy phòng nào trong khoảng cách tới vị trí bạn đang chọn.");
  //     }
  //   } catch (error) {
  //     console.error("Lỗi trong quá trình xử lý sự kiện click:", error);
  //   } finally {
  //     setLoading(false); // Kết thúc tải
  //   }
  // };

  const handleClick = async (event: any) => { 
    setRoomResults([]); 
    setLoading(true); 
  
    try {
      const clickedCoordinate = event.geometry.coordinates;
      const newCircleGeoJSON = createCircleGeoJSON(clickedCoordinate, radiusInKm);
      setCurrentLocation(clickedCoordinate);
      setCircleGeoJSON(newCircleGeoJSON);
      setCircleCenter(clickedCoordinate);
  
      const locationBoundingBox = getBoundingBox(clickedCoordinate, radiusInKm);
      const listDistrict = await retryHandleBoundingBox(locationBoundingBox);
      await retryGetRoomForDistrict(listDistrict);
        if (boundingBox) {
          const filteredLocations = filterByBoundingBox(listRoomByDistrict, boundingBox);
          if (!filteredLocations || filteredLocations.length === 0) {
            console.log("Không tìm thấy phòng nào trong bounding box.");
            return; 
          }
    
          const updatedLocations = filteredLocations
            .map((room) => {
              if (room.diaChi.viDo && room.diaChi.kinhDo) {
                const distance = haversineDistance(
                  [room.diaChi.kinhDo, room.diaChi.viDo],
                  clickedCoordinate
                );
                if (distance <= radiusInKm) {
                  return { ...room };
                }
              }
              return undefined;
            })
            .filter(Boolean); // Loại bỏ giá trị undefined
    
          if (updatedLocations.length > 0) {
            setRoomResults(updatedLocations as RoomInfo[]);
            console.log("Kết quả cuối cùng:", updatedLocations);
          } else {
            console.log("Không tìm thấy phòng nào trong khoảng cách tới vị trí bạn đang chọn.");
          }
        }


    } catch (error) {
      console.error("Lỗi trong quá trình xử lý sự kiện click:", error);
    } finally {
      // Đảm bảo setLoading(false) chỉ được gọi sau khi tất cả các thao tác hoàn tất
      setLoading(false); 
    }
  };
  
  useEffect(() => { 
    setRoomLocationResults([])
    if(roomResults.length > 0) { 
      const roomlocation: locationRoomType[] = []
      roomResults.forEach((roomResult) => { 
        if(roomResult.diaChi.kinhDo && roomResult.diaChi.viDo)
        roomlocation.push({
          roomId: roomResult.maPhong,
          coordinates: [roomResult.diaChi.kinhDo, roomResult.diaChi.viDo],
          price: roomResult.giaPhong,
        }
        );
      })
      setRoomLocationResults(roomlocation)
    }
  },[roomResults])
  
  
  return (
    <View style={{ flex: 1 }}>
      <MapboxGL.MapView
        styleURL={loadMap}
        style={{ flex: 1 }}
        projection="globe" //Phép chiếu được sử dụng khi hiển thị bản đồ
        zoomEnabled={true}
        onPress={handleClick}
        ref={mapRef}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          centerCoordinate={currentLocation}
          zoomLevel={13.5}
        />
        <MapboxGL.PointAnnotation id={'location.Address'} coordinate={currentLocation}>
          <View>
            <Icon name="location-on" size={40} color="red" />
          </View>
        </MapboxGL.PointAnnotation>
        {circleGeoJSON && (
          <MapboxGL.ShapeSource id="circleSource" shape={circleGeoJSON}>
            <MapboxGL.FillLayer
              id="circleFill"
              style={{
                fillColor: 'rgba(0, 150, 255, 0.3)',
                fillOutlineColor: 'rgba(0, 150, 255, 0.8)',
              }}
            />
          </MapboxGL.ShapeSource>
        )}

        {roomLocationResults.map(location => (
          <MapboxGL.PointAnnotation
            key={location.roomId.toString()}
            id={location.roomId.toString()}
            coordinate={location.coordinates}
          >
            {/* Custom View for Annotation */}
            <View style={styles.annotationContainer}>
              <View style={[styles.annotationFill, { backgroundColor:"red" }]} />
            </View>

            {/* Popup text */}
            <MapboxGL.Callout title={location.price.toString()} />
          </MapboxGL.PointAnnotation>
        ))}
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

      {loading ? (
        <View style={{position:"absolute", bottom:60, left:5, right:5}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ): (
        <View style={{position:"absolute", justifyContent:'center', width:"95%", bottom:10, left:5, right:5}}>
        {roomResults.length > 0 ? (
              <FlatList
                horizontal
                style={{ flex: 1 }}
                keyExtractor={(item) => item.maPhong.toString()}
                data={roomResults}
                renderItem={({ item }) => {
                  return (
                    <RoomItem item={item} onPress={() => handleItemPress(item)} />
                  ) 
                }}
              />
          ) : null}
      </View>
      )}

    </View>
  );
};

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
    padding: 10,
    justifyContent: 'center',
    backgroundColor: colors.Background,
    borderRadius: 15,
    fontSize: 16,
    height: 50,
    color: 'black'
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

  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  annotationContainer: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  annotationFill: {
    width: 15,
    height: 15,
    // backgroundColor: '#007AFF',
    borderRadius: 7.5,
  },
});

export default MapRoomScreen;




























  //   return (
  //     <View style={{ flex: 1 }}>
  //        <MapboxGL.MapView
  //         styleURL={loadMap}
  //         style={{ flex: 1 }}
  //         projection="globe" //Phép chiếu được sử dụng khi hiển thị bản đồ
  //         zoomEnabled={true}
  //         onPress={handleMapPress}
  //         ref={mapRef}
  //       >
  //         <MapboxGL.Camera
  //           ref={cameraRef}
  //           centerCoordinate={currentLocation}
  //           zoomLevel={12}
  //         />
  //          <MapboxGL.PointAnnotation
  //           id="current-location" // ID duy nhất
  //           coordinate={currentLocation} // Tọa độ [longitude, latitude]
  //         >
  //           <View
  //             style={{
  //               backgroundColor: 'blue',
  //               width: 10,
  //               height: 10,
  //               borderRadius: 5,
  //             }}
  //           />
  //         </MapboxGL.PointAnnotation>
  //       </MapboxGL.MapView>
  //       <Button title="Find Place" onPress={handleFindPlace} />
  //     </View>
  //   );
  // };

  // const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //   },
  // });

  // export default MapExample;


  
  // const handleClick = (event: any) => {
  //   const clickedCoordinate = event.geometry.coordinates;
  //   const newCircleGeoJSON = createCircleGeoJSON(clickedCoordinate, radiusInKm);
  //   setCurrentLocation(clickedCoordinate)
  //   setCircleGeoJSON(newCircleGeoJSON);
  //   setCircleCenter(clickedCoordinate);
  //   const boundingBox = getBoundingBox(clickedCoordinate, radiusInKm);
  //   const filteredLocations = filterByBoundingBox(listRoomByDistrict, boundingBox);
  //   const updatedLocations = locations.map(location => {
  //     const distance = haversineDistance(location.coordinates, clickedCoordinate);
  //     return {
  //       ...location,
  //       state: distance <= radiusInKm,
  //     };
  //   });
  //   setLocationsState(updatedLocations);
  // };

  // const handleClick = (event: any) => {
  //   const clickedCoordinate = event.geometry.coordinates;
  //   const newCircleGeoJSON = createCircleGeoJSON(clickedCoordinate, radiusInKm);
  //   setCurrentLocation(clickedCoordinate)
  //   setCircleGeoJSON(newCircleGeoJSON);
  //   setCircleCenter(clickedCoordinate);
  //   const boundingBox = getBoundingBox(clickedCoordinate, radiusInKm);
  //   const filteredLocations = filterByBoundingBox(listRoomByDistrict, boundingBox);
  //   if(filteredLocations && filteredLocations.length >0) {
  //     const updatedLocations = filteredLocations.map(room => {
  //       if(room.diaChi.viDo && room.diaChi.kinhDo) {
  //         const distance = haversineDistance([room.diaChi.kinhDo, room.diaChi.viDo], clickedCoordinate);
  //         if(distance <= radiusInKm) {
  //           return {
  //             ...room,
  //         }}
  //       }});
  //       if (updatedLocations.length > 0) { 
  //         setRoomResults(updatedLocations);
  //       }
  //     }  
  //   else {
  //     console.log("Không tìm thấy phòng nào trong khoảng cách tới vị trí bạn đang chọn.")
  //   }
    
  // };