import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, BackHandler, Alert, StyleSheet, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
//components
import SignLayout from '../components/SignLayout';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

import { API_URL } from '../core/Constants';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EncryptedStorage from 'react-native-encrypted-storage';

function BodySizeTab() {
    const icons = {
        "1": require("../assets/icons/1.jpg"),
        "2": require("../assets/icons/2.jpg"),
        "3": require("../assets/icons/3.jpg"),
        "4": require("../assets/icons/4.jpg"),
        "5": require("../assets/icons/5.jpg"),
        "6": require("../assets/icons/6.jpg"),
        "7": require("../assets/icons/7.jpg"),
        "8": require("../assets/icons/8.jpg"),
        "9": require("../assets/icons/9.jpg"),
        "10": require("../assets/icons/10.jpg"),
        "11": require("../assets/icons/11.jpg"),
        "12": require("../assets/icons/12.jpg"),
        "13": require("../assets/icons/13.jpg"),
        "14": require("../assets/icons/14.jpg"),
        "15": require("../assets/icons/15.jpg"),
        "16": require("../assets/icons/16.jpg"),
        "17": require("../assets/icons/17.jpg"),
        "18": require("../assets/icons/18.jpg"),
        "19": require("../assets/icons/19.jpg"),
        "20": require("../assets/icons/20.jpg"),
        "21": require("../assets/icons/21.jpg"),
        "22": require("../assets/icons/22.jpg"),
        "23": require("../assets/icons/23.jpg"),
    }
    const [userSession, setUserSession] = useState(null);

    const { colors } = useTheme();
    const [variables, setVariables] = useState({ data: [], _wait: true })

    const [form, setForm] = useState({ variables: [], _wait: false, _error: '' });

    useEffect(() => {
        EncryptedStorage.getItem('user_session').then((data) => {
            let dataJSON = JSON.parse(data);
            setUserSession(dataJSON);

            axios.get(API_URL + '/profile/sizes', { headers: { token: dataJSON.token } }).then((resp) => {
                let tmpSizes = [];
                resp.data.variables.map((v, index) => {
                    tmpSizes[index] = { id: v.VARIABLE_ID, value: v.VARIABLE_VALUE_START }
                })
                setForm({ ...form, variables: tmpSizes });
                setVariables({ ...variables, data: resp.data.variables, _wait: false })
            }).catch((error) => {
                Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                    { text: "Tamam", onPress: () => { }, }
                ]);
            })

        }).catch((error) => {
            Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                { text: "Tamam", onPress: () => { }, }
            ]);
        })

    }, []);

    const styles = StyleSheet.create({
        indicator: { flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
        appName: { fontWeight: 'bold', color: colors.primary, fontSize: 35, marginBottom: 10 },
        descriptionText: { color: colors.text, textAlign: 'center', fontSize: 15, padding: 4, paddingBottom: 20 },
        row: { flexDirection: 'row', marginTop: 4 },
        dateText: {
            textAlign: 'center',
            fontWeight: 'bold',
            marginTop: 10
        }
    })

    const toFix = (e) => {
        let numArr = e.split('.');

        if (numArr[1] || false) {
            if (numArr[1].length >= 2) {
                return Number(numArr[0]).toString() + '.' + numArr[1][0] + numArr[1][1]
            }
            else return Number(e).toString()

        }
        else return Number(e).toString()
    }

    const handleUpdate = () => {
        let error;

        //#region Control
        if (form.variables.length === variables.data.length) {
            form.variables.map((item) => {
                if (item !== undefined) {
                    if (!item.value) {
                        error = true;
                    }
                }
                else {
                    error = true;
                }
            });
        }
        else {
            error = true;
        }
        //#endregion

        if (!error) {
            setForm({ ...form, _wait: true });

            axios.put(API_URL + '/profile/sizes', {
                variables: form.variables
            }, { headers: { token: userSession.token } }).then((resp) => {
                if (resp.data.status === 'success') {
                    Alert.alert('Bilgi', 'Beden ölçüleriniz başarı ile kaydedildi!', [
                        { text: "Tamam", onPress: () => {}, }
                    ]);
                }
                else {
                    Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                        { text: "Tamam", onPress: () => { }, }
                    ]);
                }
            }).catch((error) => {
                Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                    { text: "Tamam", onPress: () => { }, }
                ]);
            }).finally(() => {
                setForm({ ...form, _wait: false });
            })
        }
        else {
            Alert.alert('Uyarı', 'Lütfen beden ölçülerinizi boş bırakmayın', [
                { text: "Tamam", onPress: () => { }, }
            ]);
        }
    }
    return (
        <React.Fragment>
            {variables._wait ? (
                <View style={styles.indicator}>
                    <ActivityIndicator size="large" color={colors.secondary} />
                </View>
            ) : (
                <KeyboardAwareScrollView style={{ backgroundColor: colors.background }}>
                    <View style={{ paddingLeft: 15, paddingRight: 15, marginBottom: 30, marginTop: 20 }}>
                        {variables.data.map((item, index) => {
                            return (
                                <View style={styles.row} key={index}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Image source={icons[index + 1]} style={{ height: 58, width: 58, marginRight: 15, marginTop: 9 }} resizeMode="contain" />
                                    </View>
                                    <View style={{ flexDirection: 'column', flex: 1 }}>
                                        <TextInput
                                            id={index}
                                            disabled={form._wait}
                                            label={item.TITLE}
                                            returnKeyType='next'
                                            keyboardType='numeric'
                                            value={form.variables[index]?.value}
                                            onChangeText={(text) => {
                                                let tmpAllVariables = form.variables;
                                                tmpAllVariables[index] = {
                                                    id: item.VARIABLE_ID,
                                                    value: toFix(text)
                                                }
                                                setForm({ ...form, variables: tmpAllVariables })
                                            }}
                                        />
                                    </View>
                                </View>
                            )
                        })}
                        
                        <Button mode="contained" onPress={form._wait ? null : handleUpdate} style={{ backgroundColor: colors.secondary, marginTop: 15 }}>
                            {form._wait ? 'Lütfen Bekleyin...' : 'Güncelle'}
                        </Button>
                        <Text style={styles.dateText}>{variables.data[0].LAST_UPDATED ? variables.data[0].LAST_UPDATED + ' tarihinde güncellediniz.': ''}</Text>
                    </View>

                </KeyboardAwareScrollView>
            )}

        </React.Fragment>
    )
}

export default BodySizeTab;