import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("english1.db");
const GrammarList = (props) => {
  const [lessons, setLessons] = useState([
    { id: 1, title: "" },
    { id: 2, title: "" },
    { id: 3, title: "" },
    { id: 4, title: "" },
    { id: 5, title: "" },
    { id: 6, title: "" },
    { id: 7, title: "" },
    { id: 8, title: "" },
    { id: 9, title: "" },
    { id: 10, title: "" },
    { id: 11, title: "" },
  ]);
  const showLessons = () => {
    return lessons.map((item) => {
      return (
        <Lesson
          key={item.id}
          id={item.id}
          title={item.title}
          navigation={props.navigation}
        />
      );
    });
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM grammars`,
        null,
        (txObj, resultSet) => setLessons([...resultSet.rows._array]),
        (error) => console.log(error)
      );
    });
  }, []);
  return (
    <ScrollView style={styles.page}>
      <View style={styles.container}>
         {showLessons()}
      </View>
    </ScrollView>
  );
};

const Lesson = (props) => {
  return (
    <Pressable
       onPress={() =>
         props.navigation.navigate("Grammar", {
            id: props.id,
            title:props.title
         })
        }
    >
        <View style={styles.box}>
         <Text style={styles.text}>{props.title}</Text>
        </View>
    </Pressable>
  );
};

export default GrammarList;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#220c5c",
  },
  container: {
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
