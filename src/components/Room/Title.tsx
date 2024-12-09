import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../../constants/colors';
interface TitleProps {
    title: string;
}

const Title: React.FC<TitleProps> = ({ title }) => {
    return (
        <View>
            <View style={styles.component}>
                <Text style={styles.catalog_text}>{title}</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.dash} />
                <View style={styles.distance} />

                <View style={title === 'Bước 1:Thông tin phòng' ? styles.dash_none : styles.dash} />
                <View style={styles.distance} />

                <View
                    style={title === 'Bước 1:Thông tin phòng' || title === 'Bước 2:Hình ảnh và video' ? styles.dash_none : styles.dash}
                />
            </View>
        </View>

    )
}

export default Title

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    component: {
        backgroundColor: colors.BackgroundHome,
        padding: 10,
        borderRadius: 15,
        shadowColor: "#000",
        justifyContent: 'center',
       
    },
    catalog_text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
      },
    dash: {
        backgroundColor: 'red',
        height: 4,
        flex: 1,
    },
    dash_none: {
        backgroundColor: colors.gray_text,
        height: 4,
        flex: 1,
    },
    distance: {
        backgroundColor: 'white',
        height: 2,
        width: 5,
    }
});