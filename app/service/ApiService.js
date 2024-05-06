import React from 'react';
import store from './../state/store';

const Frisbee = require('frisbee');
const axios   = require('axios');

// create a new instance of Frisbee
// const api = new Frisbee({
//   baseURI: 'https://qa-cgo.centralonbus.com.br/api',
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
//   }
// }); 

const api = axios.default.create({
  // baseURL: 'http://dev.centralonbus.com.br/api',
  baseURL: 'https://cgo.centralonbus.com.br/api',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {

  async autenticar(user, password){
    try{

      // Envia os dados para login na Retaguarda
      let res = await api.post('v1/login/autenticar', {usuario: user, senha: password});

      // Em caso de erro, retornar
      if (res.err) throw res.err;

      // Retorna apenas o payload, com os dados do usuário
      if (res.data){
        return res.data.dados;
      }

    } catch(error){
      if (error.response) {

        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data.status);
        console.error("::: ERROR RESPONSE!!");
        console.error("::: ERROR RESPONSE!!");
        console.error("::: ERROR RESPONSE!!");
        throw error.response.data.status;

      } else if (error.request) {

        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log();
        console.error("::: ERROR REQUEST!!");
        console.error("::: ERROR REQUEST!!");
        console.error("::: ERROR REQUEST!!", error.request);
        throw error.request;

      } else {

        // Something happened in setting up the request that triggered an Error
        console.error("::: ERROR GERAL!!");
        console.error("::: ERROR GERAL!!");
        console.error("::: ERROR GERAL!!");
        throw "Ocorreu um erro ao enviar a requisição";

      }
    }
  },

  async atualizar_firestore(){

    let state       = store.getState(); 
    let user_auth   = state.app.user_auth;

    await api.post('v2/firestore/atualizar', {
      body: {}
    }, 
    {
      headers: {Authorization: user_auth.token}
    });
  },

  async post(payload){
      const data = new FormData();
      data.append('form', payload);
      await api.post('qa/api-teste', {body: {payload}});
  },

  async get(url, param){

    let state       = store.getState(); 
    let user_auth   = state.app.user_auth;

    return api.get(url, {params: param}, {
      headers: {Authorization: user_auth.token}
    });
},

  delete(){

  }
}
