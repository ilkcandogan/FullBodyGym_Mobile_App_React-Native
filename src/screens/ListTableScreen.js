import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Image, Share } from 'react-native';
import { Appbar, useTheme, List, ActivityIndicator, RadioButton } from 'react-native-paper';
import Card from '../components/Card';
import CardProgress from '../components/CardProgress';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { API_URL, APP_DOMAIN } from '../core/Constants';
import EncryptedStorage from 'react-native-encrypted-storage';

function ListTableScreen({ route, navigation }) {
    const { colors } = useTheme();
    const code = route.params?.code || '';
    const listId = route.params?.listId || '';
    const listCode = route.params?.listCode || '';
    const token = route.params?.token || '';
    const listName = route.params?.listName || '';
    const genderTypes = [{ label: 'Erkek', value: 1 }, { label: 'Kadın', value: 2 }, { label: 'Erkek Çocuk', value: 3 }, { label: 'Kız Çocuk', value: 4 }, { label: 'Hepsi', value: 5 }];

    const [list, setList] = useState({ list: {}, variables: [], _wait: true, _error: '' })
    const [measureType, setMeasureType] = useState(null);
    const [weightType, setWeightType] = useState(null)

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setList({ ...list, _wait: true })
            axios.post(API_URL + '/list/detail', { listCode }, { headers: { token } }).then((resp) => {
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
                    setMeasureType(resp.data.list.MEASURE_TYPE)
                    setWeightType(resp.data.list.WEIGHT_TYPE)
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

    const handleListDelete = () => {
        setList({ ...list, _wait: true });
        axios.delete(API_URL + '/list/' + listId, { headers: { token } }).then((resp) => {
            if (resp.data.status === 'success') {
                //#region Fav Delete
                let tmpData = []
                tmpData = [
                    ...fav.data.filter(item => item.id !== listId)
                ]

                EncryptedStorage.setItem('list_favs', JSON.stringify(tmpData)).then(() => { })
                //#endregion

                Alert.alert('Bilgi', 'Hedef listesi başarı ile silinmiştir!', [
                    { text: "Tamam", onPress: () => navigation.goBack() },
                ]);
            }
            else {
                setList({ ...list, _wait: false, _error: 'Lütfen internet bağlantınızı kontrol edin!' });
            }
        }).catch((error) => {
            setList({ ...list, _wait: false, _error: 'Lütfen internet bağlantınızı kontrol edin!' });
        })
    }

    //#region Fav
    const [fav, setFav] = useState({ data: [], isFavList: false });
    const [currentUser, setCurrentUser] = useState(0);

    useEffect(() => {
        EncryptedStorage.getItem('current_user').then((data) => {
            let currentJSON = JSON.parse(data);
            setCurrentUser(currentJSON);
            console.log("current: ", currentJSON.id);

            EncryptedStorage.getItem('list_favs').then((data) => {
                let favsJSON = JSON.parse(data);
                if (favsJSON) {
                    setFav({ ...fav, data: favsJSON, isFavList: favsJSON.filter(item => item.id === listId && item.userId === currentJSON.id || 0).length })
                }

            })
        })
    }, [])

    const handleFavSet = () => {
        let tmpData = []
        if (fav.isFavList) {
            tmpData = [
                ...fav.data.filter(item => item.id !== listId)
            ]
        }
        else {
            tmpData = [...fav.data, {
                id: listId,
                userId: currentUser.id,
                listName,
                listCode
            }]
        }

        EncryptedStorage.setItem('list_favs', JSON.stringify(tmpData)).then(() => {
            setFav({ ...fav, data: tmpData, isFavList: !fav.isFavList })
            Alert.alert('Bilgi', 'Favori ' + (fav.isFavList ? 'listesinden çıkarıldı.' : 'listesine eklendi.'), [
                { text: "Tamam", onPress: () => { }, }
            ]);
        })
    }
    //#endregion

    const handleChangeMeausreType = (value) => {

    }

    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Action />
                <Appbar.Content title='Hedef Listesi' subtitle={listName} style={{ justifyContent: 'center', alignItems: 'center' }} />
                <Appbar.Action icon='share-variant' onPress={() => { Share.share({ message: `${APP_DOMAIN}/list/${list.list.LIST_SHARE_CODE}` }).finally(() => { }) }} style={{ marginRight: 0, marginLeft: 0 }} />
                <Appbar.Action icon={fav.isFavList ? 'star' : 'star-outline'} onPress={handleFavSet} style={{ marginRight: 0, marginLeft: 0 }} />
                <Appbar.Action icon='delete' onPress={() => {
                    Alert.alert('Uyarı', 'Hedef listesini silmek istediğinize emin misiniz?', [
                        { text: "Evet", onPress: handleListDelete },
                        { text: 'İptal', onPress: () => null }
                    ]);
                }} style={{ marginRight: 0, marginLeft: 0 }} />
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


                            {/* <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginBottom: 20, marginTop: 10}}>
                                <RadioButton.Group onValueChange={newValue => handleChangeMeausreType(newValue)} value={measureType}>
                                    <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                                        <View style={{ flexDirection: 'row', marginRight: 15 }}>
                                            <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 7}}>CM</Text>
                                            <RadioButton value="CM" />
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 7}}>İNÇ</Text>
                                            <RadioButton value="second" />
                                        </View>
                                    </View>
                                </RadioButton.Group>

                                <RadioButton.Group onValueChange={newValue => setWeightType(newValue)} value={weightType}>
                                    <View style={{ flexDirection: 'row', marginRight: 15 }}>
                                        <View style={{ flexDirection: 'row', marginRight: 15 }}>
                                            <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 7}}>KG</Text>
                                            <RadioButton value="KG" />
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 7}}>LBS</Text>
                                            <RadioButton value="LBS" />
                                        </View>
                                    </View>
                                </RadioButton.Group>
                            </View> */}
                        </ScrollView>
                    )
                )}
            </View>
        </React.Fragment>
    )
}

export default ListTableScreen;