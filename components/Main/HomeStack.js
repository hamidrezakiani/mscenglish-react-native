import React,{ useState } from "react";
import {Text, Pressable } from "react-native";
import { Feather ,Ionicons} from "@expo/vector-icons";
import Home from "../../pages/Home";
import WordTab from "./WordTab";
import Messages from "../../pages/Messages";
import Words from "../../pages/Words";
import WordTestTutorial from "../../pages/WordTestTutorial";
import PTestSection from "../../pages/PTestSection";
import PassageTest from "../../pages/PassageTest";
import PassageTestTutorial from "../../pages/PassageTestTutorial";
import WordTest from "../../pages/WordTest";
import PassageTestResult from "../../pages/PassageTestResult";
import WordTestResult from "../../pages/WordTestResult";
import WordTestAnswerSheet from "../../pages/WordTestAnswerSheet";
import PassageTestAnswerSheet from "../../pages/PassageTestAnswerSheet";
import Bookmarks from "../../pages/Bookmarks";
import SimilarWords from "../../pages/SimilarWords";
import GrammarList from "../../pages/GrammarList";
import Grammar from "../../pages/Grammar";
import Planning from "../../pages/Planning";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
const HomeStack = (props) => {
    const navigation = props.navigation;
    const [wordPage, setWordPage] = useState(1);
    const [wordTestTitle, setWordTestTitle] = useState('');
    const [grammarTitle, setGrammarTitle] = useState('');
    const [passageTestTitle, setPassageTestTitle] = useState('');
    const [newMessagesCount, setNewMessagesCount] = useState(0);
    const [user,setUser] = useState(props.route.params.user);
    console.log('home stack',user);
    // const db = new Db();
    // db.getMessages({ setNewMessagesCount: (value) => setNewMessagesCount(value) });
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#220c5c",
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: "white",
            fontFamily: "Vazir",
          },
          headerTintColor: "white",
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          initialParams={{ getUserProfile:() => props.route.params.getUserProfile(),user:user}}
          options={{
            headerTitle: () => <Text></Text>,
            headerLeft: () => (
              <Pressable onPress={() => navigation.openDrawer()}>
                <Ionicons name="menu-outline" size={40} color="white" />
              </Pressable>
            ),
            headerRight: () => (
              <Pressable
                style={{ display: "flex", flexDirection: "row" }}
                onPress={() => navigation.navigate("Messages")}
              >
                <Feather name="mail" size={30} color="white" />
                {newMessagesCount != 0 ? (
                  <Text
                    style={{
                      marginTop: 12,
                      marginLeft: -10,
                      backgroundColor: "#009200",
                      color: "#fff",
                      paddingLeft: 7,
                      paddingBottom: 2,
                      paddingRight: 7,
                      borderRadius: 10,
                    }}
                  >
                    {newMessagesCount}
                  </Text>
                ) : null}
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="Messages"
          component={Messages}
          options={{ headerTitle: "پیام ها" }}
        />
        <Stack.Screen
          name="WordTab"
          component={WordTab}
          options={{ headerTitle: "لغات" }}
        />
        <Stack.Screen
          name="Words"
          component={Words}
          options={{ headerTitle: "لغات" }}
  
        // initialParams={{ setWordPage:(value) => setWordPage(value)}}
        />
        <Stack.Screen
          name="WordTestTutorial"
          component={WordTestTutorial}
          options={{ headerTitle: "آموزش حل تست" }}
        />
        <Stack.Screen
          name="PTestSection"
          component={PTestSection}
          options={{ headerTitle: "متن" }}
        />
        <Stack.Screen
          name="PassageTest"
          component={PassageTest}
          options={{ headerTitle: passageTestTitle }}
          initialParams={{
            setPassageTestTitle: (value) => setPassageTestTitle(value),
          }}
        />
        <Stack.Screen
          name="PassageTestTutorial"
          component={PassageTestTutorial}
          options={{ headerTitle: "آموزش حل تست" }}
        />
        <Stack.Screen
          name="WordTest"
          component={WordTest}
          options={{ headerTitle: wordTestTitle }}
          initialParams={{ setWordTestTitle: (value) => setWordTestTitle(value) }}
        />
        <Stack.Screen
          name="PassageTestResult"
          component={PassageTestResult}
          options={{ headerTitle: "نتیجه آزمون" }}
        />
        <Stack.Screen
          name="WordTestResult"
          component={WordTestResult}
          options={{ headerTitle: "نتیجه آزمون" }}
        />
        <Stack.Screen
          name="WordTestAnswerSheet"
          component={WordTestAnswerSheet}
          options={{ headerTitle: "پاسخنامه تشریحی" }}
        />
        <Stack.Screen
          name="PassageTestAnswerSheet"
          component={PassageTestAnswerSheet}
          options={{ headerTitle: "پاسخنامه تشریحی" }}
        />
        <Stack.Screen
          name="Bookmark"
          component={Bookmarks}
          options={{ headerTitle: "کلمات برگزیده" }}
  
        // initialParams={{ setWordPage:(value) => setWordPage(value)}}
        />
        <Stack.Screen
          name="SimilarWords"
          component={SimilarWords}
          options={{ headerTitle: "کلمات مشابه" }}
  
        // initialParams={{ setWordPage:(value) => setWordPage(value)}}
        />
        <Stack.Screen
          name="GrammarList"
          component={GrammarList}
          options={{ headerTitle: "گرامر" }}
        />
        <Stack.Screen
          name="Grammar"
          component={Grammar}
          options={{ headerTitle: grammarTitle }}
          initialParams={{ setGrammarTitle: (value) => setGrammarTitle(value) }}
        />
        <Stack.Screen
          name="Planning"
          component={Planning}
          options={{ headerTitle: "برنامه ریزی" }}
        />
      </Stack.Navigator>
    );
  }

  export default HomeStack;