import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

function CardStat(props) {
    return (
      <View style={style.container}>
        <Text style={style.title}>{props.title}</Text>
        <Text style={style.value}>{props.value}</Text>
      </View>
    );
}

const style = StyleSheet.create({
  container:{
    backgroundColor: 'white',
    width: '48%',
    height: 90,
    borderRadius: 10,
    padding: 20,
    elevation: 2,
    shadowColor: 'grey',
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 1
  },
  title:{
    textAlign: "right",
    color: 'darkgray',
    fontWeight: "800"
  },
  value:{
    textAlign: "right",
    marginTop: 5,
    fontSize: 25,
    color: "dimgrey"
  }
});

export default CardStat;