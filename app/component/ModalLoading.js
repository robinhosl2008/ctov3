import React from 'react'
import { Button, Modal, Portal } from 'react-native-paper'
import LottieLoadingSuccess from './LottieLoadingSuccess'
import {connect} from 'react-redux';
import { StyleSheet, View } from 'react-native';

function ModalLoading(props) {
    return (
    <Portal>
        <Modal contentContainerStyle={style.container} visible={props.state.app.modal_loading.visible} onDismiss={props.onDismiss}>
            <View style={style.container}>
                <LottieLoadingSuccess />
            <View />
            </View>
        </Modal>
    </Portal>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1, 
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 20,
    },
    containerButton:{
        height: 60, 
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%', 
        bottom: 0
    },
    btnStyle: {
        backgroundColor: 'black',
        width: '100%'
    },
    btnContentStyle: {
        height: 50
    },
    btnLabelStyle: {
        color: 'white',
    }
});

const mapStateToProps = state => {
    return { state };
};

export default connect(mapStateToProps)(ModalLoading);