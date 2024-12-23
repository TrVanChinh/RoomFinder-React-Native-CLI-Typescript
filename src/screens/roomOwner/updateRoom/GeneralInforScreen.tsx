import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../../../constants/colors'
import { Dropdown } from 'react-native-element-dropdown';
import Checkbox from '../../../components/Checkbox';
import { useAddress } from '../../../context/AddressContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootStackParamList';
import { addressService, roomService } from '../../../service';
import { IRoom } from '../../../type/room.interface';
import { useRoomUpdate } from '../../../context/UpdateRoomContext';

interface listItem {
    label: string;
    column: string;
    value: boolean;
}

interface DropDownItem {
    label: string;
    value: string;
}


type GeneralInforScreenProps = NativeStackScreenProps<RootStackParamList, 'GeneralInfor'>;

const GeneralInforScreen: React.FC<GeneralInforScreenProps> = ({ navigation, route }) => {
    
    const { roomUpdate, setRoomUpdate } = useRoomUpdate();
    // console.log(room.diaChi.phuongXa)
    const { address, setAddress } = useAddress();
    const [isFocus, setIsFocus] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [describe, setDescribe] = useState<string>("");
    const [roomType, setRoomType] = useState<string>("");
    const [roomWithOwner, setRoomWithOwner] = useState<string>("");
    const [area, setArea] = useState<string>("");
    const [gacXep, setGacXep] = useState(false);
    const [kitchen, setkitchen] = useState(false);
    const [numberOfBedrooms, setNumberOfBedrooms] = useState(0)
    const [numberOfFloors, setNumberOfFloors] = useState(0)
    const [numberOfBathrooms, setNumberOfBathrooms] = useState(0)
    const [numberOfPeople, setNumberOfPeople] = useState(0)
    const [roomPrice, setRoomPrice] = useState(0)
    const [electricityPrice, setElectricityPrice] = useState(0)
    const [waterPrice, setWaterPrice] = useState(0)
    const [interiorStatusData, setInteriorStatusData] = useState("")
    const [interiorId, setInteriorId] = useState(0)
    const [addressId, setAddressId] = useState(0)
    const [roomId, setRoomId] = useState(0)

    const [interior, setInterior] = useState<listItem[]>([
        { label: 'Bàn ghế', column: "banGhe", value: false },
        { label: 'Sofa', column: "sofa", value: false },
        { label: 'wifi', column: "wifi", value: false },
        { label: 'Tủ lạnh', column: "tuLanh", value: false },
        { label: 'Giường', column: "giuong", value: false },
        { label: 'chăn ga gối', column: "chanGaGoi", value: false },
        { label: 'Tủ quần áo', column: "tuQuanAo", value: false },
        { label: 'Đồ dùng nhà bếp', column: "doDungBep", value: false },
        { label: 'Điều hòa', column: "dieuHoa", value: false },
        { label: 'Máy nóng lạnh', column: "nongLanh", value: false },
    ]);

    const [interiorStatus, setInteriorStatus] = useState<string>("false");


    const roomTypeData: DropDownItem[] = [
        { label: "Nhà ở", value: "1" },
        { label: "Chung cư", value: "2" },
        { label: "Phòng trọ", value: "3" },
    ];

    const roomWithOwnerData: DropDownItem[] = [
        { label: "Chung chủ", value: "true" },
        { label: "Không chung chủ", value: "false" },
    ];

    const interiorData: DropDownItem[] = [
        { label: "Có", value: "true" },
        { label: "Không", value: "false" },
    ];

    const handleCheckboxGacXep = (value: boolean) => {
        setGacXep(value);
    };

    const handleCheckboxKitChen = (value: boolean) => {
        setkitchen(value);
    };

    const handleSelectItem = (selectedIndex: number) => {
        setInterior((prevItems) => {
            const updatedItems = [...prevItems];
            if (selectedIndex >= 0 && selectedIndex < updatedItems.length) {
                updatedItems[selectedIndex] = {
                    ...updatedItems[selectedIndex],
                    value: !updatedItems[selectedIndex].value,
                };
            } else {
                console.warn('Index không hợp lệ');
            }

            return updatedItems;
        });
    };

    useEffect(() => {
        if (roomUpdate) {
            setTitle(roomUpdate.tieuDe);
            setDescribe(roomUpdate.moTa);
            setRoomType(roomUpdate.loaiPhong.maLoaiPhong.toString());
            setRoomWithOwner(roomUpdate.phongChungChu.toString())
            setAddress(roomUpdate.diaChi)
            setArea(roomUpdate.dienTich.replace('m2', '').trim())
            setRoomPrice(roomUpdate.giaPhong)
            setElectricityPrice(roomUpdate.giaDien)
            setWaterPrice(roomUpdate.giaNuoc)
            setNumberOfBedrooms(roomUpdate.soLuongPhongNgu)
            setNumberOfFloors(roomUpdate.soTang)
            setNumberOfPeople(roomUpdate.soNguoiToiDa)
            setInteriorStatusData(roomUpdate.trangThaiPhong)
            setInteriorId(roomUpdate.noiThat.maNoiThat)
            setAddressId(roomUpdate.diaChi.maDiaChi)
            setRoomId(roomUpdate.maPhong)
            // if(room.noiThat!== null) {
            //     setInteriorStatus("true")
            //     // setInterior(room.noiThat)
            // } else {
            //     setInteriorStatus("false")
            // }

            // setGacXep(room.gacXep)
            // setAvatar(user.avatarUrl);
        }
    }, [roomUpdate]);

    const UpdateRoom = async () => {
        if (!address) {
            Alert.alert("Thông báo lỗi", "Chưa có thông tin địa chỉ phòng.");
        } else {
            try {
                const maDiaChi = await addressService.updateAddress(address, addressId)
                const maNoiThat = await roomService.updateInterior(interiorId, interior)

                const roomData: IRoom = {
                    maPhong: roomId,
                    maNguoiDung: 28,
                    maLoaiPhong: Number(roomType),
                    maDiaChi: maDiaChi,
                    maNoiThat: maNoiThat,
                    tieuDe: title,
                    moTa: describe,
                    dienTich: area + "m2",
                    phongChungChu: roomWithOwner === "true",
                    soLuongPhongNgu: numberOfBedrooms,
                    soTang: numberOfFloors,
                    soNguoiToiDa: numberOfPeople,
                    trangThaiPhong: interiorStatusData,
                    gacXep: gacXep,
                    nhaBep: kitchen,
                    giaPhong: roomPrice,
                    giaDien: electricityPrice,
                    giaNuoc: waterPrice,
                }

                const roomUpdate = await roomService.updateBasicInfoRoom(roomData)

                Alert.alert("Thông báo", "Cập nhật phòng thành công.", [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate('Main')
                    }
                ]);
            } catch (error) {
                Alert.alert("Thông báo lỗi", "Cập nhật phòng thất bại.");
                console.log(error);
            }
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.component}>
                <View>
                    <Text style={styles.input_title}>Tiêu đề:</Text>
                    <View style={styles.input_container}
                    >
                        <TextInput
                            style={styles.input}
                            onChangeText={setTitle}
                            value={title}
                        />
                    </View>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={styles.input_title}>Mô tả:</Text>
                    <View style={styles.input_container}
                    >
                        <TextInput
                            style={styles.textArea}
                            value={describe}
                            onChangeText={(value) => setDescribe(value)}
                            placeholder="Nhập nội dung tại đây..."
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.input_title}>Loại phòng:</Text>
                    <View style={styles.input_container}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={roomTypeData}
                            placeholder="Chọn"
                            labelField="label"
                            valueField="value"
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            value={roomType}
                            onChange={(item) => {
                                setRoomType(item.value);;
                                setIsFocus(false);
                            }}
                        />
                    </View>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={styles.input_title}>Phòng chung chủ:</Text>
                    <View style={styles.input_container}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={roomWithOwnerData}
                            placeholder="Chọn"
                            labelField="label"
                            valueField="value"
                            value={roomWithOwner}
                            onChange={(item) => {
                                setRoomWithOwner(item.value);
                            }}
                        />
                    </View>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={styles.input_title}>Địa chỉ:</Text>
                    <TouchableOpacity style={[styles.input_container]}
                        onPress={() => navigation.navigate("AddressRoom", { fromScreen: 'GeneralInforScreen' })}

                    >
                        {address ? (<Text
                            style={[styles.input, { color: "black", }]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        > {address?.soNha}, {address?.phuongXa}, {address?.quanHuyen}, {address?.tinhThanh}
                        </Text>) : (<Text
                            style={[styles.input, { color: "black", }]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                        </Text>)}

                        <Image source={require('../../../assets/icon/angle-right.png')} style={styles.icon} />
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={styles.input_title}>Diện tích:</Text>
                    <View style={styles.input_container}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setArea}
                            value={area}
                        />
                        <Text style={styles.unit}>m2</Text>

                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.input_title}>Giá thuê phòng:</Text>
                    <View style={styles.input_container}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setRoomPrice(Number(text) || 0)}
                            value={roomPrice.toString()}
                            keyboardType="numeric"
                        />
                        <Text style={styles.unit}>vnđ</Text>
                    </View>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={styles.input_title}>Giá điện:</Text>
                    <View style={styles.input_container}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setElectricityPrice(Number(text) || 0)}
                            value={electricityPrice.toString()}
                            keyboardType="numeric"
                        />
                        <Text style={styles.unit}>đ/kwh</Text>
                    </View>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={styles.input_title}>Giá nước:</Text>
                    <View style={styles.input_container}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setWaterPrice(Number(text) || 0)}
                            value={waterPrice.toString()}
                            keyboardType="numeric"
                        />
                        <Text style={styles.unit}>đ/khối</Text>
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[styles.input_title, { marginRight: 100 }]}>Gác xếp:</Text>
                        <Checkbox onCheckbox1Change={handleCheckboxGacXep} />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[styles.input_title, { marginRight: 100 }]}>Nhà bếp:</Text>
                        <Checkbox onCheckbox1Change={handleCheckboxKitChen} />
                    </View>
                </View>

                <View style={{ marginTop: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Text style={styles.input_title}>số phòng ngủ:</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {numberOfBedrooms > 0 ? (
                            <Pressable
                                onPress={() => setNumberOfBedrooms(numberOfBedrooms - 1)}
                                style={{
                                    backgroundColor: "#6E7280",
                                    padding: 7,
                                    borderTopLeftRadius: 6,
                                    borderBottomLeftRadius: 6,
                                }}
                            >
                                <Image source={require('../../../assets/icon/minus_white.png')} style={styles.icon} />
                            </Pressable>
                        ) : (
                            <Pressable
                                style={{
                                    backgroundColor: "#D8D8D8",
                                    padding: 7,
                                    borderTopLeftRadius: 6,
                                    borderBottomLeftRadius: 6,
                                }}
                            >
                                <Image source={require('../../../assets/icon/minus_white.png')} style={styles.icon} />
                            </Pressable>
                        )}

                        <View
                            style={{
                                backgroundColor: "white",
                                borderWidth: 1,
                                borderColor: colors.gray_text,
                                paddingHorizontal: 18,
                                paddingVertical: 6,
                            }}
                        >
                            <Text>{numberOfBedrooms}</Text>
                        </View>

                        <Pressable
                            onPress={() => setNumberOfBedrooms(numberOfBedrooms + 1)}
                            style={{
                                backgroundColor: "#6E7280",
                                padding: 7,
                                borderTopRightRadius: 6,
                                borderBottomRightRadius: 6,
                            }}
                        >
                            <Image source={require('../../../assets/icon/plus_white.png')} style={styles.icon} />
                        </Pressable>
                    </View>
                </View>

                {/* <View style={{ marginTop: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text style={styles.input_title}>số phòng tắm, vệ sinh:</Text>
            <View style={{ flexDirection: 'row' }}>
              {numberOfBathrooms > 0 ? (
                <Pressable
                  onPress={() => setNumberOfBathrooms(numberOfBathrooms - 1)}
                  style={{
                    backgroundColor: "#6E7280",
                    padding: 7,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}
                >
                  <Image source={require('../../../assets/icon/minus_white.png')} style={styles.icon} />
                </Pressable>
              ) : (
                <Pressable
                  style={{
                    backgroundColor: "#D8D8D8",
                    padding: 7,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}
                >
                  <Image source={require('../../../assets/icon/minus_white.png')} style={styles.icon} />
                </Pressable>
              )}

              <View
                style={{
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: colors.gray_text,
                  paddingHorizontal: 18,
                  paddingVertical: 6,
                }}
              >
                <Text>{numberOfBathrooms}</Text>
              </View>

              <Pressable
                onPress={() => setNumberOfBathrooms(numberOfBathrooms + 1)}
                style={{
                  backgroundColor: "#6E7280",
                  padding: 7,
                  borderTopRightRadius: 6,
                  borderBottomRightRadius: 6,
                }}
              >
                <Image source={require('../../../assets/icon/plus_white.png')} style={styles.icon} />
              </Pressable>
            </View>
          </View> */}

                <View style={{ marginTop: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Text style={styles.input_title}>số tầng:</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {numberOfFloors > 0 ? (
                            <Pressable
                                onPress={() => setNumberOfFloors(numberOfFloors - 1)}
                                style={{
                                    backgroundColor: "#6E7280",
                                    padding: 7,
                                    borderTopLeftRadius: 6,
                                    borderBottomLeftRadius: 6,
                                }}
                            >
                                <Image source={require('../../../assets/icon/minus_white.png')} style={styles.icon} />
                            </Pressable>
                        ) : (
                            <Pressable
                                style={{
                                    backgroundColor: "#D8D8D8",
                                    padding: 7,
                                    borderTopLeftRadius: 6,
                                    borderBottomLeftRadius: 6,
                                }}
                            >
                                <Image source={require('../../../assets/icon/minus_white.png')} style={styles.icon} />
                            </Pressable>
                        )}

                        <View
                            style={{
                                backgroundColor: "white",
                                borderWidth: 1,
                                borderColor: colors.gray_text,
                                paddingHorizontal: 18,
                                paddingVertical: 6,
                            }}
                        >
                            <Text>{numberOfFloors}</Text>
                        </View>

                        <Pressable
                            onPress={() => setNumberOfFloors(numberOfFloors + 1)}
                            style={{
                                backgroundColor: "#6E7280",
                                padding: 7,
                                borderTopRightRadius: 6,
                                borderBottomRightRadius: 6,
                            }}
                        >
                            <Image source={require('../../../assets/icon/plus_white.png')} style={styles.icon} />
                        </Pressable>
                    </View>
                </View>

                <View style={{ marginTop: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Text style={styles.input_title}>số người ở tối đa:</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {numberOfPeople > 0 ? (
                            <Pressable
                                onPress={() => setNumberOfPeople(numberOfPeople - 1)}
                                style={{
                                    backgroundColor: "#6E7280",
                                    padding: 7,
                                    borderTopLeftRadius: 6,
                                    borderBottomLeftRadius: 6,
                                }}
                            >
                                <Image source={require('../../../assets/icon/minus_white.png')} style={styles.icon} />
                            </Pressable>
                        ) : (
                            <Pressable
                                style={{
                                    backgroundColor: "#D8D8D8",
                                    padding: 7,
                                    borderTopLeftRadius: 6,
                                    borderBottomLeftRadius: 6,
                                }}
                            >
                                <Image source={require('../../../assets/icon/minus_white.png')} style={styles.icon} />
                            </Pressable>
                        )}

                        <View
                            style={{
                                backgroundColor: "white",
                                borderWidth: 1,
                                borderColor: colors.gray_text,
                                paddingHorizontal: 18,
                                paddingVertical: 6,
                            }}
                        >
                            <Text>{numberOfPeople}</Text>
                        </View>

                        <Pressable
                            onPress={() => setNumberOfPeople(numberOfPeople + 1)}
                            style={{
                                backgroundColor: "#6E7280",
                                padding: 7,
                                borderTopRightRadius: 6,
                                borderBottomRightRadius: 6,
                            }}
                        >
                            <Image source={require('../../../assets/icon/plus_white.png')} style={styles.icon} />
                        </Pressable>
                    </View>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={styles.input_title}>Nội thất:</Text>
                    <View style={styles.input_container}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={interiorData}
                            placeholder="Chọn"
                            labelField="label"
                            valueField="value"
                            value={interiorStatus}
                            onChange={(item) => {
                                setInteriorStatus(item.value);
                            }}
                        />
                    </View>

                    {interiorStatus === "false" ? (
                        <View></View>
                    ) : (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {interior.map((item, index) => (
                                <View key={index} style={{ margin: 5 }}>
                                    <TouchableOpacity key={index} style={{ padding: 10, backgroundColor: item.value ? colors.pink_background : colors.gray, borderRadius: 15, }}
                                        onPress={() => handleSelectItem(index)}
                                    >
                                        <Text style={{ fontSize: 16, color: item.value ? colors.red_text : 'black' }}>{item.label}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}

                </View>
                <View style={{ marginTop: 10, alignItems: 'center' }}>
                    <TouchableOpacity style={styles.btn_confirm}
                        onPress={() => UpdateRoom()}
                    >
                        <Text style={styles.btn_text}>Cập nhật</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default GeneralInforScreen

const styles = StyleSheet.create({
    label: {
        fontSize: 18,
        marginBottom: 20,
    },
    checkboxContainer: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        marginBottom: 10,
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: colors.Background
    },

    component: {
        backgroundColor: colors.BackgroundHome,
        padding: 10,
        borderRadius: 15,
        shadowColor: "#000",
        justifyContent: 'center',
        height: "100%"
    },
    input_container: {
        backgroundColor: colors.BackgroundHome,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.gray_text,
        shadowColor: "#000",
        justifyContent: 'space-between',
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },

    input_container_video: {
        marginVertical: 5,
        backgroundColor: colors.BackgroundHome,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.gray_text,
        shadowColor: "#000",
        borderStyle: "dashed",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },

    catalog_text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.gray_text,
    },

    icon: {
        width: 20,
        height: 20,
    },
    input: {
        width: '82%',
        height: 40,
        marginLeft: 12,
        fontSize: 16,
    },
    input_title: {
        fontSize: 18,
        color: 'black',
        fontWeight:'bold'
    },
    dropdown: {
        width: '95%',
        height: 40,
        marginLeft: 12,
        fontSize: 16,
    },
    iconStyle: {
        width: 30,
        height: 30,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },

    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    textArea: {
        width: '85%',
        height: 120,
        marginLeft: 12,
        fontSize: 16,
        textAlignVertical: "top",
    },
    unit: {
        fontSize: 16,
        marginRight: 50,
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





})