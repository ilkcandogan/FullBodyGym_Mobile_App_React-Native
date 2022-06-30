import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { useTheme, List } from 'react-native-paper';

function ListItem({ data, onPress }) {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            borderColor: colors.primary,
            borderWidth: 0.5,
            borderRadius: 5,
            backgroundColor: '#fff',
            flexDirection: 'row',
            height: 50,
            marginLeft: 15,
            marginRight: 15,
            marginBottom: 15
        },
        leftView: {
            height: 50,
            width: 5,
            backgroundColor: colors.primary,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5
        },
        title: {
            flex: 1,
            fontSize: 17,
            fontWeight: 'bold',
            color: colors.primary,
            alignSelf: 'center',
            marginLeft: 10
        },
        customName: {
            flex: 1,
            fontSize: 16,
            color: colors.primary,
            alignSelf: 'center',
            marginLeft: 10
        }
    })
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.5}>
            <View style={styles.container}>
                <View style={styles.leftView}></View>
                <Text style={styles.title}>
                    {data.LIST_NAME || data.listName}
                    {(data?.customName || false) ? <Text style={styles.customName}> ({data.customName})</Text> : null}
                </Text>
                
                <List.Icon icon='chevron-right' style={{ margin: 0, alignSelf: 'center' }} color={colors.primary} />
            </View>
        </TouchableOpacity>
    )
}

export default ListItem;