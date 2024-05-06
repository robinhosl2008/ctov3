import firestore                                from '@react-native-firebase/firestore';
import store                                    from './../state/store';
import util                                     from './../util/util';
import { updateUsers }                          from './../state/Users/UsersAction';
const onbusMobileCTOCollection  = firestore().collection('onbus-mobile-cto');
const docName                   = "users";

export default {
    async watch_firestore(){
        await onbusMobileCTOCollection.doc(docName).onSnapshot((documentSnapshot) => {
            if (documentSnapshot.data()){ 
                let arr_users = util.obj_to_array(documentSnapshot.data());        
                store.dispatch(updateUsers(arr_users));    
            }
        });
    }
}
  