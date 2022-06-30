import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme, List } from 'react-native-paper';

function Card({ title, data = [], defaultOpen = true }) {
    const { colors } = useTheme();
    const { width, height } = Dimensions.get('window');
    const [open, setOpen] = useState(defaultOpen);

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'column',
            borderWidth: 1,
            borderColor: colors.primary,
            borderRadius: 5,
            margin: 15
        },
        header: {
            height: height / 20,
            backgroundColor: colors.primary,
            flexDirection: 'row',
            alignContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 10
        },
        headerTitle: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
            flex: 1,
            marginTop: -1
        },
        contentBox: {
            display: open ? 'flex' : 'none',
            paddingLeft: 10,
            paddingRight: 10
        },
        itemBox: {
            flexDirection: 'row',
            alignContent: 'space-between',
            marginTop: 5,
            marginBottom: 5
        },
        title: {
            fontSize: 16,
            color: '#000',
            fontWeight: 'bold',
            flex: 1
        },
        desc: {
            fontSize: 16,

        }
    })
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setOpen(!open)}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <List.Icon icon={open ? 'menu-up' : 'menu-down'} style={{ margin: 0, marginRight: -10 }} color='#fff' />
                </View>
            </TouchableOpacity>
            <View style={styles.contentBox}>
                {data.map((item, index) => {
                    return (
                        <View style={styles.itemBox} key={index}>
                            <Text style={styles.title}>{item.title}:</Text>
                            <Text style={styles.desc}>{item.content}</Text>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}

export default Card;