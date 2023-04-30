import React, { useState, useReducer,useEffect } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
const initialState = {
  name: {
    value: "",
    isValid: true,
    errorMessage: "لطفا نام خود را وارد کنید",
  },
  code: {
    value: "",
    isValid: true,
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
  const [invitationCode, onInvitationCodeChange] = useState();
  useEffect(() => {
    props.errors.forEach((element) => {
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
    }, [props.errors]);
  const verifyCode = () => {
    if(state.name.value == '')
      dispatch({
        type: ON_INPUT_CHANGE,
        tag: "name",
        changeValue: { ...state["name"], isValid: false},
      });
    if (state.code.value.length != 4)
      dispatch({
        type: ON_INPUT_CHANGE,
        tag: "code",
        changeValue: { ...state["code"], isValid: false },
      });
    if (state.name.isValid && state.code.isValid)
      props.verifyCode(
        state.name.value,
        state.code.value,
        state.invitationCode.value
      );
  };

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 50, fontSize: 22, fontFamily: "Vazir" }}>
        اطلاعات را تکمیل کنید.
      </Text>
      <TextInput
        style={styles.inputText}
        value={state.code.value}
        onChangeText={(text) =>
          dispatch({
            type: ON_INPUT_CHANGE,
            tag: "code",
            changeValue: { ...state["code"], value: text, isValid: true },
          })
        }
        keyboardType="number-pad"
        placeholder="کد تایید"
      />
      {!state.code.isValid && (
        <Text style={styles.errorText}>{state.code.errorMessage}</Text>
      )}
      <TextInput
        style={styles.inputText}
        value={state.name.isValid}
        onChangeText={(text) =>
          dispatch({
            type: ON_INPUT_CHANGE,
            tag: "name",
            changeValue: { ...state["name"], value: text, isValid: true },
          })
        }
        placeholder="نام و نام خانوادگی"
      />
      {!state.name.isValid && (
        <Text style={styles.errorText}>{state.name.errorMessage}</Text>
      )}
      <TextInput
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
      />
      {!state.invitationCode.isValid && (
        <Text style={styles.errorText}>
          {state.invitationCode.errorMessage}
        </Text>
      )}
      <TouchableOpacity style={styles.loginBtn} onPress={() => verifyCode()}>
        <Text style={{ color: "#fff", fontSize: 20 }}>ورود</Text>
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
