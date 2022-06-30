import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Image, Share } from 'react-native';
import { Appbar, useTheme, List, ActivityIndicator, } from 'react-native-paper';
import Card from '../components/Card';
import CardProgress from '../components/CardProgress';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { API_URL } from '../core/Constants';
import EncryptedStorage from 'react-native-encrypted-storage';

function LinkListTableScreen({ route, navigation }) {
    const { colors } = useTheme();
    let code = route.params?.code;
    let listName = route.params?.listName;
    const genderTypes = [{ label: 'Erkek', value: 1 }, { label: 'Kadın', value: 2 }, { label: 'Erkek Çocuk', value: 3 }, { label: 'Kız Çocuk', value: 4 }, { label: 'Hepsi', value: 5 }];

    const [list, setList] = useState({ list: {}, variables: [], _wait: true, _error: '' })

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setList({ ...list, _wait: true })
            axios.post(API_URL + '/list/sub/', { code: code }).then((resp) => {
                if (resp.data.status === 'success') {
                    let tmpVariables = [];

                    resp.data.variable.map((item) => {
                        tmpVariables = [
                            ...tmpVariables,
                            {
                                id: item.VARIABLE_ID,
                                title: item.TITLE,
                                default: item.VARIABLE_VALUE,
                                content: item.VARIABLE_VALUE_START,
                                lastUpdated: item.LAST_UPDATED
                            }
                        ]
                    })

                    setList({
                        ...list,
                        list: resp.data.list,
                        variables: tmpVariables,
                        _wait: false
                    })


                }
                else {
                    setList({ ...list, _wait: false, _error: 'Hedef Listesi bulunamadı!' });
                }
            }).catch((error) => {
                setList({ ...list, _wait: false, _error: 'Lütfen internet bağlantınızı kontrol edin!' });
            })


        });

        return unsubscribe;
    }, [navigation])

    const [currentUser, setCurrentUser] = useState(0);
    const [sharedList, setSharedList] = useState([]);

    useEffect(() => {
        EncryptedStorage.getItem('current_user').then((data) => {
            let currentJSON = JSON.parse(data);
            setCurrentUser(currentJSON);

            EncryptedStorage.getItem('shared_list').then((data) => {
                let listJSON = JSON.parse(data);
                if (listJSON) {
                    setSharedList(listJSON.filter(s => s.userId !== currentUser.id && s.code !== code))
                }

            })
        })
    }, [])

    const handleDelete = () => {
        EncryptedStorage.setItem('shared_list', JSON.stringify(sharedList)).then(() => {
            Alert.alert('Bilgi', 'Hedef listesi başarı ile silindi.', [
                { text: "Tamam", onPress: () => { navigation.goBack() }, }
            ]);
        })
    }
    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title='Hedef Listesi' subtitle={listName} style={{ justifyContent: 'center', alignItems: 'center' }} />
                <Appbar.Action icon='delete' onPress={() => {
                    Alert.alert('Uyarı', 'Hedef listesini silmek istediğinize emin misiniz?', [
                        { text: "Evet", onPress: handleDelete },
                        { text: 'İptal', onPress: () => null }
                    ]);
                }} />
            </Appbar.Header>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {list._wait ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: -30 }}>
                        <ActivityIndicator size={35} color={colors.secondary} />
                    </View>
                ) : (
                    list._error ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: -30 }}>
                            <List.Icon icon="file-search-outline" />
                            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{list._error}</Text>
                        </View>
                    ) : (
                        <ScrollView>
                            <Image source={{ uri: `https://fullbodygym.xyz/images/icons/${list.list.CATEGORY_ID}.png` }} style={{ backgroundColor: 'transparent', alignSelf: 'center', marginTop: 20, marginBottom: 20, height: 120, width: 120 }} />

                            <Card title='Liste Bilgileri' defaultOpen={false} data={[{ title: 'Liste Adı', content: list.list.LIST_NAME }, { title: 'Salon Adı', content: list.list.HALL_NAME }, { title: 'Kategori', content: list.list.CATEGORY_NAME }, { title: 'Cinsiyet', content: `${genderTypes.filter(g => g.value === list.list.GENDER)[0].label} için uygun` }]} />
                            <CardProgress title='Hedefler' data={list.variables} measureType={list.list.MEASURE_TYPE} weightType={list.list.WEIGHT_TYPE} />

                        </ScrollView>
                    )
                )}
            </View>
        </React.Fragment>
    )
}
export default LinkListTableScreen;