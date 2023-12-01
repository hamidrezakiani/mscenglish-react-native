import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";


const Spinner = (props) => {
    const [deg,setDeg] = useState(0);
    useEffect(() => {
        setDeg(0);
        setInterval(() => {
            if(deg < 540)
              setDeg(prevDeg => prevDeg + 4);
            else
              setDeg(prevDeg => prevDeg + 2);

            if(deg == 720)
              setDeg(0);

        },2)
    },[])

   return (
    <View style={{
        width:props.size,
        height:props.size,
        borderColor:props.color,
        // borderBottomWidth:props.with,
        borderWidth:props.width,
        borderRadius:props.size,
        borderStyle:'dotted',
        transform: [{ rotate: `${deg}deg`}],   
    }}>
    </View>
   );
}

export default Spinner;

