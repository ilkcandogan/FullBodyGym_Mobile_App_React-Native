import React from 'react';
import { View } from 'react-native'
import { Appbar, useTheme } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

//Tabs
import AccountTab from './AccountTab';
import BodySizeTab from './BodySizeTab';

function MyProfileScreen({ navigation }) {
    const { colors } = useTheme();
    const Tab = createMaterialTopTabNavigator();

    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.Content title="Hesabım" style={{ justifyContent: 'center', alignItems: 'center' }} />
            </Appbar.Header>
            <View style={{ backgroundColor: '#fff', flex: 1 }}>
                <Tab.Navigator screenOptions={{
                    tabBarIndicatorStyle: { backgroundColor: colors.secondary },
                    tabBarIndicatorContainerStyle: { height: 50 },
                    tabBarLabelStyle: { textTransform: 'capitalize', fontSize: 15 },
                    tabBarActiveTintColor: colors.secondary,
                    tabBarInactiveTintColor: 'gray',
                    tabBarPressColor: 'transparent',
                }}>
                    <Tab.Screen
                        name="AccountTab"
                        component={AccountTab}
                        options={{ tabBarLabel: 'Profil Bilgilerim' }}
                    />
                    <Tab.Screen
                        name="BodySizeTab"
                        component={BodySizeTab}
                        options={{ tabBarLabel: 'Beden Ölçülerim' }}
                    />
                </Tab.Navigator>
            </View>
        </React.Fragment>
    )
}

export default MyProfileScreen;