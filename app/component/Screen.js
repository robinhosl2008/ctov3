import React from "react";
import {StatusBar} from 'react-native';
import { StyleSheet, SafeAreaView, View } from "react-native";

function Screen({ children, style }) {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <View style={[styles.view, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 10,
    flex: 1,
  },
  view: {
    flex: 1,
  },
});

export default Screen;
