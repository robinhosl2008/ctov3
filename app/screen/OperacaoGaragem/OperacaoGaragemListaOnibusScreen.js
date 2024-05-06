import React                    from 'react';
import { ScrollView }           from 'react-native-gesture-handler';
import Screen                   from '../../component/Screen';
import OperacaoGaragemOnibus    from './../../component/OperacaoGaragem/OperacaoGaragemOnibus';

export default function OperacaoGaragemListaOnibusScreen({id_garagem}) {
    return (
        <OperacaoGaragemOnibus route_params={id_garagem}></OperacaoGaragemOnibus>
    )
}
