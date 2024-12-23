import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Icon } from '@rneui/themed';
import colors from '../constants/colors';

const Checkbox = ({ onCheckbox1Change }: { onCheckbox1Change: (value: boolean) => void }) => {
    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(false);

    const handleCheckbox1Press = () => {
        const newValue = !checkbox1;
        setCheckbox1(newValue);
        setCheckbox2(false);
        onCheckbox1Change(newValue); // Gửi giá trị của checkbox1 về component cha
    };

    const handleCheckbox2Press = () => {
        setCheckbox2(!checkbox2);
        setCheckbox1(false);
        onCheckbox1Change(false); // Khi chọn checkbox2, checkbox1 sẽ bị tắt
    };

    return (
        <View style={{ flexDirection: 'row', paddingVertical: 10, width: 120, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', marginRight:10}}> 
                <Pressable onPress={handleCheckbox1Press}>
                    {checkbox1 ? (
                        <Icon name="radio-button-checked" size={20} color= {colors.blue} />
                    ) : (
                        <Icon name="radio-button-unchecked" size={20} color="gray" />
                    )}
                </Pressable>
                <Text style={{ fontSize: 16 }}>Có</Text>
            </View>

            <View style={{ flexDirection: 'row',}}>
                <Pressable onPress={handleCheckbox2Press}>
                    {checkbox2 ? (
                        <Icon name="radio-button-checked" size={20} color= {colors.blue} />
                    ) : (
                        <Icon name="radio-button-unchecked" size={20} color="gray" />
                    )}
                </Pressable>
                <Text style={{ fontSize: 16 }}>Không</Text>

            </View>

        </View>
    );
};

export default Checkbox;

const styles = StyleSheet.create({});
