import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { List, IconButton, Portal, Modal, } from 'react-native-paper';

function SelectionModal({open, onDismiss, nav}) {
    const { width, height } = Dimensions.get('window');

    const styles = StyleSheet.create({
        modalContainer: {
            backgroundColor: 'white',
            padding: 0,
            width: width / 1.1,
            alignSelf: 'center',
            marginTop: - (height / 20),
            borderRadius: 3
        },
    })

    return (
        <Portal>
            <Modal contentContainerStyle={styles.modalContainer} visible={open} onDismiss={onDismiss}>
                <List.Item titleStyle={{ fontSize: 17, fontWeight: 'bold', }} title="Hedef Listesi Ekle" right={(props) => <IconButton icon="close" size={20} onPress={onDismiss} />} />
                <List.Item
                    style={{ paddingTop: 0, paddingBottom: 0 }}
                    left={props => <List.Icon  {...props} icon="qrcode-scan" style={{ marginRight: -3 }} />}
                    titleStyle={{ fontSize: 17, }}
                    title="Karekodu Tara"
                    onPress={() => {
                        onDismiss();
                        nav.navigate('QRScanScreen');
                    }}
                />
                <List.Item
                    style={{ paddingTop: 0, paddingBottom: 0 }}
                    left={props => <List.Icon  {...props} icon="barcode-scan" style={{ marginRight: -3 }} />}
                    titleStyle={{ fontSize: 17, }}
                    title="Barkodu Tara"
                    onPress={() => {
                        onDismiss();
                        nav.navigate('BarcodeScanScreen');
                    }}
                />
                <List.Item
                    style={{ paddingTop: 0, paddingBottom: 0, marginBottom: 10 }}
                    left={props => <List.Icon  {...props} icon="file-search-outline" style={{ marginRight: -3 }} />}
                    titleStyle={{ fontSize: 17, }}
                    title="Liste Kodunu Kullan"
                    onPress={() => {
                        onDismiss();
                        nav.navigate('ListGetScreen');
                    }}
                />
            </Modal>
        </Portal>
    )
}

export default SelectionModal;