import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Appbar, useTheme, List, ActivityIndicator } from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import { ScrollView } from 'react-native-gesture-handler';
import ListItem from '../components/ListItem';

function FavScreen({ navigation }) {
    const [userSession, setUserSession] = useState(null);
    const { colors } = useTheme();

    const [favs, setFavs] = useState({ data: [], _wait: true, _error: '' });

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (!userSession) {
                EncryptedStorage.getItem('user_session').then((data) => {
                    let dataJSON = JSON.parse(data);
                    setUserSession(dataJSON)
                })
            }

            setFavs({ ...favs, _wait: true })
            EncryptedStorage.getItem('current_user').then((data) => {
                let currentJSON = JSON.parse(data);

                EncryptedStorage.getItem('list_favs').then((data) => {
                    let favsJSON = JSON.parse(data);

                    if (favsJSON) {
                        setFavs({ ...favs, data: favsJSON.filter(f => f.userId === currentJSON.id), _wait: false })
                    }
                    else {
                        setFavs({ ...favs, _wait: false });
                    }
                }).catch(() => {
                    setFavs({ ...favs, _wait: false });
                })
            })
        });

        return unsubscribe;
    }, [navigation])

    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.Content title="Favorilerim" style={{ justifyContent: 'center', alignItems: 'center' }} titleStyle={{ fontSize: 20 }} />
            </Appbar.Header>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {favs._wait ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: -30 }}>
                        <ActivityIndicator size={35} color={colors.secondary} />
                    </View>
                ) : (
                    favs.data.length ? (
                        <React.Fragment>
                            <ScrollView style={{ marginTop: 15 }}>
                                {favs.data.map((item, index) => {
                                    return (
                                        <ListItem key={index} data={item} onPress={() => navigation.navigate('ListTableScreen', { listId: item.id, token: userSession.token, listName: item.listName, listCode: item.listCode })} />
                                    )
                                })}
                            </ScrollView>
                        </React.Fragment>
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: -30 }}>
                            <List.Icon icon="file-search-outline" />
                            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Henüz favori listesiniz boş</Text>
                        </View>
                    )
                )}
            </View>
        </React.Fragment>
    )
}

export default FavScreen;