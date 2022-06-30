import React, { useState, useEffect } from 'react';
import { View, Text, BackHandler, Linking } from 'react-native';
import { Appbar, useTheme, FAB, List, ActivityIndicator, IconButton } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import { API_URL } from '../core/Constants';
import ListItem from '../components/ListItem';
import SelectionModal from '../components/SelectionModal';

function HomeScreen({ navigation }) {
    //EncryptedStorage.removeItem('shared_list');
    const [userSession, setUserSession] = useState(null);
    const { colors } = useTheme();
    const [list, setList] = useState({ data: [], _wait: true, _error: '' });
    const [modalOpen, setModalOpen] = useState(false);
    const [code, setCode] = useState(null);
    const [currentUser, setCurrentUser] = useState(0);
    const [sharedList, setSharedList] = useState([]);

    //#region BackButton Disable
    const isFocused = useIsFocused();
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => isFocused)
        return () => backHandler.remove()
    })
    //#endregion

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            EncryptedStorage.getItem('current_user').then((data) => {
                let currentJSON = JSON.parse(data);
                setCurrentUser(currentJSON);
            })

            if (!userSession) {
                EncryptedStorage.getItem('user_session').then((data) => {
                    let dataJSON = JSON.parse(data);
                    setUserSession(dataJSON)
                    getList(dataJSON.token)
                })
            }
            else {
                getList();
            }
        });
        return unsubscribe;
    }, [navigation])

    const getList = (token = null) => {
        setList({ ...list, _wait: true, _error: '' })
        axios.get(API_URL + '/list/all', { headers: { token: token ? token : userSession.token } }).then((resp) => {
            if (resp.data.status === 'success') {
                //burada okuma yapacal
                EncryptedStorage.getItem('current_user').then((data) => {
                    let currentJSON = JSON.parse(data);

                    EncryptedStorage.getItem('shared_list').then((data) => {
                        let sharedJSON = JSON.parse(data);
                        let tmpSharedList = [];

                        if (sharedJSON) {
                            tmpSharedList = sharedJSON.filter(s => s.userId === currentJSON.id)
                            setList({ ...list, _wait: false, data: [...resp.data.lists, ...tmpSharedList], _error: '' })
                        }
                    })

                })

                setList({ ...list, _wait: false, data: resp.data.lists, _error: '' })
            }
        }).catch((error) => {
            setList({ ...list, _wait: false, _error: 'Lütfen internet bağlantınızı kontrol edin!' })
        })
    }

    //#region Deep Link
    useEffect(() => {
        Linking.addEventListener('url', event => {
            deepLinkParse(event.url)
        })
        return () => { }
    });

    useEffect(() => {
        Linking.getInitialURL().then(url => {
            deepLinkParse(url)
        });
    }, [])

    const deepLinkParse = (url) => {
        if (url) {
            let _code = url.split('/')[4];
            if (_code !== code) {
                setCode(_code)
                navigation.navigate('LinkListGetScreen', { code: _code });
            }
        }
    }
    //#endregion

    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.Content title="Hedef Listelerim" style={{ justifyContent: 'center', alignItems: 'center' }} titleStyle={{ fontSize: 20 }} />
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
                        list.data.length ? (
                            <React.Fragment>
                                <ScrollView style={{ marginTop: 15 }}>
                                    {list.data.map((item, index) => {
                                        return (
                                            <ListItem key={index} data={item} onPress={() => {
                                                if (item?.code) {
                                                    navigation.navigate('LinkListTableScreen', { listName: item.LIST_NAME, code: item.code })
                                                }
                                                else {
                                                    navigation.navigate('ListTableScreen', { listId: item.LIST_ID, token: userSession.token, listName: item.LIST_NAME, listCode: item.LIST_CODE })
                                                }
                                            }
                                            } />
                                        )
                                    })}
                                </ScrollView>
                                <FAB
                                    style={{ position: 'absolute', margin: 30, right: 0, bottom: 0, backgroundColor: colors.secondary }}
                                    icon="plus"
                                    color='#fff'
                                    onPress={() => setModalOpen(true)}
                                />
                                <SelectionModal open={modalOpen} onDismiss={() => setModalOpen(false)} nav={navigation} />
                            </React.Fragment>
                        ) : (
                            <NewListAdd nav={navigation} />
                        )
                    )
                )}
            </View>
        </React.Fragment>
    )
}

function NewListAdd({ nav }) {
    const { colors } = useTheme();
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity activeOpacity={0.3} onPress={() => setModalOpen(!modalOpen)} style={{ alignItems: 'center' }}>
                <IconButton icon="plus-circle" color={colors.secondary} size={40} onPress={null} style={{ margin: -5 }} />
                <Text style={{ color: colors.text, fontSize: 17 }}>Hedef Listesi Ekle</Text>
            </TouchableOpacity>

            <SelectionModal open={modalOpen} onDismiss={() => setModalOpen(false)} nav={nav} />
        </View>
    )
}

export default HomeScreen;