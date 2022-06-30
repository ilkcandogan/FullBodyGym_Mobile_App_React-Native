import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme, List } from 'react-native-paper';

function CardProgress({ title, data = [], defaultOpen = true, measureType, weightType }) {
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
            paddingRight: 10,
            paddingBottom: 10
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
        },
        progressContainer: {
            height: 22,
            backgroundColor: '#bdbdbd',
            borderRadius: 20,
            width: '100%',
            flexDirection: 'row'
        },
        progress: {
            height: '100%',
            backgroundColor: 'green',
            borderRadius: 20
        },
        progressText: {
            flex: 1,
            fontSize: 13,
            fontWeight: 'bold',
            alignSelf: 'center',
            textAlignVertical: 'center'
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
                    let diff = Calc(item.default, item.content).diff;
                    let perc = Calc(item.default, item.content).perc;
                    let color = PercToColor(diff < 0 ? diff : perc);

                    return (
                        <React.Fragment key={index}>
                            {Number(item.default) > 0 && Number(item.content) > 0 ? (
                                <React.Fragment>
                                    <View style={styles.itemBox} >
                                        <Text style={styles.title}>{item.title}:</Text>
                                        <Text style={styles.desc}>{item.default}</Text>
                                    </View>
                                    <View style={styles.itemBox} >
                                        <View style={styles.progressContainer}>
                                            <View style={[styles.progress, { width: perc + '%', minWidth: '20%', backgroundColor: color }]}>
                                                <Text style={[styles.progressText, { color: '#fff' }]}>
                                                    {diff === 0 ? 'Tamamlandı' : (diff < 0 ? diff : '+' + diff) + ' ' + (item.title.toLowerCase() === 'kilo' ? weightType : measureType)}
                                                </Text>
                                            </View>
                                            {/* {perc <= 80 ? (
                                                <View style={[styles.progress, { width: '20%', backgroundColor: 'transparent', flex: 1 }]}>
                                                    <Text style={[styles.progressText, { color: '#000', alignSelf: 'center' }]}>
                                                        {(diff > 0 ? (item.default - diff) : diff) + ' ' + (item.title.toLowerCase() === 'kilo' ? weightType : measureType)}
                                                    </Text>
                                                </View>
                                            ) : null} */}
                                        </View>
                                    </View>
                                </React.Fragment>
                            ) : null}

                        </React.Fragment>
                    )
                })}
                {data[0]?.lastUpdated ? (<Text style={{ color: colors.text, marginVertical: 10, alignSelf: 'center', fontSize: 14 }}> {data[0].lastUpdated} tarihinde güncellendi </Text>) : null}
            </View>
        </View>
    )
}

function Calc(target, current) {
    let diff = target - current;
    let perc = ((current * 100) / target).toFixed(0);

    return { diff, perc: perc > 100 ? 100 : (perc < 0 ? 0 : perc) }
}

function PercToColor(perc) {
    if (perc < 100) {
        return '#BB2D3B';
    }
    else {
        return 'green';
    }
}

export default CardProgress;