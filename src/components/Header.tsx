import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from '@rneui/base'
import { Icon } from '@rneui/themed';
import colors from '../constants/colors';

const Header = () => {
  return (
    <View  style={styles.container}>
        <View style={styles.location}>
            <Pressable style={styles.iconContainer}>
                <Icon name='location-on' size={24} color='blue'/>
            </Pressable>
            <Text>Vị trí của bạn ?</Text>
        </View>
        <Pressable>
            <Image source={require('../assets/icon/user.png')} style={styles.avatar}/>
        </Pressable>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:20,
        paddingVertical:10,
        marginBottom:10,
        elevation:2,
        shadowColor: '#000',
        backgroundColor:colors.BackgroundHome
    },

    location: {
        flexDirection:'row',
        alignItems:'center',
        
    },

    iconContainer: {
        backgroundColor: '#F2F2F2',
        height: 40,
        width: 40,
        borderRadius: 10,
        justifyContent:'center',
        alignItems:'center',
        marginRight:10,
    },

    avatar: {
        width:40,
        height:40,
        borderRadius:20,
        marginLeft:10
    }
})