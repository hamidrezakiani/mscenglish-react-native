import React,{useEffect, useState} from "react";
import {View, Button,Text ,StyleSheet,TouchableOpacity,TextInput,Alert} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
const Login = props => {

   const {setIsCodeSent,user,setUser} = useContext(AppContext);
  const login2 = (phone) => {
    setUser({...user,mobile:phone});
    
    fetch(`http://mscenglish.ir/api/verificationCode?mobile=${phone}`, {
      method: "POST",
      //Request Type
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success
        // console.log(responseJson);
        // setUserData({
        //   name: user.name,
        //   mobile: user.mobile,
        //   token: user.token,
        //   verify: user.verify,
        //   payStatus: user.payStatus,
        //   new_user:parseInt(responseJson.data.new_user),
        // });
        // setUser({
        //   name: user.name,
        //   mobile: user.mobile,
        //   token: user.token,
        //   verify: user.verify,
        //   payStatus: user.payStatus,
        //   new_user:parseInt(responseJson.data.new_user),
        // });
        setIsCodeSent(true);
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        console.error(error);
      });
  };

    const [phoneNumber,onPhoneNumberChange] = useState();
    const [networkState,setNetworkState] = useState('connecting....');
    useEffect(() => {
      NetInfo.addEventListener(state => {
        // console.log("Connection type", state.type);
        // console.log("Is connected?", state.isConnected);
        if(state.isConnected)
          setNetworkState('connected');
        else
          setNetworkState('disconnected')
      });
    },[]);
    const login = () => {
        const firstChar = Array.from(phoneNumber)[0];
        
        if(firstChar != '0' || phoneNumber.length != 11)
          Alert.alert('خطا','لطفا شماره را به صورت درست وارد کنید.');
        else
          login2(phoneNumber);

    }
    return (
      <View style={styles.container}>
        <Text>
          {networkState}
        </Text>
        <Text style={{ marginBottom: 50, fontSize: 22, fontFamily: "Vazir" }}>
          برای ورود شماره خود را وارد کنید.
        </Text>
        <TextInput
          style={styles.inputText}
          value={phoneNumber}
          onChangeText={(value) => onPhoneNumberChange(value)}
          keyboardType="number-pad"
          placeholder="09*********"
        />
        <TouchableOpacity style={styles.loginBtn} onPress={() => login()}>
          <Text style={{ color: "#fff", fontSize: 20 }}>بعدی</Text>
        </TouchableOpacity>
      </View>
    );
}

export default Login;
const styles = StyleSheet.create({
  loginBtn: {
    paddingTop: 6,
    paddingBottom: 10,
    paddingHorizontal: 30,
    backgroundColor: "#220c5c",
    borderRadius: 10,
    borderColor: "#2e0066",
    borderWidth: 1,
  },
  inputText: {
    marginBottom: 40,
    height: 50,
    width: "70%",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#220c5c",
    paddingEnd: 10,
    paddingStart: 10,
    color: "#220c5c",
    fontFamily: "Vazir",
    fontSize:24,
    textAlign:"center"
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
  },
});