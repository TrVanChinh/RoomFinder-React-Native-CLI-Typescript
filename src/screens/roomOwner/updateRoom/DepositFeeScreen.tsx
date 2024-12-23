import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../../../constants/colors'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { Icon } from '@rneui/themed';
import DropdownComponent from '../../../components/DropBox';
import { useRoomUpdate } from '../../../context/UpdateRoomContext';
import { IDeposit } from '../../../type/room.interface';
import { roomService } from '../../../service';

type DepositFeeScreenProps = NativeStackScreenProps<RootStackParamList, 'DepositFee'>;

interface DropDownItem {
    label: string;
    value: string;
}

interface deposit {
    phiDatCoc: number;
    thoiHanDatCoc: number;
    donViThoiGian: string;
}

const DepositFeeScreen: React.FC<DepositFeeScreenProps> = ({ navigation }) => {
    const { height, width } = Dimensions.get("window");
    const { roomUpdate, setRoomUpdate } = useRoomUpdate();
    const [roomId, setRoomId] = useState(0);
    const [depositList, setDepositList] = useState<IDeposit[]>([]);
    const timeData: DropDownItem[] = [
        { label: 'ngày', value: 'ngày' },
        { label: 'tuần', value: 'tuần' },
        { label: 'tháng', value: 'tháng' },
    ];
    const [time, setTime] = useState(0);
    const [deposit, setDeposit] = useState(0);
    const [depositId, setDepositId] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isAdd, setAdd] = useState(false);
    const [timeType, setTimeType] = useState<string>("");
    const [request, setRequest] = useState(false);

    const toggleModal = () => {
        setDeposit(0);
        setTime(0);
        setModalVisible(!isModalVisible);
    };

    const closeModal = () => {
        setDeposit(0);
        setTime(0);
        setAdd(false);
        toggleModal();
    };

    const newDeposit = async(time: number, deposit: number, timeType:string, maPhong: number) => {

        try {
            const depositData: deposit = {
                phiDatCoc: deposit,
                thoiHanDatCoc: time,
                donViThoiGian: timeType,
            }
            await roomService.createOneDeposit(depositData, maPhong)
            Alert.alert("Thông báo", "Tạo phí đặt cọc thành công.");
            setRequest(!request)

        } catch (error) {
            Alert.alert("Thông báo lỗi", "Tạo dữ liệu phí đặt cọc thất bại.");
            console.log(error);
        }
    };

    const updateDeposit = async(time: number, deposit: number, timeType:string, depositId: number, maPhong: number) => {
        try {
            const depositData: IDeposit = {
                maPhiDatCoc: depositId,
                maPhong: maPhong,
                phiDatCoc: deposit,
                thoiHanDatCoc: time,
                donViThoiGian: timeType,
            }
            console.log("ma phí cọc:", depositId)
            await roomService.updateDeposit(depositId.toString(), depositData)
            Alert.alert("Thông báo", "Cập nhật dữ liệu phí đặt cọc thành công.");
            setRequest(!request)
        } catch (error) {
            Alert.alert("Thông báo lỗi", "Cập nhật dữ liệu phí đặt cọc thất bại.");
            console.log(error);
        }
    };

    const deleteDeposit = async (depositId: string) => {
        try {
            await roomService.deleteDeposit(depositId)
            Alert.alert("Thông báo lỗi", "Xóa dữ liệu phí đặt cọc thành công.");
            setRequest(!request)

        } catch (error) {
            Alert.alert("Thông báo lỗi", "Xóa dữ liệu phí đặt cọc thất bại.");
            console.log(error);
        }
    };

    const getDepositList = async (roomId: string) => {
        try {
            const deposit = await roomService.getDepositByRoom(roomId)
            setDepositList(deposit)
        } catch (error) {
            console.log("Lỗi truy vấn dữ liệu phí đặt cọc.")
        }
    }
    useEffect(()=>{
        if (roomUpdate) {
            setRoomId(roomUpdate?.maPhong)
            getDepositList(roomUpdate?.maPhong.toString())
        }
    },[request])
    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContainer}
            >
                <View style={[styles.component, { height: height }]}>
                    {/* modal */}
                    <Modal
                        visible={isModalVisible}
                        animationType="fade"
                        transparent={true}
                        onRequestClose={toggleModal}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                    <Icon name='close' size={20} color="black" />
                                </TouchableOpacity>

                                <Text style={[styles.input_title, { alignSelf: 'center' }]}>Phí đặt cọc:</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="Nhập phí đặt cọc"
                                    value={deposit.toString()}
                                    onChangeText={(text) => setDeposit(Number(text) || 0)}
                                    keyboardType="numeric"
                                />

                                <Text style={[styles.input_title, { alignSelf: 'center' }]}>Thời gian đặt cọc:</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="Nhập thời gian"
                                        value={time.toString()}
                                        onChangeText={(text) => setTime(Number(text) || 0)}
                                        keyboardType="numeric"
                                    />
                                    <View style={[styles.modalInput]}>
                                        <DropdownComponent
                                            data={timeData}
                                            placeholder="thời gian"
                                            value={timeType}
                                            onChange={(item) => setTimeType(item)}
                                        />
                                    </View>

                                </View>

                                <TouchableOpacity
                                    style={[styles.btn_confirm, { alignSelf: 'center' }]}
                                    onPress={() => {
                                        if (!deposit || !time || !timeType) {
                                            Alert.alert("Thông báo", "Không được để trống");
                                        } else {
                                            if (isAdd) {
                                                newDeposit(time, deposit, timeType, roomId);
                                                toggleModal();
                                            } else {
                                                updateDeposit(time, deposit, timeType, depositId, roomId);
                                                toggleModal();
                                            }
                                        }
                                    }}
                                >
                                    <Text style={styles.btn_text}>Lưu</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* Phí đặt cọc */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.input_title}>Phí đặt cọc:</Text>

                        {depositList?.map((item, index) =>
                            <View
                                key={index}
                                style={styles.input_container}
                            >
                                <View style={{ margin: 10 }}>
                                    <View style={{flexDirection:"row", alignItems:'center'}}>
                                        <Text style={{ color: 'black', fontSize: 16, fontWeight:'500' }}>Phí đặt cọc: </Text>
                                        <Text style={{ color: 'black', fontSize: 16 }}> {item.phiDatCoc} VNĐ</Text>
                                    </View>
                                    <View style={{flexDirection:"row", alignItems:'center'}}>
                                        <Text style={{ color: 'black', fontSize: 16, fontWeight:'500' }}>Thời hạn đặt cọc: </Text>
                                        <Text style={{ color: 'black', fontSize: 16 }}> {item.thoiHanDatCoc} {item.donViThoiGian}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', margin: 10, }}>
                                    <TouchableOpacity
                                        style={styles.btn_icon}
                                        onPress={() => {
                                            setAdd(false);
                                            toggleModal();
                                            setDepositId(item.maPhiDatCoc);
                                            setTime(item.thoiHanDatCoc);
                                            setDeposit(item.phiDatCoc)
                                        }}
                                    >
                                        <Icon name='edit' size={20} color="gray" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.btn_icon}
                                        onPress={() => {
                                            deleteDeposit(item.maPhiDatCoc.toString());
                                        }}
                                    >
                                        <Icon name='delete' size={20} color="gray" />

                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                    </View>


                </View>
            </ScrollView>
            <TouchableOpacity
                style={[styles.input_container, { padding: 5, justifyContent: 'center', borderColor: 'red', position: 'absolute', bottom: 5, left: 15, right: 15, backgroundColor: "#FFC6C6" }]}
                onPress={() => {
                    setAdd(true);
                    toggleModal();
                }}
            >
                <Text style={{ fontSize: 16, color: "red", fontWeight:'bold' }}>+ Thêm thông tin đặt cọc</Text>
            </TouchableOpacity>
        </>


    )
}

export default DepositFeeScreen

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 10,
        backgroundColor: colors.Background,

    },
    scrollContainer: {
        minHeight: Dimensions.get("window").height, // Đảm bảo nội dung luôn cao ít nhất bằng chiều cao màn hình
    },
    component: {
        backgroundColor: colors.BackgroundHome,
        padding: 10,
        borderRadius: 15,
        shadowColor: "#000",
        //   height: "100%"
    },
    input_container: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.gray_text,
        shadowColor: "#000",
        justifyContent: 'space-between',
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },

    input_title: {
        fontSize: 18,
        color: 'black',
        fontWeight:'bold'
    },

    btn_confirm: {
        backgroundColor: colors.blue,
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        width: "100%"
    },
    btn_text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },

    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: 300,
    },
    closeButton: {
        marginTop: -15,
        marginRight: -15,
        alignSelf: "flex-end",
    },
    modalInput: {
        marginVertical: 12,
        marginLeft: 5,
        paddingVertical: 0,
        padding: 15,
        height: 40,
        textAlign: "center",
        borderWidth: 1,
        borderColor: "lightgray",
    },
    btn_icon: {
        borderRadius: 15,
        padding: 5,
        backgroundColor: colors.gray, margin: 5
    }
})