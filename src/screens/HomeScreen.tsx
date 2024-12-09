import { View, Image , Text, StyleSheet, Pressable, ScrollView, Dimensions} from 'react-native'
import React from 'react'
import Header from '../components/Header'
import { Icon } from '@rneui/themed';
import colors from '../constants/colors';
import RoomItem from '../components/Room/RoomItem';
import Config from 'react-native-config';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from "../navigation/RootStackParamList";
type HomeScreenProps = BottomTabScreenProps<RootStackParamList, 'Home'>;

console.log(Config.BASE_URL); 
console.log(Config.API_KEY);

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { height, width } = Dimensions.get("window");

    return (
      
      <View style={styles.container}>
        <Header/>
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
            onPress={() => navigation.navigate("Search")}
          >
            <View style={{ flexDirection: 'row'}}>
              <Icon name="map" size={24} color={colors.blue}/>
              <Text style={styles.text_blue}>Tìm kiếm phòng</Text>
            </View>
            <Icon name="arrow-right" size={24} color={colors.blue}/>
          </Pressable>
        </View>

        <View style={styles.listRoom}>
          <View style={styles.category_Title}>
            <Text style={styles.category_Text}>Phòng mới</Text>
            <Text style={{color:colors.blue, marginRight:10}}>Xem thêm</Text>
          </View>
          <RoomItem/>
        </View>
            {/* <Icon name="home" size={24} color="black" /> */}
        <View style={styles.listRoom}>
        <View style={styles.category_Title}>
            <Text style={styles.category_Text}>Phòng mới</Text>
            <Text style={{color:colors.blue, marginRight:10}}>Xem thêm</Text>
          </View>
          <RoomItem/>
        </View>
        <View style={styles.listRoom}>
          <View style={styles.category_Title}>
            <Text style={styles.category_Text}>Phòng mới</Text>
            <Text style={{color:colors.blue, marginRight:10}}>Xem thêm</Text>
          </View>
          <RoomItem/>
        </View>
        </ScrollView>

      </View>
    )
  }
  
  export default HomeScreen
  
  const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor:colors.Background

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
      justifyContent:'center'
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
      paddingLeft:10
    },

    listRoom: {
      width: "100%",
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
      justifyContent:'space-between', 
      padding:5, 
      alignItems:'center'
    },
 })
