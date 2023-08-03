import React from "react";
import { StyleSheet, View ,Text,ActivityIndicator} from "react-native";

const  Spinner =  (props) => {
   
    return (
        <View style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%',width:'100%'}}>
            <View>
            <ActivityIndicator size={100} color="#220c5c" />
            <Text style={styles.text}>لطفا صبر کنید...</Text>
            </View>
        </View>
    );
}


export default Spinner;

const styles = StyleSheet.create({
     text:{
        color:'#220c5c',
        fontSize:22,
        marginTop:10,
        fontFamily:'Vazir'
     }
});