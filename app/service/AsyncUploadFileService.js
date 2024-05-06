import firestore                    from '@react-native-firebase/firestore';
import firebaseStorage              from '@react-native-firebase/storage';
import OnbusMobileCTOSyncService    from './OnbusMobileCTOSyncService';
import store                        from './../state/store';

const asyncUploadFileCollection = firestore().collection('async-upload-file')

export default {

    async create(param){

        return new Promise(async (resolve) => {

            let state               = store.getState();
            let user_auth           = state.app.user_auth;
            let path_remote_file    = param.path_remote_file;
            let path_local_file     = param.path_local_file;
            let payload             = param.payload;
            
            // 1. Registra a sincronização do arquvio, para em caso de falha tentar novamente 
            let asyncUploadFileDoc = await asyncUploadFileCollection.add({
                uid:                path_remote_file,
                id_funcionario:     user_auth.id,
                tipo_movimento:     payload.tipo_movimento,
                submovimento:       payload.submovimento,
                path_local_file:    path_local_file,
                path_remote_file:   path_remote_file,
                payload:            payload
            });

            // Realiza a primeira tentativa de upload do arquivo
            const ref           = firebaseStorage().ref(path_remote_file);
            
            // Realiza o upload do arquivo para o Firebase Storage
            let task = ref.putFile(path_local_file).then( async (res) => {
                console.log(`::: Enviando arquivo: ${path_remote_file}`); 
            });
    
            task.then(async () => {

                // Sincroniza a atuação com a CGO 
                OnbusMobileCTOSyncService.registrar_checking_fotografico(payload);

                // Remove o Documento do Firestore
                await asyncUploadFileDoc.delete(); 

            });    

            resolve(true);
        });

    },

    async sincronizar_arquivos(){
        return new Promise(async (resolve) => {

            let state               = store.getState();
            let user_auth           = state.app.user_auth;

            // 1. Obtém todos os documentos associados ao Técnico
            asyncUploadFileCollection
                .where('id_funcionario', '==', user_auth.id)
                .get()
                .then(arr_doc => {
                    
                    arr_doc.forEach(item => {
                        
                        let asyncUploadFileDoc  = item.data();
                        let document_id         = item.id;
                        let payload             = asyncUploadFileDoc.payload;
                        let path_local_file     = asyncUploadFileDoc.path_local_file;
                        let path_remote_file    = asyncUploadFileDoc.path_remote_file;

                        // Realiza a primeira tentativa de upload do arquivo
                        let ref           = firebaseStorage().ref(path_remote_file.toString());
                        
                        // Realiza o upload do arquivo para o Firebase Storage
                        let task = ref.putFile(path_local_file.toString()).then( async (res) => {
                            console.log(`::: Sincronizando novamente o arquivo: ${path_remote_file}`); 
                        });
                
                        task.then(async () => {

                            // Sincroniza a atuação com a CGO 
                            OnbusMobileCTOSyncService.registrar_checking_fotografico(payload);

                            // Remove o Documento do Firestore
                            await asyncUploadFileCollection.doc(document_id).delete(); 

                        });    

                    });

                });
          
        });
    },

    // Método que retorna todos os carros de Checking que estão aguardando sincronia
    async onibus_checking_aguardando_sincronia(){
        return new Promise((resolve) => {

            let state               = store.getState();
            let user_auth           = state.app.user_auth;
            let arr_id_onibus       = [];

            asyncUploadFileCollection
            .where('id_funcionario', '==', user_auth.id)
            .get()
            .then(arr_doc => {
                
                arr_doc.forEach(item => {
                    
                    let asyncUploadFileDoc  = item.data();
                    let payload             = asyncUploadFileDoc.payload;
                    let id_onibus           = payload.id_onibus;

                    arr_id_onibus.push(id_onibus);
                });

            }).finally(() => {
                resolve(arr_id_onibus);
            });

        });
    }

}