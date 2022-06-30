import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { Appbar, useTheme, Divider, Checkbox } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../core/Constants';
import EncryptedStorage from 'react-native-encrypted-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { List } from 'react-native-paper';
import Button from '../components/Button';

function AccountChangeScreen({ navigation }) {
    const [userSession, setUserSession] = useState(null);
    const { colors } = useTheme();

    const [account, setAccount] = useState({ list: [], currentUserId: 0, _wait: true, _deleteWait: false, deleteOpen: false });
    const [deleted, setDeleted] = useState([])
    useEffect(() => {
        EncryptedStorage.getItem('user_session').then((data) => {
            let dataJSON = JSON.parse(data);
            setUserSession(dataJSON);

            EncryptedStorage.getItem('current_user').then((data) => {
                let currentJSON = JSON.parse(data);

                axios.get(API_URL + '/profile/sub/accounts', { headers: { token: dataJSON.token } }).then((resp) => {
                    setAccount({ ...account, list: resp.data.accounts, currentUserId: currentJSON?.id, _wait: false });
                }).catch((error) => {
                    setAccount({ ...account, _wait: false })
                    Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                        { text: "Tamam", onPress: () => { }, }
                    ]);
                })
            })
        })
    }, []);

    const handleAccountChange = (id, token) => {
        EncryptedStorage.setItem('current_user', JSON.stringify({ id })).then(() => {
            EncryptedStorage.setItem('user_session', JSON.stringify({ token })).then(() => {
                navigation.navigate('HomeScreen')
            })
        })
    }

    const handleDelete = () => {
        let ids = deleted.filter(id => id !== undefined && id !== null);

        if (ids.length) {
            setAccount({ ...account, _deleteWait: true });
            axios.post(API_URL + '/profile/sub/delete', {
                ids
            }, { headers: { token: userSession.token } }).then((resp) => {
                setAccount({ ...account, list: account.list.filter(item => !ids.includes(item.userId)), _deleteWait: false, deleteOpen: false })
            }).catch(() => {
                setAccount({ ...account, _deleteWait: false })
                Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                    { text: "Tamam", onPress: () => { }, }
                ]);
            })
        }
        else {
            Alert.alert('Uyarı', 'Lütfen hesap seçin!', [
                { text: "Tamam", onPress: () => { }, }
            ]);
        }
    }
    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Hesap Değiştir" style={{ justifyContent: 'center', alignItems: 'center' }} />
                <Appbar.Action icon={account.deleteOpen ? 'close' : 'delete'} onPress={() => {
                    setDeleted([]);
                    setAccount({ ...account, deleteOpen: !account.deleteOpen })
                }} />
            </Appbar.Header>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {account._wait ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                        <ActivityIndicator size="large" color={colors.secondary} />
                    </View>
                ) : (
                    <ScrollView>
                        {account.list.map((item, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <List.Item
                                        title={`${item.firstname} ${item.lastname}`}
                                        onPress={account.deleteOpen ? null : () => handleAccountChange(item.userId, item.token)}
                                        left={account.deleteOpen ? (
                                            props => <Checkbox key={index}
                                                status={deleted[index] === item.userId ? 'checked' : 'unchecked'}
                                                onPress={() => { let tmp = deleted; if (tmp[index] === item.userId) { tmp[index] = null } else { tmp[index] = item.userId } setDeleted([...tmp]) }}
                                                color={colors.secondary}
                                                disabled={item.main || account.currentUserId === item.userId}
                                            />
                                        ) : props => <List.Icon {...props} icon="account" />}
                                        right={account.currentUserId === item.userId || (item.main && account.currentUserId === 0) ? (props) => <List.Icon {...props} color={colors.secondary} icon="check" /> : null}
                                        expanded={false}
                                    >
                                    </List.Item>
                                    <Divider />
                                </React.Fragment>
                            )
                        })}
                        {account.deleteOpen ? (
                            <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                                <Button mode="contained" onPress={account._deleteWait ? null : handleDelete} style={{ backgroundColor: colors.secondary }}>
                                    {account._deleteWait ? 'Lütfen bekleyin...' : 'Hesapları Sil'}
                                </Button>
                            </View>
                        ) : null}
                    </ScrollView>
                )}
            </View>
        </React.Fragment>
    )
}

export default AccountChangeScreen;