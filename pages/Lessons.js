import React,{useState,useEffect} from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("english1.db");
const Lessons = (props) => {
    const [countLesson, setCountLesson] = useState(60);
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM other WHERE key='total_lesson'",
        null,
        (txObj, resultSet) => {
          setCountLesson(resultSet.rows._array[0].value);
        },
        (txObj, error) => console.log(error)
      );
    });
  var lessonsArray = [];
  for(var i=1;i<=countLesson;i++)
  {
     lessonsArray.push({id:i,lesson:`${i}`})
  }
  console.log(lessonsArray);

  const showLessons = () =>{
    return lessonsArray.map(item => {
        return (<Lesson navigation={props.navigation} key={item.id} lesson={item.id} text={item.lesson} />);
    })
  }
  return (
    <ScrollView>
      <View style={styles.container}>{showLessons()}</View>
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

export default Lessons;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  lessonbox:{
    width:"25%"
  },
  lesson: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginStart: 4,
    marginEnd: 4,
    padding: 20,
    flex:1,
    borderColor: "navy",
    borderWidth: 1,
    borderRadius: 10,
  },
  text: {
    color: "navy",
    fontSize: 25,
  },
});