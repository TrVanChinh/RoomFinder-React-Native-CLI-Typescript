import { Dimensions, FlatList, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect, useLayoutEffect, useRef, Component } from "react";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from "../navigation/RootStackParamList";
import { IMedia } from '../type/media.interface';
import VideoPlayer, { type VideoPlayerRef } from 'react-native-video-player';
import colors from '../constants/colors';
import { BottomModal, SlideAnimation, ModalContent } from "react-native-modals";
import { IDeposit, IInterior, MediaFormat } from '../type/room.interface';
import { useUser } from '../context/UserContext';

type DetailScreennProps = NativeStackScreenProps<RootStackParamList, 'Detail'>;
const listMedia: IMedia[] = [
    {
        maHinhAnh: 1,
        maPhong: 1,
        maDanhMucHinhAnh: 1,
        loaiTep: "Hình ảnh",
        duongDan: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg',
    },
    {
        maHinhAnh: 2,
        maPhong: 1,
        maDanhMucHinhAnh: 1,
        loaiTep: "Video",
        duongDan: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    {
        maHinhAnh: 3,
        maPhong: 1,
        maDanhMucHinhAnh: 1,
        loaiTep: "Hình ảnh",
        duongDan: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg',
    },
    {
        maHinhAnh: 4,
        maPhong: 1,
        maDanhMucHinhAnh: 1,
        loaiTep: "Hình ảnh",
        duongDan: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg',
    },
]
const DetailScreen: React.FC<DetailScreennProps> = ({ navigation, route }) => {
    const { height, width } = Dimensions.get("window");
    const { user } = useUser()
    const room = route.params.roomInfo;
    const fromScreen = route.params.fromScreen;
    const [selectIndex, setSelectIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [idOption, setIdOption] = useState(0);
    const playerRef = useRef<VideoPlayerRef>(null);

    const [mediaRoom, setmediaRoom] = useState<MediaFormat[]>([])
    const [roomType, setRoomType] = useState<string>(room.loaiPhong.loaiPhong)
    const [title, setTitle] = useState<string>(room.tieuDe)
    const [price, setPrice] = useState<number>(room.giaPhong)
    const [address, setAddress] = useState<string>(`${room.diaChi.soNha}, ${room.diaChi.phuongXa}, ${room.diaChi.quanHuyen}, ${room.diaChi.tinhThanh} `)

    const [email, setEmail] = useState(room.nguoiDung?.email)
    const [phoneNumber, setPhoneNumber] = useState(room.nguoiDung?.sdt)
    const [avartar, setAvartar] = useState(room.nguoiDung?.hinhDaiDien)
    const [userName, setUserName] = useState(room.nguoiDung?.tenNguoiDung)

    const [describe, setDescribe] = useState(room.moTa)
    const [roomWithOwner, setRoomWithOwner] = useState<boolean>(room.phongChungChu);
    const [area, setArea] = useState(room.dienTich);
    const [gacXep, setGacXep] = useState<boolean>(room.gacXep);
    const [kitchen, setkitchen] = useState<boolean>(room.nhaBep);
    const [numberOfBedrooms, setNumberOfBedrooms] = useState(room.soLuongPhongNgu)
    const [numberOfFloors, setNumberOfFloors] = useState(room.soTang)
    const [numberOfPeople, setNumberOfPeople] = useState(room.soNguoiToiDa)

    const [electricityPrice, setEletricityPrice] = useState(room.giaDien)
    const [waterPrice, setWaterPrice] = useState(room.giaNuoc)
    const [interior, setInterior] = useState<IInterior>(room.noiThat)
    const [deposit, setDeposit] = useState<IDeposit[]>(room.chiPhiDatCoc)
    // const [roomStatus, setRoomStatus] = useState(room.trangThaiPhong)
    const [roomStatus, setRoomStatus] = useState("Dừng thuê")


    useEffect(() => {
        const filteredMedia = room.hinhAnh.filter(
            (item) => item.danhMucHinhAnh === "Hình ảnh căn phòng"
        );
        setmediaRoom(filteredMedia);
    }, [])

    if (!mediaRoom || !avartar) {
        return (
            <View>
            </View>
        );
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1, bottom: 40 }}>
                    <View style={{ height: height * 0.4, width: width }}>
                        <FlatList
                            pagingEnabled
                            horizontal
                            onScroll={(e) => {
                                const index = +(e.nativeEvent.contentOffset.x / width).toFixed(0); // Chuyển về kiểu số
                                setSelectIndex(index);
                            }}
                            data={mediaRoom}
                            keyExtractor={(item) => item.maHinhAnh.toString()}
                            renderItem={({ item }) => {
                                return (
                                    <View style={{
                                        width: width,
                                        height: height * 0.4,
                                    }}>
                                        {item.loaiTep === "Hình ảnh" ? (
                                            <Image
                                                style={{
                                                    width: width,
                                                    height: height * 0.4,
                                                }}
                                                source={{
                                                    uri: item.duongDan && item.duongDan !== "" 
                                                      ? item.duongDan
                                                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBmqNgjci6KnLjSU9WFIKi0Y8NiE6XOEVPMg&s"
                                                  }}                                            />
                                        ) : (
                                            <View style={{ width: width, height: height * 0.4, justifyContent: 'center', backgroundColor: 'black' }}>
                                                <VideoPlayer
                                                    ref={playerRef}
                                                    endWithThumbnail
                                                    thumbnail={
                                                        require('../assets/image/thumbnail.jpeg')
                                                    }

                                                    source={{
                                                        uri: item.duongDan,
                                                    }}
                                                    onError={(e) => console.log(e)}
                                                    showDuration={true}
                                                />
                                            </View>
                                        )}
                                    </View>

                                );
                            }}
                        />
                    </View>

                    <View style={{ width: width }}>
                        <View style={styles.component}>
                            <Text style={styles.text_highlight}>{roomType}</Text>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={{ color: "red", fontWeight: "bold", fontSize: 14, margin: 5 }}>{price} VNĐ/tháng</Text>
                        </View >

                        {/* Địa chỉ */}
                        <View style={styles.component}>

                            {/* Địa chỉ */}
                            <View style={{ flexDirection: "row", alignItems: 'center', margin: 10, width: "85%" }}>
                                <Image
                                    style={{
                                        width: 20,
                                        height: 20,
                                    }}
                                    source={require('../assets/icon/marker.png')}
                                />
                                <Text style={{ fontSize: 15, marginLeft: 10, fontWeight: '500' }}>{address}</Text>
                            </View>

                            {/* Email */}
                            <View style={{ flexDirection: "row", alignItems: 'center', margin: 10, width: "85%" }}>
                                <Image
                                    style={{
                                        width: 20,
                                        height: 20,
                                    }}
                                    source={require('../assets/icon/envelope.png')}
                                />
                                <Text style={{ fontSize: 15, marginLeft: 10, fontWeight: '500' }}>{email}</Text>
                            </View>

                            {/* SĐT */}
                            <View style={{ flexDirection: "row", alignItems: 'center', margin: 10, width: "85%" }}>
                                <Image
                                    style={{
                                        width: 20,
                                        height: 20,
                                    }}
                                    source={require('../assets/icon/phone-call.png')}
                                />
                                <Text style={{ fontSize: 15, marginLeft: 10, fontWeight: '500' }}>{phoneNumber}</Text>
                            </View>
                        </View >

                        {/* Chủ phòng*/}
                        <View style={styles.component}>
                            <View style={{ width: width, flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                                <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 20,
                                            backgroundColor: colors.BackgroundHome,
                                            marginRight: 10
                                        }}
                                        source={{ uri: avartar }}
                                    />
                                    <Text style={styles.title}>{userName}</Text>
                                </View>

                                <Image
                                    style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 15,
                                        backgroundColor: colors.BackgroundHome,

                                    }}
                                    source={require('../assets/icon/angle-small-right.png')}
                                />

                            </View>
                        </View>

                        {/* Chi tiết */}
                        <View style={styles.component}>
                            <Text style={styles.title_component}>Chi tiết</Text>
                            <Text style={{ fontSize: 15, margin: 15, fontWeight: '500' }}>{describe}</Text>
                        </View >

                        {/* Tiện nghi */}
                        <View style={styles.component}>
                            <Text style={styles.title_component}>Tiện nghi</Text>
                            <View style={{ width: width, flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center' }}>
                                <View style={[styles.item_component]}>
                                    <Image
                                        style={{
                                            width: 30,
                                            height: 30,
                                        }}
                                        source={require('../assets/icon/land-layers.png')}
                                    />
                                    <Text >Diện tích</Text>
                                    <Text style={styles.text_price}>{area}</Text>
                                </View>

                                <View style={[styles.item_component]}>
                                    <Image
                                        style={{
                                            width: 30,
                                            height: 30,
                                        }}
                                        source={require('../assets/icon/user_yellow.png')}
                                    />
                                    <Text >Chung chủ</Text>
                                    <Text style={styles.text_price}>{roomWithOwner ? "Có" : "Không"}</Text>
                                </View>

                                <View style={[styles.item_component]}>
                                    <Image
                                        style={{
                                            width: 30,
                                            height: 30,
                                        }}
                                        source={require('../assets/icon/bed-empty.png')}
                                    />
                                    <Text >Phòng ngủ</Text>
                                    <Text style={styles.text_price}>{numberOfBedrooms}</Text>
                                </View>

                                <View style={[styles.item_component]}>
                                    <Image
                                        style={{
                                            width: 30,
                                            height: 30,
                                        }}
                                        source={require('../assets/icon/restaurant.png')}
                                    />
                                    <Text >Phòng bếp</Text>
                                    <Text style={styles.text_price}>{kitchen ? "Có" : "Không"}</Text>
                                </View>

                                {/* <View style={[styles.item_component]}>
                                    <Image
                                        style={{
                                            width: 30,
                                            height: 30,
                                        }}
                                        source={require('../assets/icon/toilet.png')}
                                    />
                                    <Text >Phòng vệ sinh</Text>
                                    <Text style={styles.text_price}>1 phòng</Text>
                                </View> */}

                                <View style={[styles.item_component]}>
                                    <Image
                                        style={{
                                            width: 30,
                                            height: 30,
                                        }}
                                        source={require('../assets/icon/apartment.png')}
                                    />
                                    <Text >Tầng</Text>
                                    <Text style={styles.text_price}>{numberOfFloors}</Text>
                                </View>

                                <View style={[styles.item_component]}>
                                    <Image
                                        style={{
                                            width: 30,
                                            height: 30,
                                        }}
                                        source={require('../assets/icon/user_yellow.png')}
                                    />
                                    <Text >số người tối đa</Text>
                                    <Text style={styles.text_price}>{numberOfPeople} </Text>
                                </View>

                                <View style={[styles.item_component]}>
                                    <Image
                                        style={{
                                            width: 30,
                                            height: 30,
                                        }}
                                        source={require('../assets/icon/stairs.png')}
                                    />
                                    <Text >gác xếp</Text>
                                    <Text style={styles.text_price}>{gacXep ? "Có" : "Không"}</Text>
                                </View>
                            </View>

                        </View>

                        {/* Phí dịch vụ */}
                        <View style={styles.component}>
                            <Text style={styles.title_component}>Phí dịch vụ</Text>
                            <View style={{ width: width, flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center' }}>

                                <View style={[styles.item_component]}>
                                    <Image
                                        style={{
                                            width: 30,
                                            height: 30,
                                        }}
                                        source={require('../assets/icon/bolt.png')}
                                    />
                                    <Text >Điện</Text>
                                    <Text style={styles.text_price}>{electricityPrice} vnd/Kwh</Text>
                                </View>

                                <View style={[styles.item_component]}>
                                    <Image
                                        style={{
                                            width: 30,
                                            height: 30,
                                        }}
                                        source={require('../assets/icon/faucet.png')}
                                    />
                                    <Text >Nước</Text>
                                    <Text style={styles.text_price}>{waterPrice} vnd/m3</Text>
                                </View>
                            </View>

                        </View>

                        {/* Nội thất */}
                        <View style={styles.component}>
                            <Text style={styles.title_component}>Nội thất</Text>
                            <View style={{ width: width, flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center' }}>
                                {interior.dieuHoa ? (
                                    <View style={[styles.item_component]}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                            }}
                                            source={require('../assets/icon/air-conditioner.png')}
                                        />
                                        <Text style={styles.text_price}>Điều Hòa</Text>
                                    </View>
                                ) : null}


                                {interior.nongLanh ? (
                                    <View style={[styles.item_component]}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                            }}
                                            source={require('../assets/icon/dryer-alt.png')}
                                        />
                                        <Text style={styles.text_price}>Máy nước nóng</Text>
                                    </View>
                                ) : null}

                                {interior.giuong ? (
                                    <View style={[styles.item_component]}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                            }}
                                            source={require('../assets/icon/bed-empty.png')}
                                        />
                                        <Text style={styles.text_price}>Giường</Text>
                                    </View>
                                ) : null}

                                {interior.banGhe ? (
                                    <View style={[styles.item_component]}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                            }}
                                            source={require('../assets/icon/chair-office.png')}
                                        />
                                        <Text style={styles.text_price}>Bàn ghế</Text>
                                    </View>
                                ) : null}

                                {interior.sofa ? (
                                    <View style={[styles.item_component]}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                            }}
                                            source={require('../assets/icon/loveseat.png')}
                                        />
                                        <Text style={styles.text_price}>Sofa</Text>
                                    </View>
                                ) : null}

                                {interior.chanGaGoi ? (
                                    <View style={[styles.item_component]}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                            }}
                                            source={require('../assets/icon/blanket.png')}
                                        />
                                        <Text style={styles.text_price}>Chăn ga</Text>
                                    </View>
                                ) : null}

                                {interior.tuLanh ? (
                                    <View style={[styles.item_component]}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                            }}
                                            source={require('../assets/icon/refrigerator.png')}
                                        />
                                        <Text style={styles.text_price}>Tủ lạnh</Text>
                                    </View>
                                ) : null}

                                {interior.doDungBep ? (
                                    <View style={[styles.item_component]}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                            }}
                                            source={require('../assets/icon/kitchen-set.png')}
                                        />
                                        <Text style={styles.text_price}>Đồ dùng bếp</Text>
                                    </View>
                                ) : null}

                                {interior.tuQuanAo ? (
                                    <View style={[styles.item_component]}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                            }}
                                            source={require('../assets/icon/drawer.png')}
                                        />
                                        <Text style={styles.text_price}>Tủ quần áo</Text>
                                    </View>
                                ) : null}

                                {interior.wifi ? (
                                    <View style={[styles.item_component]}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                            }}
                                            source={require('../assets/icon/wifi.png')}
                                        />
                                        <Text style={styles.text_price}>wifi</Text>
                                    </View>
                                ) : null}
                            </View>

                        </View>

                    </View>
                </ScrollView>

                {fromScreen === "ListRoomScreen" ? (
                    <View style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: colors.BackgroundHome, flexDirection: 'row', justifyContent: 'space-around', margin: 5 }}>
                        <Pressable
                            style={[styles.btn, { backgroundColor: "#FFC6C6", width: "30%" }]}
                        >
                            <Image
                                style={{
                                    width: 20,
                                    height: 20,
                                }}
                                source={require('../assets/icon/trash.png')}
                            />
                            <Text style={[styles.text_btn, { color: colors.red_icon }]}>Xóa</Text>
                        </Pressable>
                        {roomStatus === "Cho thuê" ? (
                            <Pressable
                                style={[styles.btn, { backgroundColor: colors.gray, width: "30%" }]}
                            >
                                <Image
                                    style={{
                                        width: 20,
                                        height: 20,
                                    }}
                                    source={require('../assets/icon/minus-circle.png')}
                                />
                                <Text style={[styles.text_btn, { color: "#7A7A7A" }]}>Dừng thuê</Text>
                            </Pressable>
                        ) : roomStatus === "Dừng thuê" ? (
                            <Pressable
                                style={[styles.btn, { backgroundColor: "#B0FFDC", width: "30%" }]}
                            >
                                <Image
                                    style={{
                                        width: 20,
                                        height: 20,
                                    }}
                                    source={require('../assets/icon/paper-plane.png')}
                                />
                                <Text style={[styles.text_btn, { color: "#28AF69" }]}>Cho thuê</Text>
                            </Pressable>
                        ) : null}


                        <Pressable
                            style={[styles.btn, { backgroundColor: "#B2E5FF", width: "30%" }]}
                            onPress={() => navigation.navigate("UpdateRoom", room)}
                        >
                            <Image
                                style={{
                                    width: 20,
                                    height: 20,
                                }}
                                source={require('../assets/icon/rotate-square.png')}
                            />
                            <Text style={[styles.text_btn, { color: colors.blue }]}>Cập nhật</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: colors.BackgroundHome, flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                        <Pressable
                            style={[styles.btn, { backgroundColor: "#FFC6C6", width: "28%" }]}
                        >
                            <Image
                                style={{
                                    width: 20,
                                    height: 20,
                                }}
                                source={require('../assets/icon/seal-exclamation.png')}
                            />
                            <Text style={[styles.text_btn, { color: colors.red_icon }]}>Báo cáo</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.btn, { backgroundColor: "#FEFFDE", width: "28%" }]}
                        >
                            <Image
                                style={{
                                    width: 20,
                                    height: 20,
                                }}
                                source={require('../assets/icon/comment.png')}
                            />
                            <Text style={[styles.text_btn, { color: colors.yellow }]}>Nhắn tin</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.btn, { backgroundColor: "#B2E5FF", width: "40%" }]}
                            onPress={() => setModalVisible(true)}
                        >
                            <Image
                                style={{
                                    width: 20,
                                    height: 20,
                                }}
                                source={require('../assets/icon/marketplace.png')}
                            />
                            <Text style={[styles.text_btn, { color: colors.blue }]}>Đặt cọc phòng</Text>
                        </Pressable>
                    </View>
                )}


                <BottomModal
                    swipeDirection={["up", "down"]}
                    swipeThreshold={200}
                    modalAnimation={
                        new SlideAnimation({
                            slideFrom: "bottom",
                        })
                    }
                    onHardwareBackPress={() => {
                        setModalVisible(!modalVisible);
                        return false; // Trả về boolean
                    }}
                    visible={modalVisible}
                    onTouchOutside={() => setModalVisible(!modalVisible)}
                >
                    <ModalContent
                        style={{ width: "100%", height: height * 0.45, alignItems: "center" }}
                    >
                        <View style={{ width: "100%" }}>
                            <FlatList
                                style={{ height: height * 0.3 }}
                                data={deposit}
                                keyExtractor={(item) => item.maPhiDatCoc.toString()}
                                renderItem={({ item }) => (
                                    <>
                                        <View
                                            style={{
                                                marginTop: 10,
                                                borderRadius: 15,
                                                backgroundColor:
                                                    idOption === item.maPhiDatCoc ? "#B2E5FF" : "white",
                                            }}
                                        >
                                            <Pressable
                                                onPress={() => {
                                                    setIdOption(item.maPhiDatCoc);
                                                }}
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: 'center',
                                                    borderWidth: 0.5,
                                                    borderRadius: 15,
                                                    borderColor: "#D8D8D8",
                                                    padding: 10,
                                                }}
                                            >
                                                <Text style={{ fontSize: 16, fontWeight: "500" }}>{item.phiDatCoc} VNĐ - {item.thoiHanDatCoc} {item.donViThoiGian}</Text>
                                            </Pressable>
                                        </View>
                                    </>

                                )} />
                            <Pressable style={styles.btn_confirm}
                            // onPress={submit}
                            >
                                <Text style={styles.btn_confirm_text}>Xác nhận</Text>
                            </Pressable>
                        </View>
                    </ModalContent>
                </BottomModal>

            </SafeAreaView>
        </>
    )
}

export default DetailScreen

const styles = StyleSheet.create({
    component: {
        width: "100%",
        backgroundColor: colors.BackgroundHome,
        marginVertical: 5
    },

    text_highlight: {
        color: colors.yellow,
        fontWeight: "bold",
        fontSize: 15,
        margin: 5
    },

    title: {
        color: "black",
        fontWeight: "bold",
        fontSize: 18,
        margin: 5
    },

    item_component: {
        width: "30%",
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },

    title_component: {
        margin: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },

    text_price: {
        color: "black",
        fontWeight: '500',
        fontSize: 14,
        margin: 5
    },

    btn: {
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        flexDirection: 'row'
    },
    text_btn: {
        fontWeight: 'bold',
        marginLeft: 10
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
    btn_confirm_text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },

})