// import React, { useEffect, useRef, useState } from 'react';
// import { StyleSheet, View } from 'react-native';
// import MapboxGL from "@rnmapbox/maps";
// // MapboxGL.setConnected(true);
// MapboxGL.setAccessToken('pk.eyJ1IjoiY2hpbmh0cmFuMTAwNSIsImEiOiJjbTRhcGdodHgwYnRzMnFzZW96eTV3ZDlrIn0.10AKRRbq5mQ2eGCg_HQVrA');
// const Map = () => {
//   const [loadMap, setLoadMap] = useState(
//     'https://tiles.goong.io/assets/goong_map_web.json?api_key=lb3ODvIFozZ1q6pXcT0rfuJ9ZsWv6ekAmmpm2InJ',
//   );
//   const [coordinates] = useState([108.085, 16.161]);
//   const camera = useRef(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [location, setLocation] = useState(null);

//   // useEffect(() => {
//   //   navigator.geolocation.getCurrentPosition(
//   //     position => {
//   //       setLocation([position.coords.longitude, position.coords.latitude]);
//   //     },
//   //     error => console.log(error),
//   //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
//   //   );
//   // }, []);

//   // const onMapPress = async (event) => {
//   //   const { coordinates } = event.geometry;

//   //   // Lấy thông tin địa chỉ từ tọa độ sử dụng Mapbox Geocoding API
//   //   const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=YOUR_MAPBOX_ACCESS_TOKEN`);
//   //   const data = await response.json();

//   //   if (data.features && data.features.length > 0) {
//   //     setSelectedLocation({
//   //       coordinates: coordinates,
//   //       address: data.features[0].place_name
//   //     });
//   //   }
//   // };
//   return (
//     <View style={{ flex: 1 }}>
//       <MapboxGL.MapView
//         styleURL={loadMap}
//         style={{ flex: 1 }}
//         projection="globe" //Phép chiếu được sử dụng khi hiển thị bản đồ
//         zoomEnabled={true}
//       >
//         <MapboxGL.Camera
//           ref={camera}
//           zoomLevel={6} // Mức thu phóng của bản đồ
//           centerCoordinate={coordinates}
//         />
//       </MapboxGL.MapView>
//     </View>
//   );
// };


// export default Map;

// const styles = StyleSheet.create({
//   page: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     height: 500,
//     width: 300,
//   },
//   map: {
//     flex: 1
//   }
// });


import React, { useEffect, useRef, useState } from 'react';
import { View, Alert, StyleSheet, Button } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import MapApi from '../core/map/api/MapAPI';

MapboxGL.setAccessToken('pk.eyJ1IjoiY2hpbmh0cmFuMTAwNSIsImEiOiJjbTRhcGdodHgwYnRzMnFzZW96eTV3ZDlrIn0.10AKRRbq5mQ2eGCg_HQVrA');
const locations: { id: string; coordinates: [number, number]; title: string; state: boolean }[] = [
  { id: '1', coordinates: [108.211, 16.074], title: 'Điểm 1', state: false },
  { id: '2', coordinates: [108.210, 16.072], title: 'Điểm 2', state: true },
  { id: '3', coordinates: [108.210, 16.070], title: 'Điểm 3', state: false },
  { id: '4', coordinates: [108.211, 16.065], title: 'Điểm 3', state: false },
];

type CircleGeoJSON = {
  type: "Feature";  // Đảm bảo type là "Feature"
  geometry: {
    type: "Polygon";  // Xác định đúng kiểu geometry là "Polygon"
    coordinates: [number, number][][];
  };
  properties: Record<string, unknown>;  // Hoặc {} nếu không có thuộc tính thêm
};
const MapExample: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([108.085, 16.161]);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const mapRef = React.useRef<MapboxGL.MapView>(null);

  const [loadMap, setLoadMap] = useState(
    'https://tiles.goong.io/assets/goong_map_web.json?api_key=lb3ODvIFozZ1q6pXcT0rfuJ9ZsWv6ekAmmpm2InJ',
  );
  const handleMapPress = async (event: any) => {
    const { geometry } = event;
    const [longitude, latitude] = geometry.coordinates;

    try {
      const response = await MapApi.getGeocoding(latitude, longitude);
      const address = response.results[0]?.formatted_address || 'Không tìm thấy địa chỉ';
      Alert.alert('Thông tin vị trí', `Tọa độ: ${longitude}, ${latitude}\nĐịa chỉ: ${address}`);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy địa chỉ từ API Goong');
    }
  };

  const handleFindPlace = async () => {
    try {
      const response = await MapApi.getFindText('caffee anytime Đà Nẵng');
      console.log('Place found:', response.candidates[0].geometry.location);
      const location = response.candidates[0]?.geometry?.location;
      const latitude = parseFloat(location?.lat); // Chuyển đổi về kiểu số
      const longitude = parseFloat(location?.lng);

      setCurrentLocation([longitude, latitude]);
    } catch (error) {
      console.error('Error finding place:', error);
    }
  };


  const [circleCenter, setCircleCenter] = useState<[number, number] | null>(null);
  const [circleGeoJSON, setCircleGeoJSON] = useState<CircleGeoJSON | undefined>(undefined);    // Hàm xử lý khi click vào bản đồ
  const [locationsState, setLocationsState] = useState(locations);
   
  const radiusInKm = 1;

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

  const handleClick = (event: any) => {
    const clickedCoordinate = event.geometry.coordinates;
    const newCircleGeoJSON = createCircleGeoJSON(clickedCoordinate, radiusInKm);  // 10km bán kính
    setCircleGeoJSON(newCircleGeoJSON);
    setCircleCenter(clickedCoordinate);
    const updatedLocations = locations.map(location => {
      const distance = haversineDistance(location.coordinates, clickedCoordinate);
      return {
        ...location,
        state:  distance <= radiusInKm, 
      };
    });
    setLocationsState(updatedLocations);
  };

  useEffect(() => {
    console.log(locations);
  }, [locationsState]);

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
          // centerCoordinate={currentLocation}
          centerCoordinate={locationsState[0].coordinates}
          zoomLevel={14}
        />

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

        {locationsState.map(location => (
          <MapboxGL.PointAnnotation
            key={location.id}
            id={location.id}
            coordinate={location.coordinates}
          >
            {/* Custom View for Annotation */}
            <View style={styles.annotationContainer}>
              <View style={[styles.annotationFill, { backgroundColor: location.state ? "red" : "#007AFF" }]} />
              
            </View>

            {/* Popup text */}
            <MapboxGL.Callout title={location.title} />
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>
      <Button title="Find Place" onPress={handleFindPlace} />
    </View>
  );
};

const styles = StyleSheet.create({
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

export default MapExample;