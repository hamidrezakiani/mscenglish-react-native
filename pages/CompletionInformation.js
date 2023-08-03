import React, { useState, useReducer, useEffect } from "react";
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
    isValid: false,
    errorMessage: "لطفا نام خود را وارد کنید",
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
const CompletionInformation = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isSubmit, setisSubmit] = useState(false);
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
  const updateProfile = () => {
    setisSubmit(true);
    if (state.name.value == '') {
      dispatch({
        type: ON_INPUT_CHANGE,
        tag: "name",
        changeValue: { ...state["name"], isValid: false },
      });
    }
    else if (state.name.isValid)
      props.updateProfile(
        state.name.value,
        state.invitationCode.value
      );
  };
  const label = "اطلاعات را تکمیل کنید";
  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 50, fontSize: 22, fontFamily: "Vazir" }}>
        {label}
      </Text>
      <TextInput
        style={styles.inputText}
        value={state.name.isValid}
        onChangeText={(text) => {
          if (text == '')
            var valid = false;
          else
            var valid = true;
          dispatch({
            type: ON_INPUT_CHANGE,
            tag: "name",
            changeValue: { ...state["name"], value: text, isValid: valid },
          })
        }
        }
        placeholder="نام و نام خانوادگی"
      />

      {(!state.name.isValid && isSubmit) && (
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
      {(!state.invitationCode.isValid) && (
        <Text style={styles.errorText}>
          {state.invitationCode.errorMessage}
        </Text>
      )}
      <TouchableOpacity style={styles.loginBtn} onPress={() => updateProfile()}>
        <Text style={{ color: "#fff", fontSize: 20 }}>ادامه</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CompletionInformation;
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
