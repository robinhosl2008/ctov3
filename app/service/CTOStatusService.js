import firestore                                from '@react-native-firebase/firestore';
import store                                    from '../state/store';
import util                                     from '../util/util';
import { updateCTOStatus }                    from '../state/CTOStatus/CTOStatusAction';
const onbusMobileCTOCollection                  = firestore().collection('onbus-mobile-cto');

export default {
    async watch_cto_status(){

        let state       = store.getState(); 
        let user_auth   = state.app.user_auth;

        await onbusMobileCTOCollection.doc("cto-status").onSnapshot((documentSnapshot) => {
            if (documentSnapshot !== null){ 
                let cto_status = documentSnapshot.data();
                if(cto_status[user_auth.id]){
                    store.dispatch(updateCTOStatus(
                        cto_status[user_auth.id]
                    ));
                }
                else{
                    console.log("\n\n\nCTO-STATUS INDEFINIDO\n\n\n")
                }
            }
        });
    }
}
