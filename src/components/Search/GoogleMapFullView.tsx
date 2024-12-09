// import { StyleSheet, Text, View, Dimensions } from 'react-native'
// import React, { useContext, useState, useEffect } from 'react'
// import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
// import {Marker} from 'react-native-maps';
// import { UserLocationContext } from '../../Context/UserLocationContext'



// const GoogleMapFullView = () => {
//     const [mapRegion, setmapRegion] = useState([])
//     const {location, setLocation} = useContext(UserLocationContext)

//     useEffect(()=>{
//         if(location)
//         {
//             setmapRegion({
//                 latitude: location.coords.latitude,
//                 longitude: location.coords.longitude,
//                 latitudeDelta: 0.0522,
//                 longitudeDelta: 0.0421,
//             })
//         }
//     },[])
//     const newRegion = {
//         latitude: 15.8892577,
//         longitude: 108.1756235,
//         latitudeDelta: 0.0522,
//         longitudeDelta: 0.0421,
//     };
//   return (
//     <View>
//       <Text>GoogleMapFullView</Text>
//     </View>
//   )
// }

// export default GoogleMapFullView

// const styles = StyleSheet.create({})


// import { StyleSheet, Text, View } from 'react-native'
// import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
// import React from 'react'

// const GoogleMapFullView = () => {
//   return (
//     <View style={styles.container}>
//       <MapView style={styles.map}
//          initialRegion={{
//             latitude: 37.78825,
//             longitude: -122.4324,
//             latitudeDelta: 0.0922,
//             longitudeDelta: 0.0421,
//           }}
//       />
//     </View>
//   )
// }

// export default GoogleMapFullView

// const styles = StyleSheet.create({
//     container: {
//         ...StyleSheet.absoluteFillObject,
//         justifyContent: 'center',
//                 alignItems: 'center',


//     },
//     map: {
//         ...StyleSheet.absoluteFillObject,
//     },
// })

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';
// import { TileOverlay } from 'react-native-maps';
const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

class MyMap extends Component {
  render() {
    return (
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* <TileOverlay
          urlTemplate={osmUrl}
          tileSize={256}
          visible={true}
        /> */}
        {/* ... các marker hoặc các phần tử bản đồ khác */}
      </MapView>
    );
  }
}

export default MyMap;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
                alignItems: 'center',


    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
})