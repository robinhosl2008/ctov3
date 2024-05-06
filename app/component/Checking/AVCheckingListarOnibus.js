import React, {useState}            from 'react'
import { View, Text, StyleSheet, }  from 'react-native'
import { TouchableOpacity }         from 'react-native-gesture-handler';
import EvilIcons                    from 'react-native-vector-icons/EvilIcons';
import { connect }                  from 'react-redux';
import util                         from '../../util/util';
import MediaService                 from '../../service/MediaService';
import CheckingService              from '../../service/CheckingService';
import AsyncUploadFileService       from './../../service/AsyncUploadFileService';

function AVCheckingListarOnibus(props) { 

    let av_checking                                         = props.av_checking;
    let av_checking_calendario                              = props.av_checking_calendario;
    let garagem                                             = props.garagem;
    let rota                                                = props.rota;
    const [onibus_checking, set_onibus_checking]            = useState(null);
    const [arr_onibus_cehcking, set_arr_onibus_cehcking]    = useState([]);
    const [loading, set_loading]                            = useState(false);

    // Seleciona todos os onibus associado ao calendario que já possui foto de checking
    let arr_onibus_disponiveis          = [];
    let arr_checking_calendario_onibus  = [];
    let arr_checking_momento            = [];
    let arr_onibus_aguardando_sincronia = [];


    async function listar_onibus() {

        if (loading == false){

            set_loading(true);

            let arr_onibus_checking_aguardando_sincronia    = await AsyncUploadFileService.onibus_checking_aguardando_sincronia();
            
            // Obtém os "ônibus relacionados" atualizados, direto do State
            let arr_onibus_relacionado = [];
            props.state.checking.data.filter((item) => {
                if (item.id == av_checking.id){
                    console.info(`::: Onibus relacionados ao Checking da AV: ${item.id}`);
                    for (let [i, id_onibus_relacionado] of Object.entries(item.onibus_relacionado)){
                        arr_onibus_relacionado.push(id_onibus_relacionado);
                    }
                }
            });

            arr_onibus_disponiveis = props.state.checking_onibus.data.filter((item) => {
        
                let has_checking = arr_onibus_checking_aguardando_sincronia.filter((id_onibus) => { 
                    if (id_onibus == item.id){
                        return true; 
                    }
                });
        
                // Verifica se o carro pertence a Rota e Garagem, antes selecionados
                if (item.id_garagem == garagem.id_garagem && item.id_rota == rota.id_rota) {     
                    
                    if (has_checking.length === 0 && !arr_checking_momento[item.numeroOnibus]){

                        // console.info(`VERIFICANDO CARRO DE ID: ${item.id} - HAS CHECKING: ${JSON.stringify(has_checking)}`);

                        if (arr_onibus_relacionado.length > 0){

                            // Se o ônibus estiver relacionado a lista de carros relacionados, ele está apto a receber a foto de Checking
                            if (arr_onibus_relacionado.includes(item.id.toString())){
                                return item;
                            }

                        } else {
                            return item;
                        }

                    } else {
                        arr_checking_momento[item.numeroOnibus] = null; 
                    }
                }
        
            });
            
            // console.info("::: CHECKING FOTOGRÁFICO - ÔNIBUS RELACIONADO :::");
            // console.info("::: CHECKING FOTOGRÁFICO - ÔNIBUS RELACIONADO :::");
            // console.info("::: CHECKING FOTOGRÁFICO - ÔNIBUS RELACIONADO :::");
            // console.info(av_checking.onibus_relacionado);

            set_arr_onibus_cehcking(arr_onibus_disponiveis);
        }
    }

    async function registrar_foto(onibus){
        try{

            // Abre a camera para registro da foto
            MediaService.take_photo({nome_arquivo: `${av_checking_calendario.av_id  }_${onibus.id_garagem}_${onibus.id}`}).then(async (filename) => {

                set_onibus_checking(onibus);
                console.info(`::: ONIBUS CHECKING :::`);
                console.info(JSON.stringify(onibus, null, 4));

                await CheckingService.registrar_checking({
                    onibus:                 onibus,
                    av_checking:            av_checking,
                    av_checking_calendario: av_checking_calendario,  
                    filename:               filename
                });

            }).catch((error) => {});

        } catch(e){
            console.warn(e);
        }
    }

    listar_onibus();

    return (
        <View style={style.container_onibus}>
            {
                (arr_onibus_cehcking.map((onibus) => (
                    (!onibus_checking || (onibus_checking.id !== onibus.id ) ) ? 
                    <TouchableOpacity key={onibus.id} onPress={() => registrar_foto(onibus)}>
                        <View style={style.box_onibus}>
                            <EvilIcons name="camera" size={60} style={style.box_icon} />
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{onibus.numeroOnibus}</Text>
                        </View>
                    </TouchableOpacity>
                    : <></>
                )))
            }
        </View>
    )

}

const style = StyleSheet.create({
    container_onibus: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 40,
        paddingBottom: 300
    },
    box_onibus: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        width: 100,
        alignItems: 'center',
        marginHorizontal: 8,
        marginBottom: 20
    },
    box_icon: {
        marginVertical: 15
    }
});

export default connect(function mapStateToProps(state){ return {state: state} })(AVCheckingListarOnibus);