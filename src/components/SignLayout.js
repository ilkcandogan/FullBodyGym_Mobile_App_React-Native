import React, { memo } from 'react';
import { StyleSheet, KeyboardAvoidingView, View } from 'react-native';
import { useTheme } from 'react-native-paper';

const SignLayout = ({ children }) => {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        background: {
            flex: 1,
            width: '100%',
            backgroundColor: colors.background,
            
        },
        container: {
            flex: 1,
            padding: 20,
            paddingTop: 0,
            width: '100%',
            marginTop: '10%',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    return (
        <View style={styles.background}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                {children}
            </KeyboardAvoidingView>
        </View>

    )
}

export default memo(SignLayout);