import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from "../navigation/RootStackParamList";
import MyMap from '../components/Search/GoogleMapFullView';

type SearchScreenProps = NativeStackScreenProps<RootStackParamList, 'Search'>;
const SearchScreen: React.FC<SearchScreenProps> = ({ navigation })=> {
  return (
    <>
      <MyMap/>
    </>
  )
}

export default SearchScreen

const styles = StyleSheet.create({})