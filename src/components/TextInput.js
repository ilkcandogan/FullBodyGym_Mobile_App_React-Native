import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input, useTheme, IconButton } from 'react-native-paper';


const TextInput = ({ errorText, rightIcon, rightButtonClick, ...props }) => {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            marginVertical: 4,
        },
        input: {
            backgroundColor: colors.background,
        },
        error: {
            fontSize: 14,
            color: colors.error,
            paddingHorizontal: 4,
            paddingTop: 4,
        },
    });
    
    return (
        <View style={styles.container}>
            <Input
                style={styles.input}
                selectionColor={colors.disabled}
                underlineColor="transparent"
                mode="outlined"
                {...props}
                right={rightIcon ? <Input.Icon  icon={rightIcon} onPress={rightButtonClick} /> : null}
            />
            {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
        </View>
    )
};

export default TextInput;