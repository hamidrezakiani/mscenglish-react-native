import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Animated,
  Pressable,
} from "react-native";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("english1.db");
import { FontAwesome } from "@expo/vector-icons";
import { color } from "react-native-reanimated";
const WordTest = (props) => {
  const [questions, setQuestions] = useState([]);
  const test_id = props.route.params.test_id;
  props.route.params.setWordTestTitle(props.route.params.title);
  const animated = new Animated.Value(1);
  const fadeIn = () => {
    Animated.timing(animated, {
      toValue: 0.5,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT word_questions.question,word_questions.translate as question_translate,word_answers.status,word_answers.translate,word_answers.id,word_answers.text,word_answers.question_id FROM word_questions JOIN word_answers ON word_questions.id = word_answers.question_id WHERE test_id=${test_id}`,
        null,
        (txObj, resultSet) => {
          var result = [...resultSet.rows._array];
          var orderedArray = [];
          for (const [key, value] of Object.entries(result)) {
            if (key % 4 == 0) {
              orderedArray[parseInt(key / 4)] = {};
              orderedArray[parseInt(key / 4)].id = value.question_id;
              orderedArray[parseInt(key / 4)].question = value.question;
              orderedArray[parseInt(key / 4)].translate = value.question_translate;
              orderedArray[parseInt(key / 4)].answers = [];
            }
            orderedArray[parseInt(key / 4)].answers[key % 4] = {};
            orderedArray[parseInt(key / 4)].chose = null;
            if (value.status == 1)
              orderedArray[parseInt(key / 4)].trueAnswer = key % 4;
            orderedArray[parseInt(key / 4)].answers[key % 4].id = value.id;
            orderedArray[parseInt(key / 4)].answers[key % 4].text = value.text;
            orderedArray[parseInt(key / 4)].answers[key % 4].translate = value.translate;
            orderedArray[parseInt(key / 4)].answers[key % 4].status =
              value.status;
          }
          setQuestions(orderedArray);
          console.log(orderedArray);
        },
        (error) => console.log(error)
      );
    });
  }, []);
  const alphabet = [
    'A','B','C','D'
  ]
  const choseAnswer = (questionIndex,answerIndex) => {
     var newQuestions = [...questions];
     if (newQuestions[questionIndex].chose == answerIndex)
        newQuestions[questionIndex].chose = null;
     else
       newQuestions[questionIndex].chose = answerIndex;
     setQuestions(newQuestions);
  }
  console.log(questions);
  const showQuestions = () => {
    return questions.map((item, index) => {
      return (
        <View style={styles.test} key={index}>
          <View style={styles.box}>
            <Text style={styles.question}>
              {index + 1}.{item.question}
            </Text>
          </View>
          {item.answers.map((answer,answerIndex) => {
            if (answerIndex == item.chose)
              var styleClass = [styles.box, styles.selectedBox];
            else var styleClass = [styles.box];
             return (
               <View style={styleClass} key={answer.id}>
                 <Pressable
                   style={styles.answer}
                   onPress={() => choseAnswer(index, answerIndex)}
                 >
                   <Text>
                     {alphabet[answerIndex]}.{answer.text}
                   </Text>
                 </Pressable>
               </View>
             );
          })}
        </View>
      );
    });
  };

  return (
    <ScrollView
      style={{
        backgroundColor: "#220c5c",
      }}
    >
      <View style={styles.container}>
        {showQuestions()}
        <View style={styles.endTest}>
          <Pressable
            style={styles.endTestButton}
            onPressIn={fadeIn}
            onPressOut={fadeOut}
            onPress={() =>
              props.navigation.navigate("WordTestResult", { questions: questions })
            }
          >
            <Animated.View
              style={{
                opacity: animated,
                width: "100%",
                backgroundColor: "#009200",
                alignItems: "center",
                padding: 20,
              }}
            >
              <Text style={styles.endTestButtonText}>اتمام آزمون</Text>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default WordTest;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  endTest: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom:8,
    marginStart: 4,
    marginEnd: 4,
    overflow:'hidden',
    flex: 1,
    borderColor: "navy",
    borderWidth: 1,
    borderRadius: 10,
  },
  endTestButton: {
    width:'100%'
  },
  endTestButtonText: {
    fontFamily: "Vazir",
    fontSize:18,
    color:'#fff'
  },
  question: {
    fontWeight: "600",
    fontSize: 20,
    textAlign: "left",
    width: "100%",
  },
  answer: {
    fontWeight: "500",
    fontSize: 15,
    textAlign: "left",
    width: "100%",
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
  selectedBox: {
    backgroundColor: "#e1c699",
  }
});
