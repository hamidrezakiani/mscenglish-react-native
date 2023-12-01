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
const WordTestAnswerSheet = (props) => {
  const questions = props.route.params.questions;
  const test_id = props.route.params.test_id;
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
  const alphabet = ["A", "B", "C", "D"];
  const alephba = ["الف", "ب", "ج", "د"];
  const showQuestions = () => {
    return questions.map((item, index) => {
      return (
        <View style={styles.test} key={index}>
          <View style={styles.box}>
            <Text style={styles.question}>
              {++index}.{item.question}
            </Text>
            <Text style={styles.question}>
                    {item.text}
                  </Text>
            <Text style={styles.question_fa}>{item.translate}</Text>
          </View>
          {item.answers.map((answer, answerIndex) => {
                  if (
                    answerIndex == item.chose &&
                    item.chose == item.trueAnswer
                  )
                    var styleClass = [styles.box, styles.trueAnswer];
                  else if (
                    answerIndex == item.chose &&
                    item.chose != item.trueAnswer
                  )
                    var styleClass = [styles.box, styles.falseAnswer];
                  else if (answerIndex == item.trueAnswer)
                    var styleClass = [styles.box, styles.noAnswer];
                  else var styleClass = [styles.box];
                  return (
                    <View style={styleClass} key={answer.id}>
                      <Text style={styles.answer}>
                        {alphabet[answerIndex]}.{answer.text}
                      </Text>
                      <Text style={styles.answer_fa}>{answer.translate}</Text>
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
              props.navigation.navigate("VTestSection", {
                questions: questions,
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
              <Text style={styles.endTestButtonText}>بازگشت به آزمون ها</Text>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default WordTestAnswerSheet;

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
  question: {
    fontWeight: "600",
    fontSize: 20,
    textAlign: "left",
    width: "100%",
    color:'#222'
  },
  question_fa: {
    fontWeight: "600",
    fontSize: 18,
    textAlign: "right",
    fontFamily: "Vazir",
    width: "100%",
    color:'#222'
  },
  answer: {
    fontSize: 14,
    textAlign: "left",
    width: "100%",
    color:'#222'
  },
  answer_fa: {
    fontSize: 14,
    textAlign: "right",
    width: "100%",
    fontFamily: "Vazir",
    color:'#222'
  },
  box: {
    backgroundColor: "#fff",
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
  trueAnswer: {
    backgroundColor: "#009200",
  },
  falseAnswer: {
    backgroundColor: "#c34336",
  },
  noAnswer: {
    backgroundColor: "#80cc80",
  },
});
