import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../../constants/colors'
import { Icon } from '@rneui/themed'

const RoomItem = () => {
  return (
    <View style={styles.container}>
        <Image
            source={require("../../assets/image/Room.jpg")}
            style={styles.image}
        />

      <View style={styles.container_Info}>
        <Text style={styles.title} numberOfLines={2}>Title RoomItem hshs hchia hdhak cjdhdj haha dkdk</Text>
        <View style={styles.roomInfo}>
            <Icon name='location-on' size={16} color={colors.gray_text}/>
            <Text style={styles.text_info} numberOfLines={1} ellipsizeMode="tail">Địa chỉ của phòng trọ là ở Quận Ngũ Hành Sơn, thành phố Đà Nẵng</Text>
        </View> 
        <View style={styles.roomInfo}>
            <Icon name='home' size={16} color={colors.gray_text}/>
            <Text style={styles.text_info}>Đà Nẵng</Text>
        </View>      
        <View style={styles.roomInfo}>
            <Icon name='people' size={16} color={colors.gray_text}/>
            <Text style={styles.text_info}>4</Text>
        </View>   
        <Text style={styles.price}>Từ: 2,200,000 đ/tháng</Text>

      </View>
    </View>
  )
}

export default RoomItem

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 10,
        backgroundColor: colors.BackgroundHome,
        borderRadius: 10,
        marginBottom: 10,
        width: '95%',
        height: '90%'
    },
    image: {
        width: "40%",
        height: "100%",
        borderRadius: 5,
        marginBottom: 5,
        marginLeft: 5,
        marginTop: 5,
    },
    container_Info: {
        padding: 10,
        width: "60%",
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "black",
        marginBottom: 5
    },
    roomInfo: {
        flexDirection: 'row',
        marginBottom: 5
    },
    text_info: {
        color: colors.gray_text,
        fontSize: 12,
        marginLeft: 5
    },
    price: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 14,
    }
})