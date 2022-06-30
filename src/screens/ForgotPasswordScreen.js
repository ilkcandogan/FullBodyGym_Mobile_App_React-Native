import React, { useState } from 'react';
import { Text, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
//components
import SignLayout from '../components/SignLayout';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

import { API_URL } from '../core/Constants';
import { emailValidator } from '../core/Helpers';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function ForgotPasswordScreen({ navigation }) {
    const { colors } = useTheme();
    const [form, setForm] = useState({ value: '', error: '', wait: false });

    const handleSendLink = () => {
        if (!form.value) {
            setForm({ ...form, error: 'Zorunlu alan' });
            return;
        }

        if (!emailValidator(form.value.trim())) {
            setForm({ ...form, error: 'Lütfen geçerli bir adres yazın' });
            return;
        }

        setForm({ ...form, wait: true, error: '' });
        axios.post(API_URL + '/password/reset', {
            email: form.value.trim()
        }).then((resp) => {
            setForm({ ...form, wait: false });

            if (resp.data.status === 'success') {
                Alert.alert('Başarılı', 'E-posta adresinize şifre sıfırlama bağlantısı gönderildi.\n\nSPAM kutunuzu kontrol etmeyi unutmayın!', [
                    { text: "Tamam", onPress: () => { navigation.goBack() }, }
                ]);
            }
            else if (resp.data.status === 'email-not-found') {
                setForm({ ...form, error: 'Bu e-posta adresine sahip kullanıcı bulunamadı' });
            }
        }).catch((error) => {
            setForm({ ...form, wait: false });
            Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                { text: "Tamam", onPress: () => { }, }
            ]);
        });
    }

    return (
        <React.Fragment>
            <KeyboardAwareScrollView style={{ backgroundColor: colors.background }}>
                <SignLayout>
                    <Text style={{ fontWeight: 'bold', color: colors.primary, fontSize: 35, marginBottom: 50 }}>FULLBODYGYM</Text>
                    <Text style={{ color: colors.text, textAlign: 'center', fontSize: 15, padding: 4, paddingBottom: 46 }}>E-posta adresinize şifrenizi sıfırlamak için bir bağlantı göndereceğiz</Text>
                    <TextInput
                        disabled={form.wait}
                        label='E-Posta'
                        returnKeyType='done'
                        value={form.value}
                        onChangeText={text => setForm({ value: text, error: '' })}
                        error={!!form.error}
                        errorText={form.error}
                    />
                    <Button mode="contained" onPress={form.wait ? null : handleSendLink} style={{ backgroundColor: colors.primary }} loading={form.wait}>
                        {form.wait ? 'Lütfen bekleyin...' : 'Gönder'}
                    </Button>
                </SignLayout>
            </KeyboardAwareScrollView>
        </React.Fragment>
    )
}