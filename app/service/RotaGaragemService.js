import firestore                                from '@react-native-firebase/firestore';
import store                                    from '../state/store';
import util                                     from '../util/util';
import { updateRotaGaragem }                    from '../state/RotaGaragem/RotaGaragemAction';
const onbusMobileCTOCollection                  = firestore().collection('onbus-mobile-cto');

export default {
    async watch_rota_garagem(){
        await onbusMobileCTOCollection.doc("rota-garagem").onSnapshot((documentSnapshot) => {
            if (documentSnapshot.data()){ 
                store.dispatch(updateRotaGaragem({
                    data: util.obj_to_array(documentSnapshot.data())
                }));
            }
        });
    }
}
