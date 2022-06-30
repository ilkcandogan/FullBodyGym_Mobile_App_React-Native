import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk';
import EncryptedStorage from 'react-native-encrypted-storage';
import { API_URL } from '../core/Constants';
import { passwordValidator, emailValidator } from '../core/Helpers';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';


//components
import SignLayout from '../components/SignLayout';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

export default function LoginScreen({ navigation }) {
    //EncryptedStorage.removeItem('user_session');
    //EncryptedStorage.removeItem('user_meta');

    const [isLoggedWait, setIsLoggedWait] = useState(true);

    const { colors } = useTheme();
    const [wait, setWait] = useState(false);
    const [spinnerShow, setSpinnerShow] = useState(false);
    const styles = StyleSheet.create({
        forgotPassword: {
            width: '100%',
            alignItems: 'flex-end',
            marginBottom: 24,
        },
        row: {
            flexDirection: 'row',
            marginTop: 4,
        },
        label: {
            color: colors.text,
        },
        link: {
            fontWeight: 'bold',
            color: '#000',
        },
    });

    const [email, setEmail] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '', show: false });

    const onLoginPressed = () => {
        if (!email.value) {
            setEmail({ ...email, error: 'Zorunlu alan' })
        }

        if (!password.value) {
            setPassword({ ...password, error: 'Zorunlu alan' });
        }

        if (email.value && password.value) {
            if (!emailValidator(email.value) || !passwordValidator(password.value)) {
                Alert.alert('Uyarı', 'E-posta adresiniz veya şifreniz yanlış. Lütfen tekrar deneyin!', [
                    { text: "Tamam", onPress: () => { }, }
                ]);
                return;
            }
            setWait(true);

            axios.post(API_URL + '/login', {
                email: email.value,
                password: password.value
            }).then((resp) => {
                setWait(false);
                if (resp.data.status == 'success') {
                    EncryptedStorage.setItem('current_user', JSON.stringify({ id: resp.data.userId })).then(() => { })

                    EncryptedStorage.setItem('user_session', JSON.stringify({ 'token': resp.data.token })).then(() => {
                        if (resp.data.bodyStatus === 'success') {
                            EncryptedStorage.setItem('user_meta', JSON.stringify({ 'bodyStatus': true })).then(() => {
                                navigation.navigate('Root');
                            }).catch((error) => {
                                Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                                    { text: "Tamam", onPress: () => { }, }
                                ]);
                            })
                        }
                        else {
                            navigation.navigate('BodySizeSet', { token: resp.data.token });
                        }
                    }).catch((error) => {
                        Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                            { text: "Tamam", onPress: () => { }, }
                        ]);
                    })

                }
                else if (resp.data.status == 'email-or-password-wrong') {
                    Alert.alert('Uyarı', 'E-posta adresiniz veya şifreniz yanlış. Lütfen tekrar deneyin!', [
                        { text: "Tamam", onPress: () => { }, }
                    ]);
                }
                else if (resp.data.status == 'account-unverified') {
                    Alert.alert('Doğrulanmamış Hesap', 'Lütfen e-posta adresinize gönderilen bağlantı ile hesabınızı onaylayın!', [
                        { text: "Tamam", onPress: () => { }, }
                    ]);
                }
            }).catch((error) => {
                setWait(false);
                Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                    { text: "Tamam", onPress: () => { }, }
                ]);
            });

        }
    }

    const SignWithGoogle = () => {
        GoogleSignin.configure({
            androidClientId: '533672609738-7qqb058nditu4p4bgsml1rpanquvqa8s.apps.googleusercontent.com',
            /*iosClientId: 'ADD_YOUR_iOS_CLIENT_ID_HERE',*/
        });

        async function signIn() {
            try {
                await GoogleSignin.hasPlayServices();
                await GoogleSignin.signIn();
                GoogleSignin.getTokens().then((data) => {
                    setSpinnerShow(true);

                    axios.post(API_URL + '/login/with/google', {
                        accessToken: data.accessToken
                    }).then((resp) => {
                        setSpinnerShow(false);

                        EncryptedStorage.setItem('user_session', JSON.stringify({ 'token': resp.data.token })).then(() => {
                            if (resp.data.bodyStatus === 'success') {
                                EncryptedStorage.setItem('current_user', JSON.stringify({ id: resp.data.userId })).then(() => { })

                                EncryptedStorage.setItem('user_meta', JSON.stringify({ 'bodyStatus': true })).then(() => {
                                    navigation.navigate('Root');
                                }).catch((error) => {
                                    Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                                        { text: "Tamam", onPress: () => { }, }
                                    ]);
                                })
                            }
                            else {
                                navigation.navigate('BodySizeSet', { token: resp.data.token });
                            }
                        }).catch((error) => {
                            Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                                { text: "Tamam", onPress: () => { }, }
                            ]);
                        })
                    }).catch((error) => {
                        setSpinnerShow(false);
                        Alert.alert('Uyarı', 'Bir sorun oluştu. Lütfen tekrar deneyin.', [
                            { text: "Tamam", onPress: () => { }, }
                        ]);
                    })
                }).catch((error) => {
                    Alert.alert('Uyarı', 'Bir sorun oluştu. Lütfen tekrar deneyin.', [
                        { text: "Tamam", onPress: () => { }, }
                    ]);
                })

            } catch (error) {
                if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                    Alert.alert('Uyarı', 'Play servisleri kullanılamıyor.', [
                        { text: "Tamam", onPress: () => { }, }
                    ]);
                }
            }
            await GoogleSignin.signOut()
        }
        signIn()
    }

    const SignWithFacebook = () => {
        const getInfoFromToken = (token) => {
            const PROFILE_REQUEST_PARAMS = {
                fields: {
                    string: 'id,name,first_name,last_name,email',
                },
            };
            const profileRequest = new GraphRequest(
                '/me',
                { token, parameters: PROFILE_REQUEST_PARAMS },
                (error, user) => {
                    if (error) {
                        Alert.alert('Uyarı', 'Bir sorun oluştu. Lütfen tekrar deneyin.', [
                            { text: "Tamam", onPress: () => { }, }
                        ])
                    } else {
                        setSpinnerShow(true);

                        axios.post(API_URL + '/login/with/facebook', {
                            accessToken: token,
                            facebookUserId: user.id
                        }).then((resp) => {
                            setSpinnerShow(false);

                            EncryptedStorage.setItem('user_session', JSON.stringify({ 'token': resp.data.token })).then(() => {
                                EncryptedStorage.setItem('current_user', JSON.stringify({ id: resp.data.userId })).then(() => { })
                                
                                if (resp.data.bodyStatus === 'success') {
                                    EncryptedStorage.setItem('user_meta', JSON.stringify({ 'bodyStatus': true })).then(() => {
                                        navigation.navigate('Root');
                                    }).catch((error) => {
                                        Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                                            { text: "Tamam", onPress: () => { }, }
                                        ]);
                                    })
                                }
                                else {
                                    navigation.navigate('BodySizeSet', { token: resp.data.token });
                                }
                            }).catch((error) => {
                                Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                                    { text: "Tamam", onPress: () => { }, }
                                ]);
                            })
                        }).catch((error) => {
                            setSpinnerShow(false);
                            Alert.alert('Uyarı', 'Bir sorun oluştu. Lütfen tekrar deneyin.', [
                                { text: "Tamam", onPress: () => { }, }
                            ]);
                        })

                    }
                },
            );
            new GraphRequestManager().addRequest(profileRequest).start();
        };

        LoginManager.logInWithPermissions(['public_profile']).then(
            login => {
                if (login.isCancelled) {
                    console.log('Login cancelled');
                } else {
                    AccessToken.getCurrentAccessToken().then(data => {
                        const accessToken = data.accessToken.toString();
                        getInfoFromToken(accessToken);
                    });
                }
            },
            error => {
                console.log('Login fail with error: ' + error);
            },
        );
    }

    //#region Is Login
    useEffect(() => {
        EncryptedStorage.getItem('user_session').then((data) => {
            let sessionJson = JSON.parse(data);

            if (sessionJson.token) {
                EncryptedStorage.getItem('user_meta').then((data) => {
                    let metaJson = JSON.parse(data);

                    if (metaJson?.bodyStatus === true) {
                        navigation.navigate('Root');
                    }
                    else {
                        navigation.navigate('BodySizeSet', { token: sessionJson.token });
                    }
                    setIsLoggedWait(false)
                }).catch((error) => {
                    setIsLoggedWait(false)
                })
            }
        }).catch((error) => {
            setIsLoggedWait(false)
        })
    }, [])
    //#endregion

    return (
        <React.Fragment>
            <Spinner visible={spinnerShow} color={colors.secondary} />
            {isLoggedWait ? (
                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                    <ActivityIndicator size="large" color={colors.secondary} />
                </View>
            ) : (
                <KeyboardAwareScrollView style={{ backgroundColor: colors.background, paddingTop: 50 }}>
                    <SignLayout>
                        <Text style={{ fontWeight: 'bold', color: colors.primary, fontSize: 35, marginBottom: 50 }}>FULLBODYGYM</Text>
                        <TextInput
                            label='E-Posta'
                            disabled={wait}
                            returnKeyType='next'
                            onChangeText={text => setEmail({ value: text, error: '' })}
                            error={!!email.error}
                            errorText={email.error}
                            autoCapitalize='none'
                            autoComplate='email'
                            textContentType='emailAddress'
                            keyboardType='email-address'
                        />
                        <TextInput
                            label='Şifre'
                            disabled={wait}
                            returnKeyType='done'
                            onChangeText={text => setPassword({ value: text, error: '', show: password.show })}
                            error={!!password.error}
                            errorText={password.error}
                            rightIcon={!wait ? (password.show ? 'eye' : 'eye-off') : null}
                            rightButtonClick={() => setPassword({ ...password, show: !password.show })}
                            secureTextEntry={!password.show}
                        />
                        <View style={styles.forgotPassword}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('ForgotPasswordScreen')}
                            >
                                <Text style={styles.label}>Şifreni mi unuttun?</Text>
                            </TouchableOpacity>
                        </View>
                        <Button mode="contained" onPress={wait ? null : onLoginPressed} style={{ backgroundColor: colors.primary }} loading={wait} >
                            {wait ? 'Lütfen bekleyin...' : 'Giriş Yap'}
                        </Button>
                        <View style={styles.row}>
                            <Text style={styles.label}>Hesabın yok mu? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                                <Text style={styles.link}>Üye Ol</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.row}>
                            <Text style={[styles.label, { color: 'gray', textAlign: 'center', fontSize: 15, marginTop: 20, padding: 4 }]}>Ya da aşağıda bulunan bağlantılardan birini kullanarak giriş yapın</Text>
                        </View>

                        <View style={[styles.row, { width: '100%', marginTop: -15 }]}>
                            <View style={{ flex: 1, alignContent: 'flex-start' }}>
                                <Button mode="outlined"
                                    icon={() =>
                                        <Image source={require('../assets/google_logo.webp')} style={{
                                            height: 20, width: 20
                                        }} />
                                    }
                                    onPress={SignWithGoogle} uppercase={false} customLabelStyle={{ lineHeight: 26, fontSize: 15, color: '#000' }} style={{ width: 150, borderWidth: 0.5, marginTop: 20 }} >
                                    Google
                                </Button>
                            </View>

                            <View style={{ alignContent: 'flex-end', alignSelf: 'flex-end' }}>
                                <Button mode="outlined"
                                    icon={() =>
                                        <Image source={require('../assets/facebook_logo.png')} style={{
                                            height: 22, width: 22
                                        }} />
                                    }
                                    onPress={SignWithFacebook} uppercase={false} customLabelStyle={{ lineHeight: 26, fontSize: 15, color: '#fff' }} style={{ width: 150, borderWidth: 0.5, marginTop: 20, backgroundColor: '#1877F2', borderColor: 'transparent' }} >
                                    Facebook
                                </Button>
                            </View>
                        </View>

                    </SignLayout>
                </KeyboardAwareScrollView>
            )
            }
        </React.Fragment >
    )
}