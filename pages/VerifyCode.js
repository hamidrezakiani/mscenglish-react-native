import React, { useState, useReducer,useEffect } from "react";
import {View,Button,Text,StyleSheet,TouchableOpacity,TextInput,Alert,} from "react-native";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
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
  const [code, onCodeChange] = useState();
  const [name, onNameChange] = useState("");
  const [isSubmit,setisSubmit] = useState(false);
  const [invitationCode, onInvitationCodeChange] = useState();
  const [verifyApiErrors, setVerifyApiErrors] = useState([]);
  const {user,setUser,setUserData} = useContext(AppContext);
  useEffect(() => {
    verifyApiErrors.forEach((element) => {
      dispatch({
        type: ON_INPUT_CHANGE,
        tag: element.key,
        changeValue: {
          ...state[element.key],
          isValid: false,
          errorMessage: element.value,
        },
      });
      console.log(element.key);
      console.log(element.value);
    });
    }, [verifyApiErrors.errors]);
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
    if (state.code.isValid)
      verifyCode2(
        state.name.value,
        state.code.value,
        state.invitationCode.value
      );
  };
  const verifyCode2 = (name, code, invitationCode) => {
    console.log("request sent");
    fetch(`http://mscenglish.ir/api/verify?mobile=${user.mobile}&name=${name}&code=${code}&invitationCode=${invitationCode}`, {
      method: "POST",
      //Request Type
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success
        if (responseJson.status['code'] == 200) {
          setUserData({
            name: responseJson.data.name,
            mobile: user.mobile,
            token: responseJson.data.api_token,
            verify: true,
            new_user: parseInt(responseJson.data.new_user),
            payStatus: parseInt(responseJson.data.payStatus)
          });
          setUser({
            name: responseJson.data.name,
            mobile: user.mobile,
            token: responseJson.data.api_token,
            verify: true,
            new_user: parseInt(responseJson.data.new_user),
            payStatus: parseInt(responseJson.data.payStatus)
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
        console.error(error);
      });
  };
  const label = "کد تایید را وارد کنید";
  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 50, fontSize: 22, fontFamily: "Vazir" }}>
        {label}
      </Text>
      <TextInput
        style={styles.inputText}
        value={state.code.value}
        onChangeText={(text) => {
          if (text.length != 4)
            var valid = false;
          else
            var valid = true;
          dispatch({
            type: ON_INPUT_CHANGE,
            tag: "code",
            changeValue: { ...state["code"], value: text, isValid: valid,errorMessage: "لطفا کد را به صورت درست وارد کنید" },
          })
        }
        }
        keyboardType="number-pad"
        placeholder="کد تایید"
      />
      {(!state.code.isValid && isSubmit) && (
        <Text style={styles.errorText}>{state.code.errorMessage}</Text>
      )}
      {/* {props.new_user ? (<TextInput
          style={styles.inputText}
          value={state.name.isValid}
          onChangeText={(text) =>{
            if(text == '')
              var valid = false;
            else
              var valid = true;
            dispatch({
              type: ON_INPUT_CHANGE,
              tag: "name",
              changeValue: { ...state["name"], value: text, isValid: valid },
            })}
          }
          placeholder="نام و نام خانوادگی"
        />) : null}
      
      {(!state.name.isValid && isSubmit && props.new_user) && (
        <Text style={styles.errorText}>{state.name.errorMessage}</Text>
      )}
       {props.new_user ? (<TextInput
        style={styles.inputText}
        value={state.invitationCode}
        onChangeText={(text) =>
          dispatch({
            type: ON_INPUT_CHANGE,
            tag: "invitationCode",
            changeValue: {
              ...state["invitationCode"],
              value: text,
              isValid: true,
            },
          })
        }
        placeholder="(اختیاری)کد معرف"
      />):null}
      {(!state.invitationCode.isValid && props.new_user) && (
        <Text style={styles.errorText}>
          {state.invitationCode.errorMessage}
        </Text>
      )} */}
      <TouchableOpacity style={styles.loginBtn} onPress={() => verifyCode()}>
        <Text style={{ color: "#fff", fontSize: 20 }}>ورود</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn}>
        <Text style={{ color: "#fff", fontSize: 20 }}>
          دریافت کد جدید
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerifyCode;
const styles = StyleSheet.create({
  loginBtn: {
    marginTop: 50,
    paddingTop: 6,
    paddingBottom: 10,
    paddingHorizontal: 30,
    backgroundColor: "#220c5c",
    borderRadius: 10,
    borderColor: "#2e0066",
    borderWidth: 1,
  },
  inputText: {
    marginTop: 40,
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
    fontSize: 24,
    textAlign: "center",
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
  },
  errorText: {
    textAlign: "center",
    color: "red",
  },
});
