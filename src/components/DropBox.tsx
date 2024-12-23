import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface DropdownComponentProps {
    data: { label: string; value: string }[];
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({
    data,
    placeholder = 'Chọn', // Giá trị mặc định
    value,
    onChange,
}) => {
    const [isFocus, setIsFocus] = useState(false);

    return (
        <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            placeholder={placeholder}
            labelField="label"
            valueField="value"
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            value={value}
            onChange={(item) => {
                onChange(item.value);
                setIsFocus(false);
            }}
        />
    );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    dropdown: {
        width: 80,
        height: 40,
        fontSize: 14,
        justifyContent:'center',
        alignSelf:'center'
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    placeholderStyle: {
        fontSize: 14,
    },
    selectedTextStyle: {
        fontSize: 14,
    },

    inputSearchStyle: {
        height: 40,
        fontSize: 14,
    },
});
