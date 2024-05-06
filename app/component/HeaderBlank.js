import React from 'react'
import { View, Text, StyleSheet, Alert }       from 'react-native'
import { useNavigation }    from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome          from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid }   from "react-native-easy-grid";

function HeaderBlank(props) {

    const navigation = useNavigation();

    return (
        <View style={style.container}>
            <View style={[style.container_col, props.style]}>
                <Grid>
                    <Col size={40}>
                        <View style={[{flexDirection: 'row'}]}>
                            <TouchableOpacity onPress={props.handle_close ? props.handle_close : navigation.goBack}>
                                <FontAwesome name="close" color={(props.color)?(props.color):("black")} style={{alignSelf: 'center'}} size={40} /> 
                            </TouchableOpacity>
                            <Text style={{alignSelf: 'center', paddingHorizontal: 10, fontSize: 20, color:(props.color)?(props.color):("black")}}>{props.children}</Text>
                        </View>
                    </Col>
                    <Col size={60}>
                        <View style={[{alignSelf: 'flex-end', justifyContent: 'flex-end'}]}>
                            {props.right}
                        </View>                    
                    </Col>
                </Grid>
            </View>
            <View style={style.container_content}>
                {props.content}
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        paddingBottom: 40
    },
    container_col: {
        flexDirection: 'row',
        paddingTop: 30,
        paddingBottom: 10,
        width: '100%'        
    },
    container_content: {
        paddingTop: 5,
    }
});

export default HeaderBlank;