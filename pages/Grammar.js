import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("english1.db");
import { FontAwesome } from "@expo/vector-icons";
import { color } from "react-native-reanimated";
import { useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";
const Grammar = (props) => {
  const [text, setText] = useState("");
  const { width } = useWindowDimensions();
  props.route.params.setGrammarTitle(props.route.params.title);
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM grammars WHERE id=${props.route.params.id}`,
        [],
        (txObj, resultSet) => setText(resultSet.rows._array[0].text),
        (txObj, error) => console.log(error)
      );
    });
  }, []);

  return (
    <ScrollView style={styles.page}>
      <View style={styles.container}>
        <View style={styles.box}>
          <RenderHTML
            contentWidth={width}
            source={{
              html: text,
            }}
            tagsStyles={{ body: { fontFamily: "Vazir" } }}
            systemFonts={["Vazir"]}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Grammar;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#220c5c",
    paddingStart: 5,
    paddingEnd: 5,
    paddingTop: 20,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  box: {
    backgroundColor: "white",
    marginTop: 8,
    marginStart: 4,
    marginEnd: 4,
    padding: 20,
    flex: 1,
    borderColor: "navy",
    borderWidth: 1,
    borderRadius: 10,
  },
});
