import React, { useState, useEffect } from "react";
import { Text,TextInput,Button, View, StyleSheet, useWindowDimensions } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import * as SQLite from "expo-sqlite";
import RenderHtml from "react-native-render-html";
import { ScrollView } from "react-native-gesture-handler";
const db = SQLite.openDatabase("english1.db");
const Messages = (props) => {

  const { width } = useWindowDimensions();
  const [messages,setMessages] = useState([]);
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM messages ORDER BY id DESC",
        null,
        (txObj, resultSet) => {
          console.log(resultSet.rows._array);
          setMessages([...resultSet.rows._array]);
        },
        (txObj, error) => console.log(error)
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE messages SET read=1`,
        null,
        (txObj, resultSet) => {
        },
        (txObj, error) => console.log(error)
      );
    });

  }, []);
    const showMessages = () => {
      return messages.map((message,index) => {
          console.log(message.title)
          return (
            <View style={styles.box}>
              <Text style={{fontFamily:'Vazir',marginBottom:15}}>{message.title}</Text>
              <RenderHtml source={{ html: message.text }} contentWidth={width} />
            </View>
          );
      });
    }
    return (
      <ScrollView
        style={{
          backgroundColor: "#220c5c",
        }}
      >
        <View style={styles.container}>{showMessages()}</View>
      </ScrollView>
    );
};

export default Messages;
const styles = StyleSheet.create({
  container: {
    display:'flex',
    flexDirection:'column',
    paddingTop: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-between",
    margin: 8,
  },
  box: {
    backgroundColor: "white",
    flex:1,
    marginTop: 8,
    marginStart: 6,
    marginEnd: 6,
    padding: 20,
    borderColor: "navy",
    borderWidth: 1,
    borderRadius: 10,
  },
});
