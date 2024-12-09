import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Dimensions,
  Alert,
  SafeAreaView,
} from "react-native";
import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useContext,
  useCallback,
} from "react";
import { Dropdown } from "react-native-element-dropdown"
import axios from "axios";
import colors from "../constants/colors";

interface catelogAddress {
    label: string;
    value: string;
  }
const AddressScreen = () => {
  // const { user } = useUser();
  // const userId = user._id
  // const {address} = route.params
  const [street, setStreet] = useState("");
  const [provinces, setProvinces] = useState<catelogAddress[]>([]);
  const [district, setDistrict] = useState<catelogAddress[]>([]);
  const [ward, setWard] = useState<catelogAddress[]>([]);
  const [valueProvinces, setValueProvinces] = useState<string | null>(null);
  const [valueDistrict, setValueDistrict] = useState<string | null>(null);
  const [valueWard, setValueWard] = useState<string | null>(null);
  const [labelProvinces, setLabelProvinces] = useState<string | null>(null);
  const [labelDistrict, setLabelDistrict] = useState<string | null>(null);
  const [labelWard, setLabelWard] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { height, width } = Dimensions.get("window");

  const token = "30dee1e2-a7c8-11ee-a59f-a260851ba65c";

    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
          headers: {
            'Content-Type': 'application/json',
            'Token': `${token}`, 
          },
        });
        // Chuyển đổi dữ liệu từ API thành mảng có thuộc tính 'label' và 'value'
        const formattedProvinces: catelogAddress[] = response.data.data.map(
            (province: any) => ({
              label: province.ProvinceName,
              value: province.ProvinceID,
            })
          );
        setProvinces(formattedProvinces);
      } catch (error) {
        console.error(error);
      } finally { 
        setLoading(false);
      }
    };
  
    const fetchDistricts = async (provinceId: string) => {
      setLoading(true);
      try {
        const response = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Token': `${token}`, 
          },
        });
        // Chuyển đổi dữ liệu từ API thành mảng có thuộc tính 'label' và 'value'
        const formattedDistricts: catelogAddress[] = response.data.data.map(
            (district: any) => ({
              label: district.DistrictName,
              value: district.DistrictID,
            })
          );
        setDistrict(formattedDistricts);
      } catch (error) {
        console.error(error);
      } finally { 
        setLoading(false);
      }
    };

    const fetchWards = async (districtId: string) => {
      setLoading(true);
      try {
        const response = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Token': `${token}`, 
          },
        });
        // Chuyển đổi dữ liệu từ API thành mảng có thuộc tính 'label' và 'value'
        const formattedWards: catelogAddress[] = response.data.data.map((ward: any) => ({
            label: ward.WardName,
            value: ward.WardCode,
          }));
          setWard(formattedWards);
      } catch (error) {
        console.error(error);
      } finally { 
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchProvinces();
    }, []);

    const UpdateAddress = async () => {
    //   const AddressInfo = {
    //     userId: userId,
    //     addressId: address._id,
    //     name: name,
    //     street: street,
    //     Ward: lableWard,
    //     District: lableDistrict,
    //     city: lableProvinces,
    //     mobileNo: phoneNumber,
    //   }
    //   axios.put(`${API_BASE_URL}/user/updateAddress`,AddressInfo).then((response) => {
    //     if (response.data.status === "FAILED") {
    //       alert(response.data.message); 
    //       console.log(response.data.message);
    //     } else {
    //       Alert.alert(
    //         '',
    //         `Cập nhật địa chỉ mới thành công.`,
    //         [
    //           { text: 'OK', onPress: () => navigation.navigate("Address") },
    //         ],
    //         { cancelable: false }
    //       );
    //     }
    //   })
    //   .catch((error) => {
    //     alert("error")
    //     console.log(error)
    //   })
    } 
  return (
    <View style={{backgroundColor: colors.Background}}>
      {/* <Pressable
        style={{
            flexDirection:'row',
            justifyContent:'space-between',
            height: height / 12,
            borderBottomWidth:0.5,
            paddingStart:10,
            backgroundColor:'white',
            borderColor: "#D0D0D0",
            alignItems:'center'
        }}
        onPress={() => navigation.navigate('ResetAddress', {address})}
      >
        {lableProvinces ? (
          <Text>{lableProvinces}, {lableDistrict}, {lableWard}</Text>
        ) : (
          <Text>{provinces}, {district}, {Ward}</Text>
        )}
        <AntDesign name="right" size={20} color="#D0D0D0" />
      </Pressable> */}
      <Text style={{ padding:10, fontSize:14, fontWeight:'bold',borderBottomWidth:0.5, borderColor: "#D0D0D0"}}>Tỉnh/Thành phố</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={provinces}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Chọn"
        searchPlaceholder="Search..."
        value={valueProvinces}
        onChange={item => {
          setValueProvinces(item.value);
          fetchDistricts(item.value)
          setLabelProvinces(item.label)
        }}
      />
      <Text style={{ padding:10, fontSize:14 ,fontWeight:'bold',borderBottomWidth:0.5, borderColor: "#D0D0D0"}}>Quận/Huyện</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={district}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Chọn"
        searchPlaceholder="Search..."
        value={valueDistrict}
        onChange={item => {
          setValueDistrict(item.value);
          fetchWards(item.value)
          setLabelDistrict(item.label)
        }}
      />
      <Text style={{ padding:10,fontSize:14,fontWeight:'bold', borderBottomWidth:0.5, borderColor: "#D0D0D0"}}>Phường/Xã</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={ward}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Chọn"
        searchPlaceholder="Search..."
        value={valueWard}
        onChange={item => {
          setValueWard(item.value);
          setLabelWard(item.label)
        }}
      />
      <Text style={{ padding:10, fontSize:14 ,fontWeight:'bold',borderBottomWidth:0.5, borderColor: "#D0D0D0"}}>Số nhà</Text>
      <TextInput
        value={street}
        onChangeText={(text) => {
          setStreet(text);
        }}
        style={{
          height: height / 12,
          borderBottomWidth:0.5,
          paddingStart:10,
          backgroundColor:'white',
          borderColor: "#D0D0D0"
        }}
        autoCorrect={false}
        placeholder="Tên đường, Tòa nhà, Số nhà."
      />
      <Pressable
        style={{
            height: height / 15,
            borderBottomWidth:0.5,
            paddingStart:10,
            backgroundColor: labelProvinces === null || labelDistrict === null || labelWard === null|| street === null ? "lightgray": colors.blue,
            borderColor: "#D0D0D0",
            alignItems:'center',
            justifyContent:'center'
        }}
        onPress={()=> {
          if ( labelProvinces === null || labelDistrict === null || labelWard === null|| street === null ) {
            Alert.alert("Điền đầy đủ thông tin");
          } else {
            UpdateAddress();
          }
        }}
      >
        <Text style={{ color: labelProvinces === null || labelDistrict === null || labelWard === null|| street === null ? "black": "white",}}>HOÀN THÀNH</Text>
        
      </Pressable>
    </View>
  );
};

export default AddressScreen

const styles = StyleSheet.create({

  dropdown: {
    height: 50,
    backgroundColor:'white',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    paddingLeft:10,
    paddingRight:10,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
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
});

