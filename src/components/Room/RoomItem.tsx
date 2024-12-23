import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../../constants/colors'
import { Icon } from '@rneui/themed'
import { RoomInfo } from '../../type/room.interface'

interface RoomItemProps {
    item: RoomInfo
    onPress: () => void;
}

const RoomItem: React.FC<RoomItemProps> = ({ item, onPress }) => {
    const [image, setImage] = useState<string>("")

    useEffect(() => {
        const imageRoom = item.hinhAnh.find(
            (item) =>
                item.danhMucHinhAnh === 'Hình ảnh căn phòng' &&
                item.loaiTep === 'Hình ảnh'
        )?.duongDan; 
        if (imageRoom) {
            setImage(imageRoom); 
        }
    }, []) 
    if (!image) {
        return (
          <View>
          </View>
        );
      }
    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}
        >
            <Image
                source={{ uri: image }} 
                style={styles.image}
            />

            <View style={styles.container_Info}>
                <Text style={styles.title} numberOfLines={2}>{item.tieuDe}</Text>
                <View style={styles.roomInfo}>
                    <Icon name='location-on' size={16} color={colors.gray_text} />
                    <Text style={styles.text_info} numberOfLines={1} ellipsizeMode="tail">
                        {item.diaChi.soNha}, {item.diaChi.phuongXa}, {item.diaChi.quanHuyen}, {item.diaChi.tinhThanh}
                    </Text>
                </View>
                <View style={styles.roomInfo}>
                    <Icon name='home' size={16} color={colors.gray_text} />
                    <Text style={styles.text_info}>{item.diaChi.tinhThanh}</Text>
                </View>
                <View style={styles.roomInfo}>
                    <Icon name='people' size={16} color={colors.gray_text} />
                    <Text style={styles.text_info}>{item.soNguoiToiDa}</Text>
                </View>
                <Text style={styles.price}>{item.giaPhong} vnđ/tháng</Text>

            </View>
        </TouchableOpacity>
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
        marginHorizontal:10,
        // width: '95%',
        // height: '90%'
    },
    image: {
        width: 130,
        height: 130,
        resizeMode: "cover",
        borderRadius: 5,
        marginBottom: 5,
        marginLeft: 5,
        marginTop: 5,
    },
    container_Info: {
        padding: 10,
        width: 240,
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