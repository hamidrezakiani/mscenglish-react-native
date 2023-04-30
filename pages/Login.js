import React,{useState} from "react";
import {View, Button,Text ,StyleSheet,TouchableOpacity,TextInput,Alert} from "react-native";

const Login = props => {
    const [phoneNumber,onPhoneNumberChange] = useState();
    const login = () => {
        const firstChar = Array.from(phoneNumber)[0];
        if(firstChar != '0' || phoneNumber.length != 11)
          Alert.alert('خطا','لطفا شماره را به صورت درست وارد کنید.');
        else
          props.login(phoneNumber);

    }
    return (
      <View style={styles.container}>
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