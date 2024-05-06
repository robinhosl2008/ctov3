import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View,Text,TouchableOpacity, StyleSheet} from 'react-native';
import { Badge } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function Infotape(props){

    const navigation = useNavigation();
    let route_params = props.route_params;

    function navigator(){
        if(props.touchEvent && props.targetScreen){
            navigation.navigate(props.targetScreen, { route_params: route_params }  )
        } else if(props.touchEvent){
            navigation.navigate(props.label)
        }else{
            return null
        }
    }

    return(
        <TouchableOpacity  onPress={navigator}   activeOpacity={(props.activeOpacity) ? props.activeOpacity : 0.6} style={{...styles.infotapeContainer,width:(props.width) ? props.width : '95%'}}>
            <View style={styles.infotapeAction}>
                { props.icon ? <Text style={{marginLeft:10}}>{props.icon}</Text> : null }
                <View>
                    <Text style={styles.infotapeActionLabel}>{props.label}</Text>
                    { props.sublabel ? <Text style={styles.infotapeActionSubLabel}>{props.sublabel}</Text> : null}
                </View>
            </View>
            <View style={styles.infotapeAlerts}>
                { props.late ? <Text style={styles.infotapeLate}>Em atraso</Text> : null }
                {props.badge ? <View style={styles.infotapeBadge}><Text style={styles.infotapeBadgeText}>{props.badge}</Text></View> : null }
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    infotapeContainer:{
        display:'flex',
        flexDirection:'row',
        height:55,
        backgroundColor:'white',
        borderRadius:5,
        alignItems:'center',
        margin:10,
    },
    infotapeAction:{
        width:'58%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        paddingLeft:10,
    },
    infotapeActionLabel:{
        fontFamily:'Arial',
        fontSize:16,
        marginLeft:18
    },
    infotapeActionSubLabel:{
        display:'flex',
        marginLeft:15,
        fontSize:11,
        color:'gray',
    },
    infotapeAlerts:{
        width:'42%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end'
    },
    infotapeLate:{
        marginRight:20,
        color:'red'
    },
    infotapeBadge:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        width:50,
        height:30,
        backgroundColor:'#ff4d4d',
        borderRadius:5,
        marginRight:20,
        marginLeft:15,
    },
    infotapeBadgeText:{
        fontFamily:'Arial',
        fontSize:18,
        color:'white'
    },
});
 