import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTheme, Checkbox } from 'react-native-paper';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import SignLayout from '../components/SignLayout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { passwordValidator, emailValidator } from '../core/Helpers';
import { API_URL } from '../core/Constants';
import axios from 'axios';
import DropDown from "react-native-paper-dropdown";
import Spinner from 'react-native-loading-spinner-overlay';

export default function RegisterScreen({ navigation }) {
    const { colors } = useTheme();
    const [wait, setWait] = useState(false)
    const [spinnerShow, setSpinnerShow] = useState(false);

    const styles = StyleSheet.create({
        agreeCheck: {
            width: '100%',
            alignContent: 'flex-end',
            flexDirection: 'row',
            marginRight: 18,
            marginVertical: 5
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
            color: "#000",
        },
    });

    //#region init
    const [firstname, setFirstname] = useState({ value: '', error: '' });
    const [lastname, setLastname] = useState({ value: '', error: '' });
    const [email, setEmail] = useState({ value: '', error: '' });

    const [gender, setGender] = useState({ value: '', error: '' });
    const [dropdown, setDropdown] = useState(false);
    const genderTypes = [{ label: 'Erkek', value: 1 }, { label: 'Kadın', value: 2 }, { label: 'Erkek Çocuk', value: 3 }, { label: 'Kız Çocuk', value: 4 }];

    const [age, setAge] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '', show: false });


    const [agreeCheck, setAgreeCheck] = useState({ value: false, error: '' });

    const [address, setAddress] = useState({ cities: [], states: [], _wait: true });

    const [city, setCity] = useState({ value: '', error: '' });
    const [cityDropdown, setCityDropdown] = useState(false)

    const [state, setState] = useState({ value: '', error: '' });
    const [stateDropdown, setStateDropdown] = useState(false)
    //#endregion

    useEffect(() => {
        axios.get(API_URL + '/../../../cities').then((resp) => {
            if (resp.data.status === 'success') {
                let tmpCities = [];
                resp.data.cities.map((c) => { tmpCities = [...tmpCities, { label: c.NAME, value: c.ID }] })
                setAddress({ ...address, _wait: false, cities: tmpCities });
            }
        }).catch((error) => {
            Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [{ text: "Tamam", onPress: () => navigation.goBack(), }]);
        });
    }, [])

    useEffect(() => {
        if (city.value !== '') {
            setSpinnerShow(true);

            axios.get(API_URL + '/../../../state/' + city.value).then((resp) => {
                if (resp.data.status === 'success') {
                    let tmpStates = [];
                    resp.data.states.map((s) => { tmpStates = [...tmpStates, { label: s.NAME, value: s.ID }] });
                    setAddress({ ...address, _wait: false, states: tmpStates });
                    setState({ value: tmpStates[0].value, error: '' })
                    setStateDropdown(true)
                }

                setSpinnerShow(false)
            }).catch((error) => {
                Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [{ text: "Tamam", onPress: () => { }, }]);
                setSpinnerShow(false)
            });
        }

    }, [city.value])

    const handleRegister = () => {
        //#region Data Check
        if (!firstname.value) {
            setFirstname({ ...firstname, error: 'Zorunlu alan' })
            return;
        }

        if (!lastname.value) {
            setLastname({ ...lastname, error: 'Zorunlu alan' });
            return;
        }

        if (!email.value) {
            setEmail({ ...email, error: 'Zorunlu alan' })
            return;
        }

        if (!gender.value) {
            setGender({ ...gender, error: 'Zorunlu alan' })
            return;
        }

        if (!age.value) {
            setAge({ ...age, error: 'Zorunlu alan' })
            return;
        }

        if (!city.value) {
            setCity({ ...city, error: 'Zorunlu alan' })
            return;
        }

        if (!state.value) {
            setState({ ...state, error: 'Zorunlu alan' })
            return;
        }

        if (!password.value) {
            setPassword({ ...password, error: 'Zorunlu alan' })
            return;
        }
        //#endregion
        if (firstname.value && lastname.value && email.value && gender.value && city.value && state.value && password.value && password.value) {
            if (!emailValidator(email.value.trim())) {
                setEmail({ ...email, error: 'Lütfen geçerli bir adres yazın' });
                return;
            }
            if (!passwordValidator(password.value)) {
                setPassword({ ...password, error: 'Şifreniz en az 8 karakter olmalıdır' });
                return;
            }

            if (!agreeCheck.value) {
                Alert.alert('Uyarı', 'Lütfen kullanım koşullarını kabul edin', [
                    { text: "Tamam", onPress: () => { }, }
                ]);
                return;
            }

            setWait(true);
            setEmail({ ...email, error: '' });

            axios.post(API_URL + '/register', {
                firstname: firstname.value,
                lastname: lastname.value,
                email: email.value.trim(),
                genderType: gender.value,
                cityId: city.value,
                stateId: state.value,
                age: age.value,
                password: password.value
            }).then((resp) => {

                if (resp.data.status == 'success') {
                    Alert.alert('Başarılı', 'Lütfen e-posta adresinize gönderilen bağlantı ile hesabınızı doğrulayın!\n\nSPAM kutunuzu kontrol etmeyi unutmayın!', [
                        { text: "Tamam", onPress: () => { navigation.goBack() }, }
                    ]);
                }
                else if (resp.data.status == 'email-already') {
                    setEmail({ ...email, error: 'E-posta adresi kullanılmaktadır' })
                }
                else {
                    Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                        { text: "Tamam", onPress: () => { }, }
                    ]);
                }

                setWait(false);
            }).catch((error) => {
                setWait(false);
                Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                    { text: "Tamam", onPress: () => { }, }
                ]);

            });
        }
    }
    return (
        <React.Fragment>
            <Spinner visible={spinnerShow} color={colors.secondary} />
            {address._wait ? (
                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                    <ActivityIndicator size="large" color={colors.secondary} />
                </View>
            ) : (
                <KeyboardAwareScrollView style={{ backgroundColor: colors.background, }}>
                    <SignLayout>
                        <Text style={{ fontWeight: 'bold', color: colors.primary, fontSize: 35, marginBottom: 40, marginTop: -30 }}>FULLBODYGYM</Text>
                        <View style={styles.row}>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <TextInput
                                    disabled={wait}
                                    label='Ad'
                                    returnKeyType='next'
                                    onChangeText={text => setFirstname({ value: text, error: '' })}
                                    error={!!firstname.error}
                                    errorText={firstname.error}
                                    style={{ width: '98%', }}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <TextInput
                                    disabled={wait}
                                    label='Soyad'
                                    returnKeyType='next'
                                    onChangeText={text => setLastname({ value: text, error: '' })}
                                    error={!!lastname.error}
                                    errorText={lastname.error}
                                    style={{ width: '98%', marginLeft: '2%' }}
                                />
                            </View>
                        </View>
                        <TextInput
                            disabled={wait}
                            label='E-Posta'
                            returnKeyType='next'
                            onChangeText={text => setEmail({ value: text, error: '' })}
                            error={!!email.error}
                            errorText={email.error}
                            autoCapitalize='none'
                            autoComplate='email'
                            textContentType='emailAddress'
                            keyboardType='email-address'
                        />

                        <View style={styles.row}>
                            <View style={{ flexDirection: 'column', flex: 1, paddingTop: 4 }}>
                                <DropDown
                                    disabled={wait}
                                    label="Cinsiyet"
                                    mode="outlined"
                                    visible={dropdown}
                                    showDropDown={() => setDropdown(true)}
                                    onDismiss={() => setDropdown(false)}
                                    value={gender.value}
                                    setValue={(e) => setGender({ ...gender, value: e, error: '' })}
                                    list={genderTypes}
                                    error={!!gender.error}
                                />
                                {!!gender.error ? (<Text style={{ color: colors.error, padding: 5 }}>{gender.error}</Text>) : null}
                            </View>
                            <View style={{ flexDirection: 'column', flex: 1, marginLeft: 5 }}>
                                <TextInput
                                    disabled={wait}
                                    label='Yaş'
                                    returnKeyType='next'
                                    keyboardType='numeric'
                                    onChangeText={text => setAge({ value: text, error: '' })}
                                    error={!!age.error}
                                    errorText={age.error}
                                    style={{ width: '98%', marginLeft: '2%' }}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={{ flexDirection: 'column', flex: 1, paddingTop: 4 }}>
                                <DropDown
                                    disabled={wait}
                                    label="Şehir"
                                    mode="outlined"
                                    visible={cityDropdown}
                                    showDropDown={() => setCityDropdown(true)}
                                    onDismiss={() => setCityDropdown(false)}
                                    value={city.value}
                                    setValue={(e) => setCity({ ...city, value: e, error: '' })}
                                    list={address.cities}
                                    error={!!city.error}
                                />
                                {!!city.error ? (<Text style={{ color: colors.error, padding: 5 }}>{city.error}</Text>) : null}
                            </View>
                            <View style={{ flexDirection: 'column', flex: 1, marginLeft: 10, paddingTop: 4 }}>
                                <DropDown
                                    disabled={wait || !city.value}
                                    label="İlçe"
                                    mode="outlined"
                                    visible={stateDropdown}
                                    showDropDown={() => setStateDropdown(true)}
                                    onDismiss={() => setStateDropdown(false)}
                                    value={state.value}
                                    setValue={(e) => setState({ ...state, value: e, error: '' })}
                                    list={address.states}
                                    error={!!state.error}
                                />
                                {!!state.error ? (<Text style={{ color: colors.error, padding: 5 }}>{state.error}</Text>) : null}
                            </View>
                        </View>

                        <TextInput
                            disabled={wait}
                            label='Şifre'
                            returnKeyType='next'
                            onChangeText={text => setPassword({ ...password, value: text, error: '' })}
                            error={!!password.error}
                            errorText={password.error}
                            rightIcon={!wait ? (password.show ? 'eye' : 'eye-off') : null}
                            rightButtonClick={() => setPassword({ ...password, show: !password.show })}
                            secureTextEntry={!password.show}
                            style={{ marginTop: 10 }}
                        />

                        <View style={styles.agreeCheck}>
                            <Checkbox
                                disabled={wait}
                                status={agreeCheck.value ? 'checked' : 'unchecked'}
                                onPress={() => { setAgreeCheck({ value: !agreeCheck.value }) }}
                                color={colors.primary}
                            />
                            <View style={[styles.agreeCheck, { marginTop: 8 }]}>
                                <TouchableOpacity onPress={() => navigation.navigate('TermsScreen')}>
                                    <Text style={styles.link}>Kullanım Koşullarını</Text>
                                </TouchableOpacity>
                                <Text style={{ color: colors.text, marginLeft: 5 }}>Kabul Ediyorum</Text>
                            </View>
                        </View>


                        <Button mode="contained" loading={wait} onPress={wait ? null : handleRegister} style={{ backgroundColor: colors.primary }}>
                            {wait ? 'Lütfen bekleyin...' : 'Kaydol'}
                        </Button>

                    </SignLayout>
                </KeyboardAwareScrollView>
            )}

        </React.Fragment>
    )
}