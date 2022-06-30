import React from 'react';
import { View, Alert } from 'react-native'
import { Appbar, useTheme } from 'react-native-paper';
import { API_URL } from '../core/Constants';
import { passwordValidator } from '../core/Helpers';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';

import TextInput from '../components/TextInput';
import Button from '../components/Button';

function PasswordChangeScreen({ navigation }) {
    const { colors } = useTheme();
    const [changeWait, setChangeWait] = React.useState(false);

    const [currentPassword, setCurrentPassword] = React.useState({ value: '', error: '', show: false });
    const [newPassword, setNewPassword] = React.useState({ value: '', error: '', show: false });
    const [confirmPassowrd, setConfirmPassword] = React.useState({ value: '', error: '', show: false });

    const handlePasswordChange = () => {
        if (!currentPassword.value) {
            setCurrentPassword({ ...currentPassword, error: 'Zorunlu alan' })
        }

        if (!newPassword.value) {
            setNewPassword({ ...newPassword, error: 'Zorunlu alan' })
        }

        if (!confirmPassowrd.value) {
            setConfirmPassword({ ...confirmPassowrd, error: 'Zorunlu alan' })
            return;
        }

        if (!passwordValidator(currentPassword.value)) {
            setCurrentPassword({ ...currentPassword, error: 'Geçerli şifreniz yanlış. Lütfen kontrol edin' });
            return;
        }

        if (!passwordValidator(newPassword.value)) {
            setNewPassword({ ...newPassword, error: 'Şifreniz en az 8 karakter olmalıdır' });
            return;
        }

        if (newPassword.value != confirmPassowrd.value) {
            setConfirmPassword({ ...confirmPassowrd, error: 'Şifreniz eşleşmiyor. Lütfen kontrol edin' });
            return;
        }


        EncryptedStorage.getItem('user_session').then((data) => {
            let sessionJSON = JSON.parse(data);
            setChangeWait(true);

            axios.put(API_URL + '/password', {
                currentPassword: currentPassword.value,
                newPassword: newPassword.value
            }, { headers: { token: sessionJSON.token } }).then((resp) =>{
                setChangeWait(false);
                if(resp.data.status == 'success') {
                    Alert.alert('Bilgi', 'Şifreniz başarıyla değiştirildi!', [
                        { text: "Tamam", onPress: () => { navigation.goBack() }, }
                    ]);
                }
                else if(resp.data.status == 'current-password-wrong') {
                    setCurrentPassword({...currentPassword, error: 'Geçerli şifreniz yanlış. Lütfen kontrol edin'})
                }
                else {
                    Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                        { text: "Tamam", onPress: () => { }, }
                    ]);
                }
            }).catch((error) => {
                setChangeWait(false);
                Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                    { text: "Tamam", onPress: () => { }, }
                ]);
            });
        }).catch((error) => {
            Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                { text: "Tamam", onPress: () => { }, }
            ]);
        });
    }

    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Şifre Değiştir" style={{ justifyContent: 'center', alignItems: 'center' }} />
                <Appbar.Action />
            </Appbar.Header>
            <View style={{ flex: 1, backgroundColor: '#fff', padding: 15 }}>
                <TextInput
                    disabled={changeWait}
                    label='Geçerli Şifre'
                    returnKeyType='next'
                    onChangeText={text => setCurrentPassword({ ...currentPassword, value: text, error: '' })}
                    error={!!currentPassword.error}
                    errorText={currentPassword.error}
                    rightIcon={!changeWait ? (currentPassword.show ? 'eye' : 'eye-off') : null}
                    rightButtonClick={() => setCurrentPassword({ ...currentPassword, show: !currentPassword.show })}
                    secureTextEntry={!currentPassword.show}
                />
                <TextInput
                    disabled={changeWait}
                    label='Yeni Şifre'
                    returnKeyType='next'
                    onChangeText={text => setNewPassword({ ...newPassword, value: text, error: '' })}
                    error={!!newPassword.error}
                    errorText={newPassword.error}
                    rightIcon={!changeWait ? (newPassword.show ? 'eye' : 'eye-off') : null}
                    rightButtonClick={() => setNewPassword({ ...newPassword, show: !newPassword.show })}
                    secureTextEntry={!newPassword.show}
                />
                <TextInput
                    disabled={changeWait}
                    label='Yeni Şifre (Tekrar)'
                    returnKeyType='next'
                    onChangeText={text => setConfirmPassword({ ...confirmPassowrd, value: text, error: '' })}
                    error={!!confirmPassowrd.error}
                    errorText={confirmPassowrd.error}
                    rightIcon={!changeWait ? (confirmPassowrd.show ? 'eye' : 'eye-off') : null}
                    rightButtonClick={() => setConfirmPassword({ ...confirmPassowrd, show: !confirmPassowrd.show })}
                    secureTextEntry={!confirmPassowrd.show}
                />
                <Button mode="contained" loading={changeWait} onPress={changeWait ? null : handlePasswordChange} style={{ backgroundColor: colors.secondary }}>
                    {changeWait ? 'Lütfen bekleyin...' : 'Şifreyi Değiştir'}
                </Button>
            </View>
        </React.Fragment>

    )
}

export default PasswordChangeScreen;