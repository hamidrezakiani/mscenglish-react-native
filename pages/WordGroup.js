import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import * as SQLite from "expo-sqlite";
import { Dimensions } from "react-native";
const db = SQLite.openDatabase("english1.db");
const WordGroup = (props) => {
   const [page, setPage] = useState(1);
   const [countPage,setCountPage] = useState(1);
   const [countBookmarkPage,setCountBookmarkPage] = useState(1);
   const [bookmarkPage, setBookmarkPage] = useState(1);
   const [countSimilarPage, setCountSimilarPage] = useState(1);
   const [similarPage, setSimilarPage] = useState(1);
   const countWord = Dimensions.get("window").height > 750 ? 5 : 4;
   db.transaction((tx) => {
     tx.executeSql(
       `SELECT COUNT(id) FROM words`,
       null,
       (txObj, resultSet) => {
         setCountPage(Math.ceil(resultSet.rows._array[0]["COUNT(id)"] / countWord));
       },
       (error) => console.log(error)
     );
   });

    db.transaction((tx) => {
      tx.executeSql(
        `SELECT COUNT(id) FROM words WHERE bookmark=1`,
        null,
        (txObj, resultSet) => {
          setCountBookmarkPage(Math.ceil(resultSet.rows._array[0]["COUNT(id)"] / 5));
        },
        (error) => console.log(error)
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        `SELECT COUNT(id) FROM similar_words`,
        null,
        (txObj, resultSet) => {
          setCountSimilarPage(
            Math.ceil(resultSet.rows._array[0]["COUNT(id)"] / 9)
          );
        },
        (error) => console.log(error)
      );
    });

   db.transaction((tx) => {
     tx.executeSql(
       `SELECT * FROM other WHERE key='current_page'`,
       null,
       (txObj, resultSet) => {
        //  console.log(resultSet.rows._array[0].value);
         setPage(resultSet.rows._array[0].value);
       },
       (error) => console.log(error)
     );
   });

   db.transaction((tx) => {
     tx.executeSql(
       `SELECT * FROM other WHERE key='current_bookmark_page'`,
       null,
       (txObj, resultSet) => {
         setBookmarkPage(resultSet.rows._array[0].value);
       },
       (error) => console.log(error)
     );
   });

   db.transaction((tx) => {
     tx.executeSql(
       `SELECT * FROM other WHERE key='current_similar_page'`,
       null,
       (txObj, resultSet) => {
         setSimilarPage(resultSet.rows._array[0].value);
       },
       (error) => console.log(error)
     );
   });
  useEffect(() => {

  }, []);
  return (
    <ScrollView style={styles.page}>
      <View style={styles.container}>
        <Pressable
          onPress={() =>
            // props.navigation.navigate("Words")
            props.navigation.navigate("Words", {
              page: page,
              countPage: countPage,
              setPage: (value) => setPage(value),
            })
          }
        >
          <View style={styles.box}>
            <Text style={styles.text}>لغات</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() =>
              props.navigation.navigate("SimilarWords", {
              page: similarPage,
              countPage: countSimilarPage,
              setPage: (value) => setSimilarPage(value),
            })
          }
        >
          <View style={styles.box}>
            <Text style={styles.text}>لغات مشابه</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() =>
            props.navigation.navigate("Bookmark", {
              page: bookmarkPage,
              countBookmarkPage: countBookmarkPage,
              setCountBookmarkPage: (value) => setCountBookmarkPage(value),
              setPage: (value) => setBookmarkPage(value),
            })
          }
        >
          <View style={styles.box}>
            <Text style={styles.text}>لغات برگزیده</Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const Lesson = (props) => {
  return (
    <Pressable
      style={styles.lessonbox}
      onPress={() =>
        // props.navigation.navigate("Words")
        props.navigation.navigate("Words", { lesson: props.lesson })
      }
    >
      <View style={styles.lesson}>
        <Text style={styles.text}>{props.text}</Text>
      </View>
    </Pressable>
  );
};

export default WordGroup;

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
  },
});
