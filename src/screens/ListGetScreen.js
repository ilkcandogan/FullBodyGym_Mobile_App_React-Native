import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import axios from 'axios';
import { API_URL } from '../core/Constants';
import EncryptedStorage from 'react-native-encrypted-storage';
import Card from '../components/Card';
import { ScrollView } from 'react-native-gesture-handler';


function ListGetScreen({ route, navigation }) {
    const [userSession, setUserSession] = useState(null);
    const { colors } = useTheme();
    const [search, setSearch] = useState({ value: '', _error: '', _wait: false, listId: 0, listCategoryId: 0, list: {}, variables: [] });
    const genderTypes = [{ label: 'Erkek', value: 1 }, { label: 'Kadın', value: 2 }, { label: 'Erkek Çocuk', value: 3 }, { label: 'Kız Çocuk', value: 4 }, { label: 'Hepsi', value: 5 }];
    const qrCode = route.params?.qrCode || '';

    const styles = StyleSheet.create({
        view: {
            flex: 1,
            backgroundColor: '#fff'
        }
    })

    React.useEffect(() => {
        EncryptedStorage.getItem('user_session').then((data) => {
            let dataJSON = JSON.parse(data);
            setUserSession(dataJSON);

            if (qrCode) {
                handleSearch(qrCode, dataJSON.token);
            }
        })
    }, []);

    const handleSearch = (code = null, token = null) => {
        if (!search.value && code === null) {
            setSearch({ ...search, _error: 'Lütfen boş bırakmayın' })
            return
        }
        setSearch({ ...search, _wait: true });
        axios.get(API_URL + '/list/' + (search.value || code), { headers: { token: userSession?.token || token } }).then((resp) => {
            if (resp.data.status === 'success') {
                let tmpVariables = [];

                resp.data.variable.map((item) => {
                    tmpVariables = [
                        ...tmpVariables,
                        {
                            id: item.VARIABLE_ID,
                            title: item.TITLE,
                            content: item.VARIABLE_VALUE
                        }
                    ]
                })
                setSearch({
                    ...search,
                    _wait: false,
                    listId: resp.data.list.LIST_ID,
                    listCategoryId: resp.data.list.CATEGORY_ID,
                    list: resp.data.list,
                    variables: tmpVariables
                });

            }
            else if (resp.data.status === 'already-use-list') {
                setSearch({ ...search, value: (search.value || code), _error: 'Bu hedef listesini zaten kullanıyorsunuz!', _wait: false })
            }
            else {
                setSearch({ ...search, value: (search.value || code), _error: 'Geçersiz liste kodu!', _wait: false })
            }
        }).catch((error) => {
            setSearch({ ...search, _wait: false });
            Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                { text: "Tamam", onPress: () => { }, }
            ]);
        })
    }

    const [formWait, setFormWait] = useState(false);

    const handleSave = () => {
        setFormWait(true);

        axios.post(API_URL + '/list/save', {
            listId: search.listId
        }, { headers: { token: userSession.token} }).then((resp) => {
            if (resp.data.status == 'success') {
                Alert.alert('Uyarı', 'Hedef listesi başarı ile kaydedildi!', [
                    { text: "Tamam", onPress: () => { navigation.goBack() }, }
                ]);
            }
            else if(resp.data.status === 'list-used') {
                Alert.alert('Uyarı', 'Bu hedef listesini zaten kayıtlı', [
                    { text: "Tamam", onPress: () => { }, }
                ]);
            }
        }).catch((error) => {
            Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                { text: "Tamam", onPress: () => { }, }
            ]);
        }).finally(() => {
            setFormWait(false);
        })
    }

    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Hedef Listesi" style={{ justifyContent: 'center', alignItems: 'center' }} />
                <Appbar.Action />
            </Appbar.Header>
            <View style={styles.view}>
                {search.listId ? (
                    <ScrollView>
                        <Image source={{ uri: `https://fullbodygym.xyz/images/icons/${search.listCategoryId}.png` }} style={{ backgroundColor: 'transparent', alignSelf: 'center', marginTop: 20, marginBottom: 20, height: 120, width: 120 }} />

                        <Card title='Liste Bilgileri' data={[{ title: 'Liste Adı', content: search.list.LIST_NAME }, { title: 'Salon Adı', content: search.list.HALL_NAME }, { title: 'Kategori', content: search.list.CATEGORY_NAME }, { title: 'Cinsiyet', content: `${genderTypes.filter(g => g.value === search.list.GENDER)[0].label} için uygun` }]} />
                        <Card title='Hedefler' data={search.variables} />
                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                            <Button mode="contained" onPress={formWait ? null : handleSave} style={{ backgroundColor: colors.secondary }}>
                                {formWait ? 'Lütfen bekleyin...' : 'Listeyi Kaydet'}
                            </Button>
                        </View>
                    </ScrollView>
                ) : (
                    <View style={{ padding: 15 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput
                                disabled={search._wait}
                                label='Liste Kodu'
                                returnKeyType='next'
                                value={search.value}
                                onChangeText={text => setSearch({ value: text, error: '' })}
                                error={!!search._error}
                                errorText={search._error}
                                style={{ width: '98%', }}
                            />
                        </View>
                        <Button mode="contained" loading={search._wait} onPress={search._wait ? null : handleSearch} style={{ backgroundColor: colors.secondary }}>
                            {search._wait ? 'Lütfen bekleyin...' : 'Ara'}
                        </Button>
                    </View>
                )}
            </View>
        </React.Fragment>
    )
}

export default ListGetScreen;