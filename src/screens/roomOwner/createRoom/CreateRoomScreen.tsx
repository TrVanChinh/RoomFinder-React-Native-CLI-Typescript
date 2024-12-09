import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { RootStackParamList } from "../../../navigation/RootStackParamList";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import colors from '../../../constants/colors';
import { Dropdown } from 'react-native-element-dropdown';
import { launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker';
import { Icon } from '@rneui/themed';

import Title from '../../../components/Room/Title';

type CreateRoomScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateRoom'>;
interface DropDownItem {
  label: string;
  value: string;
}

interface listItem {
  label: string;
  value: boolean;
}

interface ImageOptions {
  mediaType: MediaType;
  selectionLimit: number;
}

const CreateRoomScreen: React.FC<CreateRoomScreenProps> = ({ navigation }) => {
  const [roomType, setRoomType] = useState<string>("");
  const [isFocus, setIsFocus] = useState(false);
  const [roomWithOwner, setRoomWithOwner] = useState<string>("");
  // const [interior, setInterior] = useState<string[]>([]);
  const [interior, setInterior] = useState<listItem[]>([
    {label:'Bàn ghế', value: false},
    { label: 'Bàn ghế', value: false },
    { label: 'Tủ lạnh', value: false },
    { label: 'Giường', value: false },
    { label: 'Bếp', value: false },
    { label: 'Tủ quần áo', value: false },
    { label: 'Máy giặt', value: false },
    { label: 'Điều hòa', value: false },
    { label: 'Máy nóng lạnh', value: false },
    ]);

  const [interiorStatus, setInteriorStatus] = useState<string>("");

  const [numberOfBedrooms, setNumberOfBedrooms] = useState(0)
  const [numberOfFloors, setNumberOfFloors] = useState(0)
  const [numberOfBathrooms, setNumberOfBathrooms] = useState(0)
  const [numberOfPeople, setNumberOfPeople] = useState(0)

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

  const [roomImages, setRoomImages] = useState<String[]>([]);
  // const [roomImages, setRoomImages] = useState([]);

  const [video, setVideo] = useState<String[]>([])
  const [menu, setMenu] = useState('Bước 1:Thông tin phòng');
  const [hinhAnhQuyenSuDungDat, setHinhAnhQuyenSuDungDat] = useState<String[]>([]);
  const [hinhAnhGiayPhepKinhDoanh, setHinhAnhGiayPhepKinhDoanh] = useState<String[]>([]);
  const [hinhAnhGiayPhongChay, setHinhAnhGiayPhongChay] = useState<String[]>([]);


  const handleSelectRoomImages = async () => {
    const options: ImageOptions = {
      mediaType: 'photo',
      selectionLimit: 10,
    };

    const result = await launchImageLibrary(options);

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.error('ImagePicker Error: ', result.errorMessage);
    } else if (result.assets) {
      // Extract URIs of selected images
      const selectedImages = result.assets.map((asset) => asset.uri || '');
      setRoomImages((prevImages) => {
        if (prevImages.length + selectedImages.length > 10) {
          Alert.alert('Tối đa 10 ảnh!');
          return prevImages;
        }
        return [...prevImages, ...selectedImages];
      });
    }
  };

  const handleSelectImage = async (
    setImage: React.Dispatch<React.SetStateAction<String[]>>,
    mediaType: MediaType
  ) => {
    Alert.alert(
      'Tải ảnh và video từ thiết bị',
      'Bạn muốn chọn ảnh từ đâu?',
      [
        {
          text: 'Chụp bằng Camera',
          onPress: () => {
            launchCamera(
              { mediaType: mediaType, cameraType: 'back' },
              (response) => {
                if (response.didCancel) {
                  Alert.alert('Hủy', 'Bạn đã hủy chụp ảnh');
                } else if (response.errorCode) {
                  Alert.alert('Lỗi', `Mã lỗi: ${response.errorCode}`);
                  console.log(response.errorCode)
                } else if (response.assets && response.assets.length > 0) {
                  const selectedImages = response.assets.map((asset) => asset.uri || '');
                  setImage((prevImages) => {
                    if (mediaType == 'photo' && prevImages.length + selectedImages.length > 10) {
                      Alert.alert('Tối đa 10 ảnh!');
                      return prevImages;
                    }
                    if (mediaType == 'video' && prevImages.length + selectedImages.length > 2) {
                      Alert.alert('Tối đa 2 video!');
                      return prevImages;
                    }
                    return [...prevImages, ...selectedImages];
                  });
                }
              }
            );
          },
        },
        {
          text: 'Chọn từ Thư viện',
          onPress: () => {
            launchImageLibrary({ mediaType: mediaType }, (response) => {
              if (response.didCancel) {
                Alert.alert('Hủy', 'Bạn đã hủy chọn ảnh');
              } else if (response.errorCode) {
                Alert.alert('Lỗi', `Mã lỗi: ${response.errorCode}`);
              } else if (response.assets && response.assets.length > 0) {
                const selectedImages = response.assets.map((asset) => asset.uri || '');
                setImage((prevImages) => {
                  if (prevImages.length + selectedImages.length > 10) {
                    Alert.alert('Tối đa 10 ảnh!');
                    return prevImages;
                  }
                  return [...prevImages, ...selectedImages];
                });
              }
            });
          },
        },
        { text: 'Hủy', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const changeImageItem = async (
    setImages: React.Dispatch<React.SetStateAction<String[]>>,
    mediaType: MediaType,
    imageUri: string
  ) => {
    const options: ImageOptions = {
      mediaType: mediaType,
      selectionLimit: 1, // Chỉ cho phép chọn một ảnh
    };

    const result = await launchImageLibrary(options);

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.error('ImagePicker Error: ', result.errorMessage);
    } else if (result.assets) {
      const selectedImageUri = result.assets[0]?.uri || '';

      setImages((prevImages) => {
        const index = prevImages.indexOf(imageUri);
        if (index === -1) {
          console.warn('Image to replace not found in the list.');
          return prevImages;
        }
        const updatedImages = [...prevImages];
        updatedImages[index] = selectedImageUri;
        return updatedImages;
      });
    }
  };

  const deleteImageItem = async (
    setImages: React.Dispatch<React.SetStateAction<String[]>>,
    imageUri: string
  ) => {
    setImages((prevImages) => {
      const index = prevImages.indexOf(imageUri);
      if (index === -1) {
        console.warn('Ảnh không tồn tại trong danh sách.');
        return prevImages;
      }
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
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
  

  return (
    <ScrollView style={styles.container}>
      <Title title={menu} />
      {menu === 'Bước 1:Thông tin phòng' ? (
        <View style={styles.component}>
          <View>
            <Text style={styles.input_title}>Tiêu đề:</Text>
            <TouchableOpacity style={styles.input_container}
              onPress={() => navigation.navigate("Address")}
            >
              <TextInput
                style={styles.input}
              //   onChangeText={setName}
              //   value={name}
              />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Mô tả:</Text>
            <TouchableOpacity style={styles.input_container}
              onPress={() => navigation.navigate("Address")}
            >
              <TextInput
                style={styles.textArea}
                // value={text}
                // onChangeText={(value) => setText(value)}
                placeholder="Nhập nội dung tại đây..."
                multiline={true} // Cho phép nhập nhiều dòng
                numberOfLines={4} // Gợi ý số dòng hiển thị
                textAlignVertical="top" // Canh chỉnh văn bản ở đầu
              />
            </TouchableOpacity>
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
                  setRoomWithOwner(item.value);;
                }}
              />
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Địa chỉ:</Text>
            <TouchableOpacity style={styles.input_container}
              onPress={() => navigation.navigate("Address")}
            >
              <TextInput
                style={styles.input}
                //   onChangeText={setName}
                //   value={name}
                editable={false} // Không cho phép chỉnh sửa
                selectTextOnFocus={false} // Ngăn chọn văn bản
              />
              <Image source={require('../../../assets/icon/angle-right.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Diện tích:</Text>
            <View style={styles.input_container}>
              <TextInput
                style={styles.input}
              //   onChangeText={setName}
              //   value={name}
              />
              <Text style={styles.unit}>m2</Text>

            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Giá thuê phòng:</Text>
            <View style={styles.input_container}>
              <TextInput
                style={styles.input}
              //   onChangeText={setName}
              //   value={name}
              />
              <Text style={styles.unit}>vnđ</Text>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Giá điện:</Text>
            <View style={styles.input_container}>
              <TextInput
                style={styles.input}
              //   onChangeText={setName}
              //   value={name}
              />
              <Text style={styles.unit}>đ/kwh</Text>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Giá nước:</Text>
            <View style={styles.input_container}>
              <TextInput
                style={styles.input}
              //   onChangeText={setName}
              //   value={name}
              />
              <Text style={styles.unit}>khối</Text>
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

          <View style={{ marginTop: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
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
          </View>

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
                  setInteriorStatus(item.value);;
                }}
              />
            </View>

              {interiorStatus === "false" ? (
                // <View style={{ flexDirection:'row', flexWrap:'wrap'}}>
                //   {interior.map((item, index) => (
                //     <View key={index}> 
                //     <TouchableOpacity key={index} style={{ padding:5, borderColor:colors.gray_text, borderWidth:1, borderRadius:15, }}>
                //       <Text>{item}</Text>
                //     </TouchableOpacity>
                //     </View>
                //   ))}
                // </View>
                <View></View>
                  
              ):(
                <View style={{ flexDirection:'row', flexWrap:'wrap'}}>
                  {interior.map((item, index) => (
                    <View key={index} style={{margin:5}}> 
                    <TouchableOpacity key={index} style={{ padding:5, borderColor: item.value ? 'green' : colors.gray_text, borderWidth:1, borderRadius:15, }}
                      onPress={() => handleSelectItem(index)}
                  >
                      <Text style={{fontSize:16, color: item.value ? 'green' : colors.gray_text}}>{item.label}</Text>
                    </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            
          </View>
          <View style={{ marginTop: 10, alignItems: 'center' }}>
            <TouchableOpacity style={styles.btn_confirm}
              onPress={() => setMenu('Bước 2:Hình ảnh và video')}
            >
              <Text style={styles.btn_text}>Tiếp theo</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : menu === 'Bước 2:Hình ảnh và video' ? (

        <View style={styles.component}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.input_title}>Hình ảnh phòng:</Text>
              <TouchableOpacity
              // onPress={handleDelete}
              >
                <Text style={{ color: "red" }}>Xóa ảnh</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.name_item}>
              <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap" }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "white" }}
                  onPress={handleSelectRoomImages}
                >
                  <View
                    style={{
                      margin: 3,
                      padding: 5,
                      borderColor: "lightgray",
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderStyle: "dashed",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "red",
                        textAlign: "center",
                        textAlignVertical: "center",
                        width: 200 / 3,
                        height: 200 / 3,
                      }}
                    >
                      +Thêm ảnh
                    </Text>
                  </View>
                </TouchableOpacity>
                {roomImages.map((image, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => changeImageItem(setRoomImages, 'photo', String(image))}
                      style={{
                        // borderColor: selectedImages.includes(index)
                        //   ? "red"
                        //   : "lightgray",
                        // borderWidth: selectedImages.includes(index) ? 1 : 1,
                        margin: 3,
                        padding: 5,
                      }}
                    >
                      <Image
                        source={{ uri: String(image) }}
                        style={{
                          width: 200 / 3,
                          height: 200 / 3,
                        }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteImageItem(setRoomImages, String(image))}
                      style={styles.btn_ImageClose}
                    >
                      <Icon name='close' size={15} color="black" />
                    </TouchableOpacity>
                  </View>

                ))}
              </View>
              <Text style={{ paddingVertical: 5 }}>Thêm tối đa 10 ảnh</Text>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.input_title}>Video </Text>
              <Text>(không bắt buộc)</Text>
            </View>

            {/* <View style={styles.input_container_video}>

              <View>
                {video ? (
                  <Image
                    style={styles.inputImage}
                    source={{ uri: video }}
                  />
                ) : (
                  <View></View>
                )}
              </View>

              <Pressable style={styles.btn_chooseVideo}
                // onPress={() => handleSelectImage(setVideo, "video")}
              >
                <Image source={require("../../../assets/icon/plusIcon.jpg")} style={styles.plusIcon} />
                <Text style={{ color: video ? 'white' : colors.gray_text }}>Thêm video</Text>
              </Pressable>
            </View> */}
            <View style={styles.name_item}>
              <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap" }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "white" }}
                  onPress={() => handleSelectImage(setVideo, 'video',)}
                >
                  <View
                    style={{
                      margin: 3,
                      padding: 5,
                      borderColor: "lightgray",
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderStyle: "dashed",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "red",
                        textAlign: "center",
                        textAlignVertical: "center",
                        width: 200 / 3,
                        height: 200 / 3,
                      }}
                    >
                      +Thêm video
                    </Text>
                  </View>
                </TouchableOpacity>
                {video.map((video, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => changeImageItem(setRoomImages, 'video', String(video))}
                      style={{
                        // borderColor: selectedImages.includes(index)
                        //   ? "red"
                        //   : "lightgray",
                        // borderWidth: selectedImages.includes(index) ? 1 : 1,
                        margin: 3,
                        padding: 5,
                      }}
                    >
                      <Image
                        source={{ uri: String(video) }}
                        style={{
                          width: 200 / 3,
                          height: 200 / 3,
                        }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteImageItem(setVideo, String(video))}
                      style={styles.btn_ImageClose}
                    >
                      <Icon name='close' size={15} color="black" />
                    </TouchableOpacity>
                  </View>

                ))}
              </View>
              <Text style={{ paddingVertical: 5 }}>Thêm tối đa 3 video</Text>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Giấy chứng nhận quyền sử dụng đất:</Text>
            <View style={styles.name_item}>
              <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap" }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "white" }}
                  onPress={() => handleSelectImage(setHinhAnhQuyenSuDungDat, 'photo',)}
                >
                  <View
                    style={{
                      margin: 3,
                      padding: 5,
                      borderColor: "lightgray",
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderStyle: "dashed",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "red",
                        textAlign: "center",
                        textAlignVertical: "center",
                        width: 200 / 3,
                        height: 200 / 3,
                      }}
                    >
                      +Thêm ảnh
                    </Text>
                  </View>
                </TouchableOpacity>
                {hinhAnhQuyenSuDungDat.map((image, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => changeImageItem(setHinhAnhQuyenSuDungDat, 'photo', String(image))}
                      style={{
                        // borderColor: selectedImages.includes(index)
                        //   ? "red"
                        //   : "lightgray",
                        // borderWidth: selectedImages.includes(index) ? 1 : 1,
                        margin: 3,
                        padding: 5,
                      }}
                    >
                      <Image
                        source={{ uri: String(image) }}
                        style={{
                          width: 200 / 3,
                          height: 200 / 3,
                        }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteImageItem(setHinhAnhQuyenSuDungDat, String(image))}
                      style={styles.btn_ImageClose}
                    >
                      <Icon name='close' size={15} color="black" />
                    </TouchableOpacity>
                  </View>

                ))}
              </View>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Giấy phép kinh doanh hộ gia đình:</Text>
            {/* <View style={styles.input_container_video}>
              <Pressable style={styles.btn_chooseVideo}
              //  onPress={() => handleSelectImage(setFrontImageUri, 'Mặt trước căn cước')}
              >
                <Image source={require("../../../assets/icon/plusIcon.jpg")} style={styles.plusIcon} />
                <Text>Thêm ảnh</Text>
              </Pressable>
            </View> */}
            <View style={styles.name_item}>
              <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap" }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "white" }}
                  onPress={() => handleSelectImage(setHinhAnhGiayPhepKinhDoanh, 'photo',)}
                >
                  <View
                    style={{
                      margin: 3,
                      padding: 5,
                      borderColor: "lightgray",
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderStyle: "dashed",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "red",
                        textAlign: "center",
                        textAlignVertical: "center",
                        width: 200 / 3,
                        height: 200 / 3,
                      }}
                    >
                      +Thêm ảnh
                    </Text>
                  </View>
                </TouchableOpacity>
                {hinhAnhGiayPhepKinhDoanh.map((image, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => changeImageItem(setHinhAnhGiayPhepKinhDoanh, 'photo', String(image))}
                      style={{
                        // borderColor: selectedImages.includes(index)
                        //   ? "red"
                        //   : "lightgray",
                        // borderWidth: selectedImages.includes(index) ? 1 : 1,
                        margin: 3,
                        padding: 5,
                      }}
                    >
                      <Image
                        source={{ uri: String(image) }}
                        style={{
                          width: 200 / 3,
                          height: 200 / 3,
                        }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteImageItem(setHinhAnhGiayPhepKinhDoanh, String(image))}
                      style={styles.btn_ImageClose}
                    >
                      <Icon name='close' size={15} color="black" />
                    </TouchableOpacity>
                  </View>

                ))}
              </View>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Giấy chứng nhận phòng cháy chữa cháy:</Text>
            <View style={styles.name_item}>
              <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap" }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "white" }}
                  onPress={() => handleSelectImage(setHinhAnhGiayPhongChay, 'photo',)}
                >
                  <View
                    style={{
                      margin: 3,
                      padding: 5,
                      borderColor: "lightgray",
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderStyle: "dashed",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "red",
                        textAlign: "center",
                        textAlignVertical: "center",
                        width: 200 / 3,
                        height: 200 / 3,
                      }}
                    >
                      +Thêm ảnh
                    </Text>
                  </View>
                </TouchableOpacity>
                {hinhAnhGiayPhongChay.map((image, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => changeImageItem(setHinhAnhGiayPhongChay, 'photo', String(image))}
                      style={{
                        // borderColor: selectedImages.includes(index)
                        //   ? "red"
                        //   : "lightgray",
                        // borderWidth: selectedImages.includes(index) ? 1 : 1,
                        margin: 3,
                        padding: 5,
                      }}
                    >
                      <Image
                        source={{ uri: String(image) }}
                        style={{
                          width: 200 / 3,
                          height: 200 / 3,
                        }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteImageItem(setHinhAnhGiayPhongChay, String(image))}
                      style={styles.btn_ImageClose}
                    >
                      <Icon name='close' size={15} color="black" />
                    </TouchableOpacity>
                  </View>

                ))}
              </View>
            </View>
          </View>

          <View style={{ marginTop: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
            <TouchableOpacity style={styles.btn_back}
              onPress={() => setMenu('Bước 1:Thông tin phòng')}
            >
              <Text style={[styles.btn_text, { color: 'black' }]}>Quay lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn_confirm}
              onPress={() => setMenu('Bước 3:Thông tin liên hệ')}
            >
              <Text style={styles.btn_text}>Tiếp theo</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.component}>
          <View>
            <Text style={styles.input_title}>Họ và tên:</Text>
            <View style={styles.input_container}>
              <TextInput
                style={styles.input}
              //   onChangeText={setName}
              //   value={name}
              />
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Số điện thoại:</Text>
            <View style={styles.input_container}>
              <TextInput
                style={styles.input}
              //   onChangeText={setName}
              //   value={name}
              />
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.input_title}>Email:</Text>
            <View style={styles.input_container}>
              <TextInput
                style={styles.input}
              //   onChangeText={setName}
              //   value={name}
              />
            </View>
          </View>
          <View style={{ marginTop: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
            <TouchableOpacity style={styles.btn_back}
              onPress={() => setMenu('Bước 2:Hình ảnh và video')}
            >
              <Text style={[styles.btn_text, { color: 'black' }]}>Quay lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn_confirm}
            // onPress={()=> setMenu('Bước 3:Thông tin liên hệ')}
            >
              <Text style={styles.btn_text}>Tiếp theo</Text>
            </TouchableOpacity>
          </View>

        </View>
      )}
      {/*         
        <TouchableOpacity style={styles.btn_confirm}>
                  <Text style={styles.btn_text}>Xác nhận</Text>
        </TouchableOpacity> */}
    </ScrollView>
  )
}

export default CreateRoomScreen

const styles = StyleSheet.create({
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
  btn_back: {
    backgroundColor: colors.Background,
    borderWidth: 1,
    borderColor: colors.gray_text,
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    fontSize: 18,
    fontWeight: 'bold',
    width: 100
  },
  btn_confirm: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    fontSize: 18,
    fontWeight: 'bold',
    width: 100
  },
  btn_text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  name_item: {
    marginVertical: 1,
    alignItems: "center",
    width: "100%",
    padding: 5,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: colors.gray_text,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  btn_chooseVideo: {
    position: "absolute",
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.gray_text,
    borderRadius: 10,
    padding: 5,
  },
  plusIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  inputImage: {
    width: 150,
    height: 100,
    resizeMode: 'cover',
  },
  btn_ImageClose: {
    position: "absolute",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray_text,
    padding: 2,
    right: 0,
    backgroundColor: '#FFFFFF'
  }
})