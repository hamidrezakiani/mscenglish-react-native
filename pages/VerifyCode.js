import React, { useState, useReducer,useEffect } from "react";
import {View,Dimensions,ToastAndroid,Text,StyleSheet,TouchableOpacity,TextInput,Alert, KeyboardAvoidingView,} from "react-native";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import Spinner from "../components/Spinner";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { timing } from "react-native-reanimated";
const CELL_COUNT = 4;
const initialState = {
  name: {
    value: "",
    isValid: false,
    errorMessage: "لطفا نام خود را وارد کنید",
  },
  code: {
    value: "",
    isValid: false,
    errorMessage: "لطفا کد را به صورت درست وارد کنید",
  },
  invitationCode: {
    value: "",
    isValid: true,
    errorMessage: "کد معرف صحیح نمیباشد",
  }
};
const ON_INPUT_CHANGE = "onInputChange";
const reducer = (state, action) => {
  switch (action.type) {
    case ON_INPUT_CHANGE:
      return { ...state, [action.tag]: action.changeValue };
      break;
    default:
      break;
  }
};

const VerifyCode = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [value, setValue] = useState('');
  const [time, setTime] = useState(120);
  const [sending,setSending] = useState(0);
  const [verifing,setVerifing] = useState(0);
  const [name, onNameChange] = useState("");
  const [isSubmit,setisSubmit] = useState(false);
  const [invitationCode, onInvitationCodeChange] = useState();
  const [verifyApiErrors, setVerifyApiErrors] = useState([]);
  const {user,setUser,setUserData} = useContext(AppContext);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  // const continueBottonDissable = (value.length != 4 || verifing);
  // const continueBottonOpacity = (value.length != 4 || verifing) ? 0.5 : 1;
  const continueBottonDissable = false;
  const continueBottonOpacity = 1;
  const [properties, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  
  useEffect(() => {
    setTime(120);
    clearInterval(timing);
    const timing = setInterval(() => {
      setTime(prevTime => prevTime - 1);
    },1000);
  },[]);

  const resendCode = () => {
    setSending(1);
    setTime(120);
    setVerifyApiErrors([]);
    fetch(`http://mscenglish.ir/api/verificationCode?mobile=${user.mobile}`, {
      method: "POST",
      //Request Type
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        setSending(0);
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        console.error(error);
        setVerifyApiErrors([{'key':'network','value':'اتصال اینترنت خود را بررسی کنید'}]);
        setSending(0);
      });
  }
  
 
  useEffect(() => {
    if(verifyApiErrors.length > 0)
    {
      verifyApiErrors.forEach((item) => {
        ToastAndroid.show(item.value, ToastAndroid.SHORT);
      });
      
    }
    
    // verifyApiErrors.forEach((element) => {
    //   dispatch({
    //     type: ON_INPUT_CHANGE,
    //     tag: element.key,
    //     changeValue: {
    //       ...state[element.key],
    //       isValid: false,
    //       errorMessage: element.value,
    //     },
    //   });
    //   console.log(element.key);
    //   console.log(element.value);
    // });
    }, [verifyApiErrors]);
  const verifyCode = () => {
    setisSubmit(true);
    // if(state.name.value == '')
    //   dispatch({
    //     type: ON_INPUT_CHANGE,
    //     tag: "name",
    //     changeValue: { ...state["name"], isValid: false},
    //   });
    // if (state.code.value.length != 4)
    //   dispatch({
    //     type: ON_INPUT_CHANGE,
    //     tag: "code",
    //     changeValue: { ...state["code"], isValid: false },
    //   });
      verifyCode2(
        value
      );
  };
  const verifyCode2 = (code) => {
    setVerifing(1);
    setVerifyApiErrors([]);
    fetch(`http://mscenglish.ir/api/verify?mobile=${user.mobile}&code=${code}`, {
      method: "POST",
      //Request Type
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        setVerifing(0);
        console.log(responseJson);
        //Success
        if (responseJson.status['code'] == 200) {
          setUserData({
            name: responseJson.data.name,
            mobile: user.mobile,
            token: responseJson.data.api_token,
            verify: true,
            new_user: parseInt(responseJson.data.new_user),
            // payStatus: parseInt(responseJson.data.payStatus)
            payStatus : true,
          });
          setUser({
            name: responseJson.data.name,
            mobile: user.mobile,
            token: responseJson.data.api_token,
            verify: true,
            new_user: parseInt(responseJson.data.new_user),
            // payStatus: parseInt(responseJson.data.payStatus)
            payStatus:true,
          });
        }
        else {
          console.log('send');
          setVerifyApiErrors(responseJson.errors);
        }

      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        setVerifing(0);
        setVerifyApiErrors([{'key':'network','value':'اتصال اینترنت خود را بررسی کنید'}]);
        console.error(error);
      });
  };
  const label = "کد تایید را وارد کنید";
  return (
    // <View style={styles.container}>
    //   <Text style={{ marginBottom: 50, fontSize: 22, fontFamily: "Vazir" }}>
    //     {label}
    //   </Text>
    //   <TextInput
    //     style={styles.inputText}
    //     value={state.code.value}
    //     onChangeText={(text) => {
    //       if (text.length != 4)
    //         var valid = false;
    //       else
    //         var valid = true;
    //       dispatch({
    //         type: ON_INPUT_CHANGE,
    //         tag: "code",
    //         changeValue: { ...state["code"], value: text, isValid: valid,errorMessage: "لطفا کد را به صورت درست وارد کنید" },
    //       })
    //     }
    //     }
    //     keyboardType="number-pad"
    //     placeholder="کد تایید"
    //   />
    //   {(!state.code.isValid && isSubmit) && (
    //     <Text style={styles.errorText}>{state.code.errorMessage}</Text>
    //   )}
    //   {/* {props.new_user ? (<TextInput
    //       style={styles.inputText}
    //       value={state.name.isValid}
    //       onChangeText={(text) =>{
    //         if(text == '')
    //           var valid = false;
    //         else
    //           var valid = true;
    //         dispatch({
    //           type: ON_INPUT_CHANGE,
    //           tag: "name",
    //           changeValue: { ...state["name"], value: text, isValid: valid },
    //         })}
    //       }
    //       placeholder="نام و نام خانوادگی"
    //     />) : null}
      
    //   {(!state.name.isValid && isSubmit && props.new_user) && (
    //     <Text style={styles.errorText}>{state.name.errorMessage}</Text>
    //   )}
    //    {props.new_user ? (<TextInput
    //     style={styles.inputText}
    //     value={state.invitationCode}
    //     onChangeText={(text) =>
    //       dispatch({
    //         type: ON_INPUT_CHANGE,
    //         tag: "invitationCode",
    //         changeValue: {
    //           ...state["invitationCode"],
    //           value: text,
    //           isValid: true,
    //         },
    //       })
    //     }
    //     placeholder="(اختیاری)کد معرف"
    //   />):null}
    //   {(!state.invitationCode.isValid && props.new_user) && (
    //     <Text style={styles.errorText}>
    //       {state.invitationCode.errorMessage}
    //     </Text>
    //   )} */}
    //   <TouchableOpacity style={styles.loginBtn} onPress={() => verifyCode()}>
    //     <Text style={{ color: "#fff", fontSize: 20 }}>ورود</Text>
    //   </TouchableOpacity>
    //   <TouchableOpacity style={styles.loginBtn}>
    //     <Text style={{ color: "#fff", fontSize: 20 }}>
    //       دریافت کد جدید
    //     </Text>
    //   </TouchableOpacity>
    // </View>
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
          تایید شماره موبایل
         </Text>
      </View>
      <View style={styles.formGroup}>
        <Text style={{color:'#444',fontSize:14,marginBottom:6,fontFamily:'Vazir',}}>کد ارسال شده به شماره {user.mobile} را وارد کنید.</Text>
        <CodeField
        ref={ref}
        {...properties}
        caretHidden={false}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
      </View>
      <View style={styles.formGroup}>
      <TouchableOpacity style={[styles.loginBtn,{opacity:continueBottonOpacity}]} onPress={() => verifyCode()} disabled={continueBottonDissable}>
        <Text style={{ color: "#fff", fontSize: 20,fontFamily:'Vazir' }}>
           {verifing ? 'لطفا صبر کنید...' : 'ادامه'}
        </Text>
      </TouchableOpacity>
      </View>
      
      <View style={{
          height:30,
          width:'80%',
          display:'flex',
          flexDirection:'row-reverse',
          alignItems:"flex-end",
          justifyContent:'flex-start'
      }}>
      <Text style={{
        fontSize:14,
        fontFamily:'Vazir',
        color:'#444'
        }}>کد تایید را دریافت نکرده اید؟ </Text>
      {!sending ? (
      time <= 0 ?
          <TouchableOpacity
            style={{
               paddingHorizontal:2,
            }}
          >
            <Text style={{
            fontSize:13,
            fontFamily:'Vazir',
            color:'#4682B4',
            textDecorationLine:'underline',
            textDecorationStyle:'solid',
          }}
            onPress={() => resendCode()}
          >ارسال مجدد</Text>
          </TouchableOpacity>
        : 
          <Text style={{
             paddingHorizontal:2,
             fontSize:13,
             fontFamily:'Vazir',
             color:'#4682B4',
          }}>{parseInt(time/60)}:{time % 60 < 10 ? 0 : null}{time % 60}</Text>
        )
      :
       <View style={{paddingHorizontal:22}}>
          <Spinner size={20} width={2} color={'#4682B4'} />
        </View>
        
      }
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
};

export default VerifyCode;
const styles = StyleSheet.create({
  formGroup:{
    height:90,
    width:'80%',
    display:'flex',
    alignItems:"flex-end",
    justifyContent:'center'
  },
  loginBtn: {
    marginTop:5,
    width:'100%',
    alignItems:'center',
    paddingTop: 9,
    paddingBottom: 17,
    paddingHorizontal: 30,
    backgroundColor: "#220c5c",
    borderRadius: 10,
    borderColor: "#2e0066",
    borderWidth: 1,
  },
  inputText: {
    marginTop: 40,
    height: 50,
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#220c5c",
    paddingEnd: 10,
    paddingStart: 10,
    color: "#220c5c",
    fontFamily: "Vazir",
    fontSize: 24,
    textAlign: "center",
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
    height: Dimensions.get('window').height,
  },
  errorText: {
    textAlign: "center",
    color: "red",
  },
  root: {flex: 1},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {
    marginTop: 5,
    width:'100%',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',

  },
  cell: {
    width: 70,
    height: 50,
    paddingTop:5,
    borderRadius:10,
    lineHeight: 38,
    marginLeft:5,
    marginRight:5,
    fontSize: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },
});
