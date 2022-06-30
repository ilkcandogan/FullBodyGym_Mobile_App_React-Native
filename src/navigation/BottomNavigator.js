import React from 'react';
import { View, Text, Image } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from 'react-native-paper';

//Screens
import HomeScreen from '../screens/HomeScreen';
import FavScreen from '../screens/FavScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import SettingScreen from '../screens/SettingScreen';

function Root() {
    const Tab = createMaterialBottomTabNavigator();
    const { colors } = useTheme();

    return (
        <Tab.Navigator shifting={false} barStyle={{ backgroundColor: colors.background, borderTopColor: '#F0F0F0', borderTopWidth: 1, }} labeled={false} activeColor='#fff'>
            <Tab.Screen name='HomeScreen' component={HomeScreen} options={({ route }) => ({ tabBarIcon: ({ color, size, focused }) => (<Entypo name='home' color={focused ? colors.secondary : 'gray'} size={25} />) })} />
            <Tab.Screen name='FavScreen' component={FavScreen} options={({ route }) => ({ tabBarIcon: ({ color, size, focused }) => (<AntDesign name='star' color={focused ? colors.secondary : 'gray'} size={25} />) })} />

            <Tab.Screen name='Logo' component={HomeScreen} options={({ route }) => ({ tabBarIcon: ({ color, size }) => ( <View style={{ flex: 1, marginTop: -11 }}><Image source={require('../assets/test.png')} style={{ height: 45, width: 45, borderRadius: 100 }} /></View> ), })} listeners={({ navigation }) => ({ tabPress: (e) => { e.preventDefault(); } })} />

            <Tab.Screen name='MyProfileScreen' component={MyProfileScreen} options={({ route }) => ({ tabBarIcon: ({ color, size, focused }) => (<FontAwesome name='user' color={focused ? colors.secondary : 'gray'} size={25} />) })} />
            <Tab.Screen name='SettingScreen' component={SettingScreen} options={({ route }) => ({ tabBarIcon: ({ color, size, focused }) => (<Ionicons name='settings-sharp' color={focused ? colors.secondary : 'gray'}  size={25} />) })} />
        </Tab.Navigator>
    )

}

export default Root;