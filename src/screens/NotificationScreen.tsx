import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Icon } from '@rneui/themed';
import MapboxGL from '@rnmapbox/maps';

// 'pk.eyJ1IjoiY2hpbmh0cmFuMTAwNSIsImEiOiJjbTRhcGdodHgwYnRzMnFzZW96eTV3ZDlrIn0.10AKRRbq5mQ2eGCg_HQVrA'
//lb3ODvIFozZ1q6pXcT0rfuJ9ZsWv6ekAmmpm2InJ
//Gzv00YTeVfzrMevtjeuvZ5dp8ol8i1sh0aMQF5Qm
// MapboxGL.setAccessToken('pk.eyJ1IjoiY2hpbmh0cmFuMTAwNSIsImEiOiJjbTRhcGdodHgwYnRzMnFzZW96eTV3ZDlrIn0.10AKRRbq5mQ2eGCg_HQVrA');
// MapboxGL.setConnected(true)
// MapboxGL.setTelemetryEnabled(false);
// MapboxGL.setWellKnownTileServer('Mapbox');
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from "../navigation/RootStackParamList";
type NotificationScreenProps = BottomTabScreenProps<RootStackParamList, 'Notification'>;

const NotificationScreen : React.FC<NotificationScreenProps> = ({navigation}) => {
  return (
    <View>
      <Text>NotificationScreen</Text>
      <Icon name='messenger-outline' size={20}/>
        <Icon name='message' size={20} color="gray"/>
        <Icon name='change-circle' size={20} color="gray"/>
        <Icon name='close' size={20} color="gray"/>
        <Icon name='my-location' size={20} color="gray"/>

        
      <TouchableOpacity
        onPress={() => navigation.navigate('Map')}
      >
        <Text>Map</Text>
      </TouchableOpacity>
    </View>
  //   <View style={styles.page}>
  //   <View style={styles.container}>
  //     <MapboxGL.MapView style={styles.map} />
  //   </View>
  // </View>
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