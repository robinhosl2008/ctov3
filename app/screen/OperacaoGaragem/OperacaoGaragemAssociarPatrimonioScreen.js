import React                                from 'react';
import { View, StyleSheet }                 from 'react-native';
import { Searchbar }                        from 'react-native-paper';
import { ScrollView  }                      from 'react-native-gesture-handler';
import OperacaoGaragemAssociarPatrimonio    from '../../component/OperacaoGaragem/OperacaoGaragemAssociarPatrimonio';
import HeaderBlank                          from '../../component/HeaderBlank';

function OperacaoGaragemAssociarPatrimonioScreen(props) {
    return (
        <View style={style.container}>
            <View style={{marginHorizontal: 20}}>
                <HeaderBlank>Cancelar</HeaderBlank>
            </View>
            <ScrollView style={style.container_list}>
                <OperacaoGaragemAssociarPatrimonio />
            </ScrollView>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    container_searchbar: {
        paddingHorizontal: 20,
        marginBottom: 30
    },
    container_list: {
        paddingHorizontal: 10,
    }
});

export default OperacaoGaragemAssociarPatrimonioScreen;