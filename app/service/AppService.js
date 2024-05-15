import React, { BackHandler }   from 'react-native';
import firestore                from '@react-native-firebase/firestore';
import store                    from './../state/store';
import util                     from './../util/util';
import ApiService               from './ApiService';
import { appUserAuth }          from './../../app/state/App/AppAction';
import { useNavigation }        from '@react-navigation/native';
import packageJson              from './../../package.json';

// Services
import LibService                               from './LibService';
import EquipamentoControleFluxo                 from './EquipamentoControleFluxoService';
import EquipamentoFuncionarioControleService    from './EquipamentoFuncionarioControleService';
import EmpresaOnibusService                     from './EmpresaOnibusService';
import EmpresaOnibusFuncionarioService          from './EmpresaOnibusFuncionarioService';
import UsersService                             from './UsersService';
import OperacaoGaragemService                   from './OperacaoGaragemService';
import CheckingService                          from './CheckingService';
import RotaGaragemService                       from './RotaGaragemService';
import CheckingOnibusService                    from './CheckingOnibusService';
import OnbusMobileCTOSyncService                from './OnbusMobileCTOSyncService';
import AsyncStorageService                      from './AsyncStorageService';
import CTOStatusService                         from './CTOStatusService';
import ColetaService                            from './ColetaService';
import OperacaoOOHService                       from './OperacaoOOHService';
import AsyncUploadFileService                   from './AsyncUploadFileService';

export default {

    // Caso existam dados no AsyncStorage, tenta logar o usuário automaticamente
    async auto_login(){

        // APENAS PARA TESTE
        // APENAS PARA TESTE
        // APENAS PARA TESTE
        // APENAS PARA TESTE
/*         let login = await AsyncStorageService.get_user_login(); 

        if (login.user && login.password){

            // Tenta realizar o login automático
            console.info("::: LOGIN AUTOMATICO");
            console.info(login);
            this.do_login(login.user, login.password);

        }
 */    },

    async do_login(usuario, senha){ 
        try {

            // 1. Realiza o Login
            let login = await ApiService.autenticar(usuario, senha);

            if (packageJson.version !== login.app_current_version){

                return {
                    result:                 false, 
                    error:                  'version-deprecated', 
                    app_current_version:    login.app_current_version,
                    app_link_download:      login.app_link_download
                };

            } else {

                // 2. Armazena o Usuário e Senha no AsyncStorage, para login automático no futuro
                await AsyncStorageService.set_user_login(usuario, senha); 

                // 3. Define os dados do usuário logado no Redux, para controle de sessão
                store.dispatch(appUserAuth({
                    id:                       login.user.id,
                    nome:                     login.user.nome,
                    nick:                     login.user.nick,
                    funcao:                   login.user.funcao,
                    label_entrada_patrimonio: login.user.label_entrada_patrimonio,
                    label_saida_patrimonio:   login.user.label_saida_patrimonio,
                    imagem_base64:            login.user.imagem_base64,
                    token:                    login.token
                }));
                
                // 4. Habilita todas as sincronias com o Firestore
                console.info("::: AGUARDANDO OS STATUS DE EQUIPAMENTO...");
                await LibService.watch_lib_equipamento_status();

                console.info("::: AGUARDANDO LIB EM ALERTA ATUACAO...");
                await LibService.watch_lib_em_alerta_atuacao(); 

                console.info("::: AGUARDANDO LIB EQUIPAMENTO MOTIVO RETIRADA...");
                await LibService.watch_lib_equipamento_motivo_retirada();

                console.info("::: AGUARDANDO FUNCIONÁRO FILTRO ATUAÇÃO...");
                // await OperacaoGaragemService.watch_funcionario_filtro_atuacao(); // VAMOS APAGAR ISSO DAQUI DEPOIS!!
                // await LibService.watch_funcionario_filtro_atuacao(); 
                
                console.info("::: AGUARDANDO USUÁRIOS...");
                await UsersService.watch_firestore();
                
                console.info("::: AGUARDANDO EQUIPAMENTO CONTROLE FLUXO...");
                await EquipamentoControleFluxo.watch_firestore();

                console.info("::: AGUARDANDO EQUIPAMENTO FUNCIONÁRIO CONTROLE...");
                await EquipamentoFuncionarioControleService.watch_firestore();

                console.info("::: AGUARDANDO EMPRESA ONIBUS FUNCIONÁRIO...");
                await EmpresaOnibusFuncionarioService.watch_empresa_onibus_funcionario();

                console.info("::: AGUARDANDO EMPRESA ONIBUS...");
                await EmpresaOnibusService.watch_empresa_onibus();

                console.info("::: AGUARDANDO ONIBUS EM ALETA...");
                await OperacaoGaragemService.watch_onibus_em_alerta();

                console.info("::: AGUARDANDO ROTA x GARAGEM...");
                await RotaGaragemService.watch_rota_garagem(); 

                console.info("::: AGUARDANDO CHECKING ONIBUS..");
                await CheckingOnibusService.watch_checking_onibus(); 

                console.info("::: AGUARDANDO CHECKING FOTOGRAFICO...");
                await CheckingService.watch_checking_fotografico();

                console.info("::: AGUARDANDO CTO SYNC...");
                await OnbusMobileCTOSyncService.watch_cto_sync();

                console.info("::: AGUARDANDO CTO STATUS...");
                await CTOStatusService.watch_cto_status();

                console.info("::: AGUARDANDO COLETA...");
                await ColetaService.watch_coleta();

                console.info("::: AGUARDANDO OOH PONTOS EM ALETA...");
                await OperacaoOOHService.watch_ooh_pontos_em_alerta();

                // Sincroniza arquivos que não foram enviados por problemas de conexão 
                AsyncUploadFileService.sincronizar_arquivos();

                return {
                    result:             true, 
                    error:              null, 
                    app_link_download:  null
                };


            }

        } catch(e){
            console.error("::: ERRO AO FAZER LOGIN", e);
            throw e;
        }
    },

    async do_logout(){

        let login = await AsyncStorageService.get_user_login();

        // Remove o Usuário e Senha do SyncStorage
        //await AsyncStorageService.set_user_login(null, null);

        // No Redux, remover os dados do usuário logado
        store.dispatch(appUserAuth({}));

        // Direcionar o usuário para tela de Login
        const navigation    = useNavigation();
        navigation.navigate('LoginScreen_v3', { screen: 'LoginScreen_v3' });

    }

}
