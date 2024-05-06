import firestore                                from '@react-native-firebase/firestore';
import store                                    from '../state/store';
import util                                     from '../util/util';
import { updateCheckingOnibus }                 from '../state/Checking/CheckingOnibusAction';
const onbusMobileCTOCollection                  = firestore().collection('onbus-mobile-cto');

export default {
    async watch_checking_onibus(){
        await onbusMobileCTOCollection.doc("checking-onibus").onSnapshot((documentSnapshot) => {
            if (documentSnapshot.data()){ 
                store.dispatch(updateCheckingOnibus({
                    data: util.obj_to_array(documentSnapshot.data())
                }));
            }
        });
    },
    async listar_checking_onibus(garagem){
        return new Promise( async (resolve, reject) => {
            
            //Recuperando coleção de checking
            let collection_checking_onibus          =  await firestore().collection('onbus-mobile-cto').doc('checking-onibus').get();
            let arr_checking_onibus                 = util.obj_to_array(collection_checking_onibus._data);
            //console.log("Arr_CHecking");
            //console.log(arr_checking_onibus);
            resolve(arr_checking_onibus);

        });
    }
}
