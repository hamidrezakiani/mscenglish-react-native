import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Animated,
  Pressable,
  useWindowDimensions,
} from "react-native";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("english1.db");
import { FontAwesome } from "@expo/vector-icons";
import { color } from "react-native-reanimated";
import RenderHtml from "react-native-render-html";
const PassageTest = (props) => {
  const { width } = useWindowDimensions();
  const [readings, setReadings] = useState([]);
  const test_id = props.route.params.test_id;
  props.route.params.setPassageTestTitle(props.route.params.title);
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
        `SELECT
           readings.text as reading_text,
           readings.translate as reading_translate,
           readings.orderIndex as reading_orderIndex,
           reading_questions.reading_id,
           reading_questions.question as question_text,
           reading_questions.translate as question_translate,
           reading_questions.solve as question_solve,
           reading_questions.orderIndex as question_orderIndex,
           reading_answers.id,reading_answers.question_id,
           reading_answers.text as answer_text,
           reading_answers.translate as answer_translate,
           reading_answers.status
            FROM readings
              JOIN reading_questions ON readings.id = reading_questions.reading_id
              JOIN reading_answers ON reading_questions.id = reading_answers.question_id
              WHERE test_id=${test_id}`,
        null,
        (txObj, resultSet) => {
          var result = [...resultSet.rows._array];
          // console.log(result);
          var lastReading_id = 0;
          var lastQuestion_id = 0;
          var readingCounter = -1;
          var questionCounter = -1;
          var answerCounter = -1;
          var orderedArray = [];
          for (const [key, value] of Object.entries(result)) {
            if (lastReading_id != value.reading_id) {
              lastReading_id = value.reading_id;
              readingCounter++;
              questionCounter=-1;
              orderedArray[readingCounter] = {};
              orderedArray[readingCounter].id = value.reading_id;
              orderedArray[readingCounter].text = value.reading_text;
              orderedArray[readingCounter].translate = value.reading_translate;
              orderedArray[readingCounter].orderIndex = value.reading_orderIndex;
              orderedArray[readingCounter].questions = [];
            }
            if(lastQuestion_id != value.question_id)
            {
              lastQuestion_id = value.question_id;
              questionCounter++;
              answerCounter=-1;
              orderedArray[readingCounter].questions[questionCounter] = {};
              orderedArray[readingCounter].questions[questionCounter].id = value.question_id;
              orderedArray[readingCounter].questions[questionCounter].text = value.question_text;
              orderedArray[readingCounter].questions[questionCounter].translate = value.question_translate;
              orderedArray[readingCounter].questions[questionCounter].solve = value.question_solve;
              orderedArray[readingCounter].questions[questionCounter].orderIndex = value.question_orderIndex;
              orderedArray[readingCounter].questions[questionCounter].chose = null;
              orderedArray[readingCounter].questions[questionCounter].answers = [];
            }
            answerCounter++;
            orderedArray[readingCounter].questions[questionCounter].answers[answerCounter] = {};
            orderedArray[readingCounter].questions[questionCounter].answers[answerCounter].id = value.id;
            orderedArray[readingCounter].questions[questionCounter].answers[answerCounter].text = value.answer_text;
            orderedArray[readingCounter].questions[questionCounter].answers[answerCounter].translate = value.answer_translate;
            if (value.status == 1)
              orderedArray[readingCounter].questions[questionCounter].trueAnswer = answerCounter;
          }
          setReadings(orderedArray);
          console.log(orderedArray);
        },
        (error) => console.log(error)
      );
    });
  }, []);
  const alphabet = [
    'A','B','C','D'
  ]
  const choseAnswer = (readingIndex,questionIndex,answerIndex) => {
     var newReading = [...readings];
     if (newReading[readingIndex].questions[questionIndex].chose == answerIndex)
        newReading[readingIndex].questions[questionIndex].chose = null;
     else newReading[readingIndex].questions[questionIndex].chose = answerIndex;
     setReadings(newReading);
  }
  var questionNumber = 0;
  const showReadings = () => {
    return readings.map((reading, index) => {
      return (
        <View style={styles.test} key={index}>
          <View style={[styles.box,{padding:14}]}>
            <Text style={styles.reading}>passage {index + 1} :</Text>
            <RenderHtml contentWidth={width} source={{ html: reading.text }} />
          </View>
          {reading.questions.map((question, questionIndex) => {
            return (
              <View style={styles.test}>
                <View style={styles.box} key={questionIndex}>
                  <Text style={styles.question}>
                    {++questionNumber}.{question.text}
                  </Text>
                </View>
                {question.answers.map((answer, answerIndex) => {
                  if (answerIndex == question.chose)
                    var styleClass = [styles.box, styles.selectedBox];
                  else var styleClass = [styles.box];
                  return (
                    <View style={styleClass} key={answer.id}>
                      <Pressable
                        style={styles.answer}
                        onPress={() => choseAnswer(index,questionIndex, answerIndex)}
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
        {showReadings()}
        <View style={styles.endTest}>
          <Pressable
            style={styles.endTestButton}
            onPressIn={fadeIn}
            onPressOut={fadeOut}
            onPress={() =>
              props.navigation.navigate("PassageTestResult", {
                readings: readings,
              })
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

export default PassageTest;

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
    marginBottom: 8,
    marginStart: 4,
    marginEnd: 4,
    overflow: "hidden",
    flex: 1,
    borderColor: "navy",
    borderWidth: 1,
    borderRadius: 10,
  },
  endTestButton: {
    width: "100%",
  },
  endTestButtonText: {
    fontFamily: "Vazir",
    fontSize: 18,
    color: "#fff",
  },
  reading: {
    fontWeight: "600",
    fontSize: 18,
    textAlign: "left",
    width: "100%",
  },
  question: {
    fontWeight: "600",
    fontSize: 18,
    padding:18,
    textAlign: "left",
    width: "100%",
  },
  answer: {
    fontSize: 14,
    textAlign: "left",
    width: "100%",
    padding:18
  },
  box: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginStart: 4,
    marginEnd: 4,
    flex: 1,
    borderColor: "navy",
    borderWidth: 1,
    borderRadius: 10,
    overflow:'hidden'
  },
  selectedBox: {
    backgroundColor: "#e1c699",
  },
});
