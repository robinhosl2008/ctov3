import React from 'react'
import { StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

function AppButton(props) {
    return (
        <TouchableOpacity onPress={props.onPress} disabled={props.disabled} style={[styles.appButtonContainer, (props.disabled) ? styles.disabled : {}, props.style]}>
            <Text style={styles.appButtonText}>{props.children}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    appButtonContainer: {
      backgroundColor: 'orange',
      borderRadius: 5,
      paddingVertical: 12,
      paddingHorizontal: 12
    },
    appButtonText: {
      fontSize: 16,
      color: "#fff",
      alignSelf: "center",
      textTransform: "uppercase"
    },
    disabled: {
      backgroundColor: 'lightgray'
    }
});

export default AppButton;
