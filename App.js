import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Theme from './src/core/Theme';
import Root from './src/navigation/BottomNavigator';
//screens
import LoginScreen from './src/screens/LoginScreen';
import BodySizeSet from './src/screens/BodySizeSet';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import AboutScreen from './src/screens/AboutScreen';
import TermsScreen from './src/screens/TermsScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';
import ProfileEditScreen from './src/screens/MyProfileScreen';
import PasswordChangeScreen from './src/screens/PasswordChangeScreen';
import BarcodeScanScreen from './src/screens/BarcodeScanScreen';
import QRScanScreen from './src/screens/QRScanScreen';
import ListGetScreen from './src/screens/ListGetScreen';
import ListTableScreen from './src/screens/ListTableScreen';
import SubAccountCreate from './src/screens/SubAccountCreate';
import SubAccountBodySizeSetScreen from './src/screens/SubAccountBodySizeSetScreen';
import AccountChangeScreen from './src/screens/AccountChangeScreen';
import LinkListGetScreen from './src/screens/LinkListGetScreen';
import LinkListSaveScreen from './src/screens/LinkListSaveScreen';
import LinkListTableScreen from './src/screens/LinkListTableScreen';

const Stack = createStackNavigator();
function App() {
  return (
    <PaperProvider theme={Theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: true, headerTitle: '' }} />
          <Stack.Screen name="BodySizeSet" component={BodySizeSet} />
          <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: true, headerTitle: '' }} />
          <Stack.Screen name="Root" component={Root} />
          <Stack.Screen name="AboutScreen" component={AboutScreen} />
          <Stack.Screen name="TermsScreen" component={TermsScreen} />
          <Stack.Screen name="PrivacyScreen" component={PrivacyScreen} />
          <Stack.Screen name="ProfileEditScreen" component={ProfileEditScreen} />
          <Stack.Screen name="PasswordChangeScreen" component={PasswordChangeScreen} />
          <Stack.Screen name="BarcodeScanScreen" component={BarcodeScanScreen} />
          <Stack.Screen name="QRScanScreen" component={QRScanScreen} />
          <Stack.Screen name="ListGetScreen" component={ListGetScreen} />
          <Stack.Screen name="ListTableScreen" component={ListTableScreen} />
          <Stack.Screen name="SubAccountCreate" component={SubAccountCreate} />
          <Stack.Screen name="SubAccountBodySizeSetScreen" component={SubAccountBodySizeSetScreen} />
          <Stack.Screen name="AccountChangeScreen" component={AccountChangeScreen} />
          <Stack.Screen name="LinkListGetScreen" component={LinkListGetScreen} />
          <Stack.Screen name="LinkListSaveScreen" component={LinkListSaveScreen} />
          <Stack.Screen name="LinkListTableScreen" component={LinkListTableScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}
export default App;