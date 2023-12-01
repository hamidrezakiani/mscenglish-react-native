import React,{useEffect, useState} from "react";
import {View, Dimensions,ToastAndroid,Text ,StyleSheet,TouchableOpacity,TextInput,Alert,KeyboardAvoidingView } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import Svg, { Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import Spinner from "../components/Spinner";
const Login = props => {

   const {setIsCodeSent,user,setUser} = useContext(AppContext);
   const [sending,setSending] = useState(false);
   const [disableContinue,setDisableContinue] = useState(true);
   const [phoneNumber,onPhoneNumberChange] = useState();
   const [requestErrors, setRequestErrors] = useState([]);
   const continueButtonOpacity = (sending || disableContinue) ? 0.5 : 1;
  
   useEffect(() => {
    if(requestErrors.length > 0)
    {
      requestErrors.forEach((item) => {
        ToastAndroid.show(item.value, ToastAndroid.SHORT);
      });
      
    }
   },[requestErrors])
  const login = () => {
    setRequestErrors([]);
    setUser({...user,mobile:phoneNumber});
    setSending(true);
    fetch(`https://mscenglish.ir/api/verificationCode?mobile=${phoneNumber}`, {
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
        setSending(false);
        setIsCodeSent(true);
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        setSending(false);
        setRequestErrors([{'key':'network','value':'اتصال اینترنت خود را بررسی کنید'}]);
        console.error(error);
      });
  };


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
    // const login = () => {
    //     const firstChar = Array.from(phoneNumber)[0];
        
    //     if(firstChar != '0' || phoneNumber.length != 11)
    //       Alert.alert('خطا','لطفا شماره را به صورت درست وارد کنید.');
    //     else
    //       login2(phoneNumber);

    // }
    return (
      <KeyboardAvoidingView
      behavior="height"
      >
        <StatusBar style="light" hidden={true} />
        <View style={styles.container}>
         <View style={{flex:6,width:'100%',padding:0}}>
         <Svg
          preserveAspectRatio={"none"}
          width={'100%'}
          height={'100%'}
          viewBox="0 0 13 6.09"
         >
        <Path d="M 13 5 C 10 4 9 4 8 5 C 6 7 4 6 0 4 A 0 0 0 0 0 0 0 L 13 0" fill="#220c5c" />
      </Svg>
         </View>
        <View style={{flex:16,display:'flex',width:'100%',flexDirection:'column',justifyContent:'flex-start',alignItems:'center'}}>
        {/* <Text>
          {networkState}
        </Text> */}
        <View style={[styles.formGroup,{marginTop:20}]}>
           <Text style={{fontSize: 25, fontFamily: "Vazir"}}>
             ورود/ثبت نام
           </Text>
        </View>
        <View style={styles.formGroup}>
          <Text style={{color:'#444',fontSize:18,marginBottom:10}}>شماره موبایل خود را وارد کنید</Text>
       <TextInput style={styles.inputText}
          value={phoneNumber}
          onChangeText={(value) => {
            onPhoneNumberChange(value)
            const firstChar = Array.from(value)[0];
            if(firstChar != '0' || value.length != 11)
               setDisableContinue(true);
            else
               setDisableContinue(false);
          }}
          keyboardType="number-pad"
          placeholder="شماره موبایل"
        />
        </View>
        <View style={styles.formGroup}>
        <TouchableOpacity style={[styles.loginBtn,{opacity:continueButtonOpacity}]} onPress={() => login()} disabled={(sending || disableContinue)}>
          <Text style={{ color: "#fff", fontSize: 20,fontFamily:'Vazir' }}>
            {sending ? 'لطفا صبر کنید...' : 'ادامه'}
          </Text>
        </TouchableOpacity>
        </View>
        </View>
        <View style={{flex:2,width:'100%',display:'flex',alignItems:'flex-start',justifyContent:'flex-start'}}>
         <Svg
         preserveAspectRatio={"none"}
         width={'100%'}
         height={'100%'}
        viewBox="0 6.75 13 2.25"
      >
        <Path d="M 13 7 C 10 7 9 6 5 8 C 3 9 0 8 0 8 A 0 0 0 0 0 0 9 L 13 9" fill="#220c5c" />
      </Svg>
         </View>
      </View>
      </KeyboardAvoidingView>
    );
}

export default Login;
const styles = StyleSheet.create({
  formGroup:{
    height:90,
    width:'80%',
    display:'flex',
    alignItems:"flex-end",
    justifyContent:'center'
  },
  loginBtn: {
    width:'100%',
    alignItems:'center',
    paddingTop: 9,
    paddingBottom: 15,
    paddingHorizontal: 30,
    backgroundColor: "#220c5c",
    borderRadius: 10,
    borderColor: "#2e0066",
    borderWidth: 1,
  },
  inputText: {
    width:'100%',
    minWidth:200,
    height: 50,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#ccc",
    paddingEnd: 10,
    paddingStart: 10,
    color: "#220c5c",
    fontFamily: "Vazir",
    fontSize:24,
    textAlign:"center"
  },
  container: {
    display:'flex',
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: Dimensions.get('window').height,
  },
});