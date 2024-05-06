import React from 'react'
import { View, Text, StyleSheet }   from 'react-native'
import HeaderBlank                  from '../../component/HeaderBlank';
import LottieQuestion               from '../../component/LottieQuestion';

function ConfirmarAcaoScreen() {
    return (
        <View style={style.container}>
            <HeaderBlank>Cancelar</HeaderBlank>
            <LottieQuestion titulo="Confirma a atuação?" descricao="Após a confirmação não será possível reverter a ação" />
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});

export default ConfirmarAcaoScreen;
