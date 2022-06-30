import React from 'react';
import { View } from 'react-native'
import { Appbar, Divider, List } from 'react-native-paper';

function AboutScreen({ navigation }) {
    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Hakkında" style={{ justifyContent: 'center', alignItems: 'center' }} />
                <Appbar.Action />
            </Appbar.Header>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <List.Accordion
                    title="Kullanım Koşulları"
                    style={{padding: 0}}
                    onPress={() => navigation.navigate('TermsScreen')}
                    left={props => <List.Icon {...props} icon="alert-circle" />} 
                    right={props => <List.Icon {...props} icon="chevron-right" style={{ margin: 0}} />} expanded={false}>
                </List.Accordion>
                <Divider />
                <List.Accordion
                    title="Gizlilik Politikası"
                    style={{padding: 0}}
                    onPress={() => navigation.navigate('PrivacyScreen')}
                    left={props => <List.Icon {...props} icon="shield-half-full" />} 
                    right={props => <List.Icon {...props} icon="chevron-right" style={{ margin: 0}} />} expanded={false}>
                </List.Accordion>
            </View>
        </React.Fragment>

    )
}

export default AboutScreen;