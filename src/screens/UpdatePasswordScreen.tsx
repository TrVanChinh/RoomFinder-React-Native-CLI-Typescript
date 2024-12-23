import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { RootStackParamList } from "../navigation/RootStackParamList";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import colors from '../constants/colors';
import { useUser } from '../context/UserContext';
import axiosInstance from '../service/axiosInstance';
import axios from 'axios';


type UpdatePasswordScreenProps = NativeStackScreenProps<RootStackParamList, 'UpdatePassword'>;

const UpdatePasswordScreen: React.FC<UpdatePasswordScreenProps> = ({ navigation }) => {
    const { user, setUser } = useUser()
    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")

    const updatePassword = async () => {
        if (!password ||!newPassword ||!confirmNewPassword) {
            Alert.alert("Thông báo", "Vui lòng không để trống.")
            return
         }
        else if (newPassword !== confirmNewPassword) {
            Alert.alert("Thông báo", "Xác nhận mật khẩu mới thất bại.")
            return
        } else {
            try {
                const data = {
                    oldPassword: password,
                    newPassword: newPassword,
                }
                const response = await axiosInstance.put(`/api/v1/users/updatePassword/${user?.maNguoiDung}`, data)
                Alert.alert("Thông báo", "Cập nhật mật khẩu thành công.");
            } catch (error) {
                if (error instanceof Error) {
                    if (axios.isAxiosError(error) && error.response && error.response.data.message) {
                        Alert.alert("Lỗi", error.response.data.message);
                    } else {
                        Alert.alert("Lỗi", error.message);
                    }
                } else {
                    Alert.alert("Lỗi", "Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
                    console.error("Cập nhât thất bại:", error);
                }
            }
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 15 }}>
                <View>
                    <Text style={styles.catalog_text}>Mật khẩu hiện tại:</Text>
                    <View style={styles.component}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setPassword}
                            value={password}
                        />
                    </View>
                </View>
                <View>
                    <Text style={styles.catalog_text}>Mật khẩu mới:</Text>
                    <View style={styles.component}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setNewPassword}
                            value={newPassword}
                        />
                    </View>
                </View>
                <View>
                    <Text style={styles.catalog_text}>Xác nhận mật khẩu mới:</Text>
                    <View style={styles.component}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setConfirmNewPassword}
                            value={confirmNewPassword}
                        />
                    </View>
                </View>
            </View>
            <View style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}>
                <TouchableOpacity style={styles.btn_confirm}
                   onPress={() => updatePassword()}
                >
                    <Text style={styles.btn_text}>Xác nhận</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default UpdatePasswordScreen

const styles = StyleSheet.create({
    component: {
        backgroundColor: colors.BackgroundHome,
        borderRadius: 15,
        shadowColor: "#000",
        justifyContent: 'space-between',
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },

    catalog_text: {
        fontWeight: "bold",
        marginBottom: 5,
        fontSize: 16
    },
    input: {
        width: '85%',
        marginLeft: 12,
        fontSize: 16,
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
})