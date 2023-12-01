import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("english1.db");
import { FontAwesome } from "@expo/vector-icons";
import { color } from "react-native-reanimated";
const PTestSection = (props) => {

const [tests,setTests] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM reading_tests ORDER BY orderIndex`,
        null,
        (txObj, resultSet) => {
            setTests([...resultSet.rows._array]);
        },
        (error) => console.log(error)
      );
    });
  }, []);

  const showTest = () => {
    return tests.map((item, index) => {
      return (
        <Pressable
          key={item.id}
          onPress={() => props.navigation.navigate("PassageTest",{test_id:item.id,title:item.title})}
        >
          <View style={styles.box}>
            <Text style={styles.text}>{item.title}</Text>
          </View>
        </Pressable>
      );
    });
  }

  return (
    <ScrollView
      style={{
        backgroundColor: "#220c5c",
      }}
    >
      <View style={styles.container}>
        <Pressable
          onPress={() => props.navigation.navigate("PassageTestTutorial")}
        >
          <View style={styles.box}>
            <Text style={styles.text}>آموزش حل تست</Text>
          </View>
        </Pressable>
        {showTest()}
      </View>
    </ScrollView>
  );
};

export default PTestSection;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  box: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginStart: 4,
    marginEnd: 4,
    padding: 20,
    flex: 1,
    borderColor: "navy",
    borderWidth: 1,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    fontFamily: "Vazir",
    color:'#222'
  },
});
