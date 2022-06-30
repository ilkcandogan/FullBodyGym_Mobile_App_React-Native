import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert,ScrollView } from 'react-native'
import { Appbar, ActivityIndicator, useTheme, List, Divider } from 'react-native-paper';
import HTMLView from 'react-native-htmlview';
import { API_URL } from '../core/Constants';
import axios from 'axios';


function TermsScreen({ navigation }) {
    const { colors } = useTheme();
    const [terms, setTerms] = useState({ content: '', wait: true });

    useEffect(() => {
        axios.get(API_URL + '/terms').then((resp) => {
            if (resp.data.status == 'success') {
                setTerms({ ...terms, content: resp.data.content, wait: false })
            }
            else {
                setTerms({ ...terms, wait: false });
            }
        }).catch((error) => {
            setTerms({ ...terms, wait: false });
            Alert.alert('Uyarı', 'Bilinmeyen bir sorun oluştu. Lütfen tekrar deneyin!', [
                { text: "Tamam", onPress: () => { navigation.goBack() }, }
            ]);
        });
    }, []);

    const styles = StyleSheet.create({
        p: {
            marginTop: -20,
            textAlign: 'justify'
        }
      });

    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Kullanım Koşulları" style={{ justifyContent: 'center', alignItems: 'center' }} />
                <Appbar.Action />
            </Appbar.Header>
            <View style={{ flex: 1, backgroundColor: '#fff'}}>
                {terms.wait ? (
                    <View style={{ justifyContent: 'center', flex: 1, }}>
                        <ActivityIndicator animating={true} color={colors.secondary} size={35} />
                    </View>
                ) : (
                    <ScrollView style={{backgroundColor: '#fff',  margin: 8}}>
                        <HTMLView
                            value={terms.content}
                            stylesheet={styles}
                        />
                    </ScrollView>
                )}
            </View>
        </React.Fragment>

    )
    
}

export default TermsScreen;