import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityIndicator, useTheme, Avatar, Snackbar } from 'react-native-paper';
import { API_URL } from '../core/Constants';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';

import TextInput from '../components/TextInput';
import Button from '../components/Button';
import DropDown from "react-native-paper-dropdown";
import { ScrollView } from 'react-native-gesture-handler';

function AccountTab() {
    const { colors } = useTheme();

    const [userSession, setUserSession] = useState(null);

    //#region States
    const [wait, setWait] = useState(false)
    const [name, setName] = useState({ value: '', error: '' });
    const [surname, setSurname] = useState({ value: '', error: '' });
    const [email, setEmail] = useState({ value: '', error: '' });

    const [profileWait, setProfileWait] = useState({ getWait: true, updateWait: false });
    const [snackbarShow, setSnackbarShow] = useState(false)

    const [gender, setGender] = useState({ value: '', error: '' });
    const [dropdown, setDropdown] = useState(false);
    const genderTypes = [{ label: 'Erkek', value: 1 }, { label: 'Kadın', value: 2 }, { label: 'Erkek Çocuk', value: 3 }, { label: 'Kız Çocuk', value: 4 }];

    const [age, setAge] = useState({ value: '', error: '' });

    const [address, setAddress] = useState({ cities: [], states: [], _wait: true });

    const [city, setCity] = useState({ value: '', error: '' });
    const [cityDropdown, setCityDropdown] = useState(false)

    const [state, setState] = useState({ value: '', error: '' });
    const [stateDropdown, setStateDropdown] = useState(false)
    //#endregion


    useEffect(() => {
        EncryptedStorage.getItem('user_session').then((data) => {
            let dataJSON = JSON.parse(data);
            setUserSession(dataJSON);
            
            axios.get(API_URL + '/profile', { headers: { token: dataJSON.token } }).then((resp) => {
                if (resp.data.status == 'success') {
                    let profile = resp.data.profile;

                    setName({ ...name, value: profile.FIRSTNAME });
                    setSurname({ ...surname, value: profile.LASTNAME });
                    setEmail({ ...email, value: profile.EMAIL });
                    setGender({ ...gender, value: profile.GENDER })
                    setAge({ ...age, value: profile.AGE })

                    let tmpCities = [];
                    resp.data.cities.map((c) => { tmpCities = [...tmpCities, { label: c.NAME, value: c.ID }] })
                    let tmpStates = [];
                    resp.data.states.map((s) => { tmpStates = [...tmpStates, { label: s.NAME, value: s.ID }] });

                    setAddress({ ...address, cities: tmpCities, states: tmpStates });
                    setState({ value: profile.STATE_ID, error: '' });
                    setCity({ value: profile.CITY_ID, _error: '' })

                    setProfileWait({ getWait: false, updateWait: false });
                }
                else {
                    navigation.goBack();
                }
            }).catch((error) => {
                Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                    { text: "Tamam", onPress: () => { navigation.goBack() }, }
                ]);
            })
        }).catch((error) => {
            Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                { text: "Tamam", onPress: () => { }, }
            ]);
        })
    }, []);

    useEffect(() => {
        if (city.value !== '' && !profileWait.getWait) {

            axios.get(API_URL + '/../../../state/' + city.value).then((resp) => {
                if (resp.data.status === 'success') {
                    let tmpStates = [];
                    resp.data.states.map((s) => { tmpStates = [...tmpStates, { label: s.NAME, value: s.ID }] });
                    setAddress({ ...address, _wait: false, states: tmpStates });
                    setState({ value: tmpStates[0].value, error: '' })
                    setStateDropdown(true)
                }

            }).catch((error) => {
                Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [{ text: "Tamam", onPress: () => { }, }]);
            });
        }

    }, [city.value])

    const handleUpdate = () => {
        if (!name.value) {
            setName({ ...name, error: 'Zorunlu alan' })
        }
        if (!surname.value) {
            setSurname({ ...surname, error: 'Zorunlu alan' })
        }
        if (!age.value) {
            setAge({ ...age, error: 'Zorunlu alan' })
        }
        if (!city.value) {
            setCity({ ...city, error: 'Zorunlu alan' })
        }

        if (!state.value) {
            setState({ ...state, error: 'Zorunlu alan' })
        }

        if (name.value && surname.value && age.value && city.value && state.value) {
            setProfileWait({ updateWait: true });

            axios.put(API_URL + '/profile', {
                newFirstname: name.value,
                newLastname: surname.value,
                newGender: gender.value,
                newCityId: city.value,
                newStateId: state.value,
                newAge: age.value
            }, { headers: { token: userSession.token } }).then((resp) => {
                setProfileWait({ updateWait: false });
                if (resp.data.status == 'success') {
                    setSnackbarShow(true);
                }
                else {
                    Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                        { text: "Tamam", onPress: () => { }, }
                    ]);
                }
            }).catch((error) => {
                setProfileWait({ updateWait: false });
                Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                    { text: "Tamam", onPress: () => { }, }
                ]);
            })
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {profileWait.getWait ? (
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    <ActivityIndicator animating={true} color={colors.secondary} size={35} />
                </View>
            ) : (
                <ScrollView >
                    <View style={{ padding: 15 }}>
                        <Avatar.Image size={150} source={{ uri: `https://fullbodygym.xyz/coach/img/gender/${gender.value}.png` }} color='#fff' style={{ backgroundColor: '#7485e8', alignSelf: 'center', marginTop: 10, marginBottom: 25 }} />
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <TextInput
                                    disabled={profileWait.updateWait}
                                    label='Ad'
                                    returnKeyType='next'
                                    value={name.value}
                                    onChangeText={text => setName({ value: text, error: '' })}
                                    error={!!name.error}
                                    errorText={name.error}
                                    style={{ width: '98%', }}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <TextInput
                                    disabled={profileWait.updateWait}
                                    label='Soyad'
                                    returnKeyType='next'
                                    value={surname.value}
                                    onChangeText={text => setSurname({ value: text, error: '' })}
                                    error={!!surname.error}
                                    errorText={surname.error}
                                    style={{ width: '98%', marginLeft: '2%' }}
                                />
                            </View>
                        </View>
                        <TextInput
                            disabled={true}
                            label='E-Posta'
                            returnKeyType='next'
                            value={email.value}
                            onChangeText={text => setEmail({ value: text, error: '' })}
                            error={!!email.error}
                            errorText={email.error}
                            autoCapitalize='none'
                            autoComplate='email'
                            textContentType='emailAddress'
                            keyboardType='email-address'
                        />
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column', flex: 1, paddingTop: 4 }}>
                                <DropDown
                                    disabled={profileWait.updateWait}
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
                                    disabled={profileWait.updateWait}
                                    label='Yaş'
                                    returnKeyType='next'
                                    value={age.value}
                                    keyboardType='numeric'
                                    onChangeText={text => setAge({ value: text, error: '' })}
                                    error={!!age.error}
                                    errorText={age.error}
                                    style={{ width: '98%', marginLeft: '2%' }}
                                />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 10 }}>
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

                        <Button mode="contained" loading={profileWait.updateWait} onPress={profileWait.updateWait ? null : handleUpdate} style={{ backgroundColor: colors.secondary}}>
                            {profileWait.updateWait ? 'Lütfen bekleyin...' : 'Güncelle'}
                        </Button>
                    </View>
                </ScrollView>
            )}
            <Snackbar visible={snackbarShow} duration={1500} style={{ backgroundColor: '#34A853' }} onDismiss={() => setSnackbarShow(false)}> Profil bilgileriniz güncellendi </Snackbar>
        </View>
    )
}

export default AccountTab;