import React, { useState } from 'react';
import { View, Alert } from 'react-native'
import { Appbar, Divider } from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';

import { List } from 'react-native-paper';

function SettingScreen({ navigation }) {
    const [expanded, setExpanded] = useState(false);

    const handleLogout = () => {
        Alert.alert('Uyarı', 'Çıkış yapmak istediğinize emin misiniz?', [
            {
                text: "Evet", onPress: () => {
                    EncryptedStorage.removeItem('user_meta');
                    EncryptedStorage.removeItem('list_favs'); 
                    EncryptedStorage.removeItem('current_user');
                    EncryptedStorage.removeItem('shared_list');
                    EncryptedStorage.removeItem('user_session').finally(() => {
                        navigation.navigate('LoginScreen');
                    })
                }, style: 'default'
            },
            { text: "İptal", style: 'cancel' },
        ]);
    }

    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.Content title="Ayarlar" style={{ justifyContent: 'center', alignItems: 'center' }} />
            </Appbar.Header>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <List.Accordion
                    title="Alt Hesaplar"
                    style={{ padding: 0 }}
                    expanded={expanded}
                    onPress={() => setExpanded(!expanded)}
                    left={props => <List.Icon {...props} icon="account-group" />}
                >
                    <List.Item
                        title="Hesap Değiştir"
                        titleStyle={{ marginLeft: -8 }}
                        onPress={() => navigation.navigate('AccountChangeScreen')}
                    />
                    <List.Item
                        title="Hesap Oluştur"
                        titleStyle={{ marginLeft: -8 }}
                        onPress={() => navigation.navigate('SubAccountCreate')}
                    />
                </List.Accordion>
                <Divider />
                <List.Accordion
                    title="Şifre Değiştir"
                    style={{ padding: 0 }}
                    onPress={() => navigation.navigate('PasswordChangeScreen')}
                    left={props => <List.Icon {...props} icon="key" />} right={() => null} expanded={false}>
                </List.Accordion>
                <Divider />
                <List.Accordion
                    title="Hakkında"
                    style={{ padding: 0 }}
                    onPress={() => navigation.navigate('AboutScreen')}
                    left={props => <List.Icon {...props} icon="information" />} right={() => null} expanded={false}>
                </List.Accordion>
                <Divider />
                <List.Accordion
                    title="Çıkış Yap"
                    style={{ padding: 0 }}
                    titleStyle={{ color: 'red' }}
                    onPress={handleLogout}
                    left={props => <List.Icon {...props} icon="logout" color='red' />} right={() => null} expanded={false}>
                </List.Accordion>
            </View>
        </React.Fragment>
    )
}

export default SettingScreen;