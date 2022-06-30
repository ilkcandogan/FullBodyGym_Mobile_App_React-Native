import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { RNCamera } from "react-native-camera";
import BarcodeMask from 'react-native-barcode-mask';
import { Appbar } from 'react-native-paper';

function BarcodeScanScreen({ navigation }) {
    const {width, height} = Dimensions.get('window');
    const handleRead = (e) => {
        if(e.data) {
            navigation.navigate('ListGetScreen', {qrCode: e.data})
        }
    }

    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Barkodu Tara" style={{ justifyContent: 'center', alignItems: 'center' }} />
                <Appbar.Action />
            </Appbar.Header>
            <View style={styles.container}>
                <RNCamera
                    barCodeTypes={[RNCamera.Constants.BarCodeType.code128]}
                    //flashMode={RNCamera.Constants.FlashMode.on}
                    style={styles.preview}
                    onBarCodeRead={handleRead}
                    ref={cam => (this.camera = cam)}
                    captureAudio={false}
                >
                    <BarcodeMask showAnimatedLine={false} width={width /1.3 } height={width /1.8} />
                </RNCamera>
            </View>
        </React.Fragment>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row"
    },
    preview: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center"
    }
});

export default BarcodeScanScreen;