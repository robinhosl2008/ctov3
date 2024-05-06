import React from "react";
import { PermissionsAndroid } from "react-native";

export default {

  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true
      } else {
        throw "É necessário acesso a camera do dispositivo para esta funcionalidade!"
      }
    } catch (err) {
      throw err;
    }
  },

  async requestWriteExternal() {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true
      } else {
        throw "É necessário acesso ao armazenamento do dispositivo para esta funcionalidade!"
      }
    } catch (err) {
      throw err;
    }
  },

  async requestReadExternal() {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true
      } else {
        throw "É necessário acesso ao armazenamento do dispositivo para esta funcionalidade!"
      }
    } catch (err) {
      throw err;
    }
  }

}