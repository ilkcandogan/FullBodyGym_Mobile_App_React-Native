import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native'
import { Appbar, ActivityIndicator, useTheme } from 'react-native-paper';
import HTMLView from 'react-native-htmlview';
import { API_URL } from '../core/Constants';
import axios from 'axios';


function PrivacyScreen({ navigation }) {
    const { colors } = useTheme();
    const [privacy, setPrivacy] = useState({ content: '', wait: true });

    useEffect(() => {
        axios.get(API_URL + '/privacy').then((resp) => {
            if (resp.data.status == 'success') {
                setPrivacy({ ...privacy, content: resp.data.content, wait: false })
            }
            else {
                setPrivacy({ ...privacy, wait: false });
            }
        }).catch((error) => {
            setPrivacy({ ...privacy, wait: false });
            Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                { text: "Tamam", onPress: () => { navigation.goBack() }, }
            ]);
        });
    }, []);

    const styles = StyleSheet.create({
        p: {
            //marginTop: -20,
            textAlign: 'justify'
        }
    });

    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Gizlilik Politikası" style={{ justifyContent: 'center', alignItems: 'center' }} />
                <Appbar.Action />
            </Appbar.Header>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {privacy.wait ? (
                    <View style={{ justifyContent: 'center', flex: 1, }}>
                        <ActivityIndicator animating={true} color={colors.secondary} size={35} />
                    </View>
                ) : (
                    <ScrollView style={{ backgroundColor: '#fff', margin: 8 }}>
                        <HTMLView
                            value={privacy.content}
                            stylesheet={styles}
                        />
                    </ScrollView>
                )}
            </View>
        </React.Fragment>

    )

}

export default PrivacyScreen;