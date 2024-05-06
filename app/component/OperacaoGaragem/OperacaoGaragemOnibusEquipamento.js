import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import util from './../../util/util';

export default function OperacaoGaragemOnibusEquipamento(props) {

    let arr_equipamento = util.obj_to_array(props.arr_equipamento).sort(util.order_by("id_lib_equipamento_tipo"));

    function render_icon(item) {
        switch(item.id_lib_equipamento_tipo){
            case 1: return <Octicons style={{color: 'black', marginBottom: 10}} name="server" size={25} />;
            case 2: return <Fontisto style={{color: 'black', marginBottom: 10}} name="wifi" size={25} />;
            case 3: return <SimpleLineIcons style={{color: 'black', marginBottom: 10}} name="screen-desktop" size={25} />;
            case 4: return <MaterialCommunityIcons style={{color: 'black', marginBottom: 10}} name="router-wireless" size={25} />;
            default: {
                return <></>
            }
        }
    }

    return (
        <View style={[style.container]}>
            <Text style={style.title}>Patrimônios relacionados</Text>
            {
                (arr_equipamento.length === 0) ? (
                    <View><Text>Não há patrmiônio</Text></View>
                ) : (
                    <View style={style.container_equipamentos}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                arr_equipamento.map((item) => {
                                    return (
                                        <View style={style.box_equip} key={item.id_equipamento}>
                                            {render_icon(item)}
                                            <Text style={{color: 'gray', textTransform: 'uppercase'}}>{item.tipo}</Text>
                                            <Text style={{fontWeight: 'bold', fontSize: 18}}>{item.patrimonio}</Text>
                                            {
                                                (item.sync === false) ? (
                                                    <Ionicons style={{color: 'black', position:'absolute', top: 10, right: 10}} name="ios-checkmark-circle-outline" size={18} />
                                                ) : (
                                                    <Ionicons style={{color: 'green', position:'absolute', top: 10, right: 10}} name="ios-checkmark-done-circle" size={20} />
                                                )
                                            }
                                        </View>        
                                    )
                                })
                            }
                        </ScrollView>
                    </View>    
                )
            }
        </View>
    )
}
const style = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        width: '100%'
    },
    title:{ 
        marginBottom: 10, 
        fontWeight: 'bold', 
        fontSize: 15
    },
    container_equipamentos: {
        flexDirection: 'row'
    },
    box_equip: {
        alignItems: 'center',
        marginEnd: 10,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        width: 100
    }
});
