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
  memo,
} from "react";
import { Dropdown } from "react-native-element-dropdown"
import axios from "axios";
import colors from "../constants/colors";
import { Icon } from '@rneui/themed';
import { useUser } from "../context/UserContext";
import { IAddress } from "../type/address.interface";
import { addressService } from "../service";
import { RootStackParamList } from "../navigation/RootStackParamList";
import { NativeStackScreenProps } from '@react-navigation/native-stack';

interface catelogAddress {
  label: string;
  value: string;
}
type AddresscreenProps = NativeStackScreenProps<RootStackParamList, 'Address'>;
const AddressScreen: React.FC<AddresscreenProps> = ({ navigation }) => {
  const { user } = useUser();
  const maDiaChi = user?.maDiaChi
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
    if (!labelWard) {
      Alert.alert("Thông báo lỗi", "Chưa có thông tin phường xã.");
    } else if (!labelDistrict) {
      Alert.alert("Thông báo lỗi", "Chưa có thông tin quận huyện.");
    }
    else if (!labelProvinces) {
      Alert.alert("Thông báo lỗi", "Chưa có thông tin tỉnh thành.");
    } else {
      if (maDiaChi) {
        const AddressInfo: IAddress = {
          maDiaChi: Number(maDiaChi),
          soNha: street,
          phuongXa: labelWard,
          quanHuyen: labelDistrict,
          tinhThanh: labelProvinces,
          kinhDo: null,
          viDo: null,
        }

        try {
          await addressService.updateAddress(AddressInfo, Number(maDiaChi))
          Alert.alert("Thông báo", "Cập nhật địa chỉ thành công.", [
            { text: "OK", onPress: () => navigation.navigate("Main") },
          ]);
          
        } catch (error) {
          console.log(error);
        }
      }
    }
    
  }
  return (
    <View style={{ backgroundColor: colors.Background, flex: 1 }}>

      <Text style={styles.title}>Tỉnh/Thành phố</Text>
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
      <Text style={styles.title}>Quận/Huyện</Text>
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
      <Text style={styles.title}>Phường/Xã</Text>
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
      <Text style={styles.title}>Số nhà</Text>
      <TextInput
        value={street}
        onChangeText={(text) => {
          setStreet(text);
        }}
        style={{
          height: 40,
          borderBottomWidth: 0.5,
          paddingStart: 10,
          backgroundColor: 'white',
          borderColor: "#D0D0D0"
        }}
        autoCorrect={false}
        placeholder="Tên đường, Tòa nhà, Số nhà."
      />

      <Pressable style={styles.btn_confirm}
        onPress={() => UpdateAddress()}
      >
        <Text style={styles.btn_text}>Xác nhận</Text>
      </Pressable>
    </View>

  );
};

export default AddressScreen

const styles = StyleSheet.create({
  title: {
    padding: 10, 
    fontSize: 14, 
    fontWeight: 'bold', 
    borderBottomWidth: 0.5, 
    borderColor: "#D0D0D0"
  },
  dropdown: {
    height: 40,
    backgroundColor: 'white',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    paddingLeft: 10,
    paddingRight: 10,
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
    color: '#fff',
  },
  btn_confirm: {
    backgroundColor: colors.blue,
    padding: 15,
    borderRadius: 10,
    margin: 20,
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

