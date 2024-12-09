import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from '@rneui/themed';

import colors from '../constants/colors';

// import HomeScreen from '../screens/HomeScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import NotificationScreen from '../screens/NotificationScreen';

import { HomeScreen,
         ProfileScreen,
         NotificationScreen,
         MapScreen,
         MessageScreen,
         LoginScreen,
         SearchScreen,
         RegisterScreen,
         RegisterRoomMasterScreen ,
         VerifyScreen,
         IdCardScreen,
         UserInfoScreen,
         AddressScreen,
         CreateRoomScreen,
         AddMediaScreen
      } from '../screens/index'
import { RootStackParamList } from './RootStackParamList';
import { RootTabParamList } from './RootTabParamList ';

const StackNavigation = () => {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    const Tab = createBottomTabNavigator<RootTabParamList>();
    function BottomTabs() {
        return (
          <Tab.Navigator>
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarLabel: "",
                tabBarLabelStyle: {
                  color:colors.blue,
                },
                tabBarStyle: {
                  justifyContent: 'center', 
                },
                headerShown: false,
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <Icon name="home" size={30} color={colors.blue} />
                  ) : (
                    <Icon name="home" size={30} color="gray" />
                  ),
              }}
            />
            <Tab.Screen
              name="Message"
              component={MessageScreen}
              options={{
                tabBarLabel: "",
                tabBarLabelStyle: {
                  color:colors.blue,
                },
                tabBarStyle: {
                  justifyContent: 'center', 
                },
                headerShown: false,
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <>
                    <Icon name='message' size={30} color={colors.blue} />
                    </>
                  ) : (
                    <>
                    <Icon name='message' size={30} color="gray"/>
                    </>
                    
                  ),
              }}
            />
            
            <Tab.Screen
              name="Notification"
              component={NotificationScreen}
              options={{
                tabBarLabel: "",
                tabBarLabelStyle: {
                  color:colors.blue,
                },
                tabBarIconStyle: {
                  justifyContent: 'center', 
                },
                headerShown: false,
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <>
                    <Icon
                      name="notifications"
                      type='MaterialIcons'
                      size={30}
                      color={colors.blue} 
                    />
                    </>
                  ) : (
                    <>
                    <Icon
                      name='notifications'
                      type='MaterialIcons'
                      size={30}
                      color="gray"
                    />
                    </>
                    
                  ),
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                tabBarLabel: "",
                tabBarLabelStyle: {
                  color:colors.blue,
                },
                tabBarStyle: {
                  justifyContent: 'center', 
                },
                headerShown: false,
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <Icon name="person" size={30} color={colors.blue} />
                  ) : (
                    <Icon name="person" size={30} color="gray" />
                  ),
              }}
            />
          </Tab.Navigator>
        );
      }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Message" component={MessageScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Notification" component={NotificationScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Map" component={MapScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown:false}}/>
        <Stack.Screen name="RegisterRoomMaster" component={RegisterRoomMasterScreen} options={{headerShown:false}}/>
        <Stack.Screen name="IdCard" component={IdCardScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Verify" component={VerifyScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Search" component={SearchScreen} options={{headerShown:false}}/>
        <Stack.Screen name="UserInfo" component={UserInfoScreen} options={{headerTitle:'Thông tin tài khoản'}}/>
        <Stack.Screen name="Address" component={AddressScreen} options={{headerTitle:'Địa chỉ '}}/>
        <Stack.Screen name="CreateRoom" component={CreateRoomScreen} options={{headerTitle:'Tạo thông tin phòng '}}/>
        <Stack.Screen name="AddMedia" component={AddMediaScreen} options={{headerTitle:'Bước 2'}}/>

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigation


const styles = StyleSheet.create({})