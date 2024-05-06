import React                    from 'react';
import ImagePicker              from 'react-native-image-picker';
import PermissionsService       from './PermissionsService';
import util                     from './../util/util';
import { ProcessingManager }    from '@humanz/react-native-video-processing';
import { useNavigation }        from '@react-navigation/native';
const RNFS                      = require('react-native-fs');

const photo_options = {
    mediaType:      'photo',
    maxWidth:       1024,
    maxHeight:      1024,
    quality:        0.9,
    includeBase64:  true
};

const video_options = {
    mediaType:      'video',
    videoQuality:   'medium',
    saveToPhotos:   true,
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
} 

export default {

    async take_photo (payload){
        return new Promise(async (resolve, reject) => {
            try {
    
                // Verifica todas as permissões necessárias
                await PermissionsService.requestCameraPermission();
                await PermissionsService.requestWriteExternal();
                await PermissionsService.requestReadExternal();
        
                await ImagePicker.launchCamera(photo_options, async (file) => {
                    if(file.didCancel){

                    }
                    else{
                        if (file.data !== undefined){
    
                            // Nome do arquivo com base no Numero do Carro e Timestamp
                            let filename = `${RNFS.ExternalCachesDirectoryPath}/${payload.nome_arquivo}_${util.now("YYYYMMDDHHmmss")}.jpg`;
    
                            console.log("::: ARMAZENANDO NO DISPOSITIVO :::");
    
                            // Armazena o arquivo no diretorio de Cache da Aplicação
                            let file_img = await RNFS.writeFile(filename, file.data, 'base64').then((res) => {
                                console.log(`::: IMAGEM SALVA COM SUCESSO - ${filename} :::`);
                                resolve(filename);
                            });
        
                            resolve(file_img);
                        }
    
                        reject("Erro ao salvar a imagem!");
                    }
                });
    
            } catch(e){
                console.log("::: ERRO :::");
                console.error(e);
                reject(e);
            }
        });
    },

    async take_video(params) {

        return new Promise(async (resolve, reject) => {
            try {
    
                // Verifica todas as permissões necessárias
                await PermissionsService.requestCameraPermission();
                await PermissionsService.requestWriteExternal();
                await PermissionsService.requestReadExternal();

                await ImagePicker.launchCamera(video_options, async (file) => {
                    if(file.didCancel){

                    }
                    else{
                        if (file){

                            // console.info("::: REALIZANDO COMPRESSÃO DO ARQUIVO DE VÍDEO :::");
                            // console.info("::: REALIZANDO COMPRESSÃO DO ARQUIVO DE VÍDEO :::");
                            // console.info("::: REALIZANDO COMPRESSÃO DO ARQUIVO DE VÍDEO :::");
                            // console.info(file.path); 
    
                            // Exibe a tela de processamento de vídeo (aguarde...)
                            params.navigation.navigate('VideoProcessingScreen', {
                                screen: 'VideoProcessingScreen' 
                            }); 
    
                            ProcessingManager.compress(file.path, {
                                width: 720,
                                height: 1280,
                                bitrateMultiplier: 5, 
                                minimumBitrate: 350000,
                            }).then((data) => {
                                // console.info("::: VÍDEO COMPRIMIDO :::");
                                // console.info("::: VÍDEO COMPRIMIDO :::");
                                // console.info("::: VÍDEO COMPRIMIDO :::");
                                // console.info(data.source);
    
                                // Fecha a tela de processamento de vídeo
                                params.navigation.pop(1);
    
                                resolve(data.source);
                                // resolve(file.path);
                            });
            
                        }
                    }
                    

                });
    
            } catch(e){
                console.log("::: ERRO :::");
                console.error(e);
                reject(e);
            }
        });
    }
}
