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
import ProgressCircle from '../components/CircleProgress'
const PassageTestResult = (props) => {
  const readings = props.route.params.readings;
  var countQuestions = 0;
  for(var key in readings)
  {
    countQuestions+=readings[key].questions.length;
  }
  const [result,setResult] = useState(0);
  const animated = new Animated.Value(1);
  var trueAnswer = 0;
  var falseAnswer = 0;
  var emptyAnswer = 0;
  console.log("count questions : ",countQuestions);
  for(var key in readings)
  {
    var reading = readings[key];
    for(var key in reading.questions)
    {
       var question = reading.questions[key];
       if (question.chose != null) {
         if (question.chose == question.trueAnswer) trueAnswer++;
         else falseAnswer++;
       } else emptyAnswer++;
    }
  }

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
    var result = ((trueAnswer * 3 - falseAnswer) / (countQuestions * 3)) * 100;
    result = result.toFixed(2);
    setResult(result);
  },[]);
  const color = result > 0 ? "#009200" : "#f44336";
  return (
    <View style={styles.container}>
      <View style={styles.result}>
        <ProgressCircle
          value={result > 0 ? result / 100 : result / -100}
          size={200}
          thickness={15}
          color={color}
          style={{ marginBottom: 50 }}
          unfilledColor="#f2f2f2"
          animationMethod="timing"
          animationConfig={{ speed: 1 }}
        >
          <Text style={{ color: color, fontSize: 28, fontWeight: "bold" }}>
            {`${result}%`}
          </Text>
        </ProgressCircle>
        <View style={styles.resultInfo}>
          <Text style={styles.text}>درست : {trueAnswer}</Text>
          <FontAwesome name="check" size={30} color={"#009200"} />
        </View>
        <View style={styles.resultInfo}>
          <Text style={styles.text}>نادرست : {falseAnswer}</Text>
          <FontAwesome name="close" size={30} color={"#f44336"} />
        </View>
        <View style={styles.resultInfo}>
          <Text style={styles.text}>بی پاسخ : {emptyAnswer}</Text>
          <FontAwesome name="circle-o" size={30} color={"#000"} />
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.answer}>
          <Pressable
            style={styles.answerButton}
            onPressIn={fadeIn}
            onPressOut={fadeOut}
            onPress={() =>
              props.navigation.navigate("PassageTestAnswerSheet", {
                readings: readings,
              })
            }
          >
            <Animated.View
              style={{
                opacity: animated,
                width: "100%",
                backgroundColor: "#220c5c",
                alignItems: "center",
                padding: 20,
              }}
            >
              <Text style={styles.answerButtonText}>پاسخنامه تشریحی</Text>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default PassageTestResult;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height:'100%',
    flexDirection: "column",
    backgroundColor:'#fff'
  },
  footer:{
     display:'flex',
     justifyContent:'center',
     alignItems:'center'
  },
  answer: {
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 8,
    marginBottom: 8,
    width:'98%',
    overflow: "hidden",
    borderRadius: 10,
  },
  answerButton: {
    width: "100%",
  },
  answerButtonText: {
    fontFamily: "Vazir",
    fontSize: 18,
    color: "#fff",
  },
  result: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop:40,
    flex:1,
  },
  resultInfo: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 18,
  },
  text: {
    fontSize: 20,
    marginTop: -2,
    marginRight: 5,
    color: "#220c5c",
    fontFamily: "Vazir",
  },
});
