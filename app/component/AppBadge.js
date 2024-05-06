import React from 'react'
import { StyleSheet, Text, View } from 'react-native';

function AppBadge(props) {
    return (
      <View style={[style.container, props.style]}>
        <Text style={style.styleText}>{props.children}</Text>
      </View>
    )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: 'orangered',
    borderRadius: 5,
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  styleText: {
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 12
  }
});

export default AppBadge;
