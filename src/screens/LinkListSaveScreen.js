import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Image, Share } from 'react-native';
import { Appbar, useTheme, List, ActivityIndicator, } from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';

import TextInput from '../components/TextInput';
import Button from '../components/Button';

function LinkListSaveScreen({ route, navigation }) {
    const { colors } = useTheme();

    const code = route.params?.code || '';
    const listId = route.params?.listId || '';
    const listCode = route.params?.listCode || '';
    const listName = route.params?.listName || '';

    const [currentUser, setCurrentUser] = useState(0);
    useEffect(() => {
        EncryptedStorage.getItem('current_user').then((data) => {
            let currentJSON = JSON.parse(data);
            setCurrentUser(currentJSON);
            console.log("current: ", currentJSON.id);
        })
    }, [])

    const [name, setName] = useState({ value: '', error: '' })
    const handleSave = () => {
        EncryptedStorage.getItem('shared_list').then((data) => {
            let sharedJSON = JSON.parse(data);
            let tmp = {
                code,
                listId,
                listCode,
                listName,
                customName: name.value,
                userId: currentUser.id,
            }

            if(sharedJSON) {
                sharedJSON = [tmp, ...sharedJSON];
            }
            else {
                sharedJSON = [tmp];
            }
            
            EncryptedStorage.setItem('shared_list', JSON.stringify(sharedJSON)).then(() => {
                Alert.alert('Bilgi', 'Hedef listesi başarı ile kayıt edildi.', [
                    { text: "Tamam", onPress: () => { navigation.navigate('HomeScreen') }, }
                ])
            })
        })
    }

    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title='Listeyi Adlandır' style={{ justifyContent: 'center', alignItems: 'center' }} />
                <Appbar.Action />
            </Appbar.Header>
            <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15, backgroundColor: '#fff', paddingTop: 15 }}>
                <TextInput
                    label='Liste adı (Opsiyonel)'
                    returnKeyType='done'
                    value={name.value}
                    onChangeText={text => setName({ value: text, error: '' })}
                    error={!!name.error}
                    errorText={name.error}
                />
                <Button mode="contained" onPress={handleSave} style={{ backgroundColor: colors.secondary }}>
                    Listeyi Kaydet
                </Button>

                <Text style={{ color: 'gray', textAlign: 'center', fontSize: 15, padding: 0, paddingBottom: 15, paddingTop: 15 }}>
                    Hedef listesini daha sonra hatırlayabilmek için bir takma ad verebilirsiniz
                </Text>
            </View>
        </React.Fragment>
    )
}

export default LinkListSaveScreen