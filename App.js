import React, { Fragment, useCallback, useEffect, useState } from "react";
import "react-native-gesture-handler";
import { Text,Button, I18nManager, Pressable, View, Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import * as Linking from "expo-linking"
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import Home from "./pages/Home";
import Words from "./pages/Words";
import SimilarWords from "./pages/SimilarWords";
import WordTestTutorial from "./pages/WordTestTutorial";
import PassageTestTutorial from "./pages/PassageTestTutorial";
import WordTest from "./pages/WordTest";
import PassageTest from "./pages/PassageTest";
import WordTestResult from "./pages/WordTestResult";
import PassageTestResult from "./pages/PassageTestResult";
import WordTestAnswerSheet from "./pages/WordTestAnswerSheet";
import PassageTestAnswerSheet from "./pages/PassageTestAnswerSheet";
import WordGroup from "./pages/WordGroup";
import Search from "./pages/Search";
import VTestSection from "./pages/VTestSection";
import PTestSection from "./pages/PTestSection";
import Bookmarks from "./pages/Bookmarks";
import Planning from "./pages/Planning";
import GrammarList from "./pages/GrammarList";
import Grammar from "./pages/Grammar";
import Messages from "./pages/Messages";
import Support from "./pages/Support";
import About from "./pages/About";
import Login from "./pages/Login";
import VerifyCode from "./pages/VerifyCode";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
const Db = require("./functions/db.js");
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const database = SQLite.openDatabase("english1.db");
const SupportStack = ({navigation}) => {
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
        name="Support"
        component={Support}
        options={{
          headerTitle: 'پشتیبانی',
          headerLeft: () => (
            <Pressable
              style={{ display: "flex", flexDirection: "row" }}
              onPress={() => navigation.navigate("Home")}
            >
              <Feather name="arrow-left" size={24} color="white" />
            </Pressable>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

const AboutStack = ({ navigation }) => {
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
        name="About"
        component={About}
        options={{
          headerTitle: "درباره ما",
          headerLeft: () => (
            <Pressable
              style={{ display: "flex", flexDirection: "row" }}
              onPress={() => navigation.navigate("Home")}
            >
              <Feather name="arrow-left" size={24} color="white" />
            </Pressable>
          ),
        }}
      />
    </Stack.Navigator>
  );
};
const HomeStack = ({navigation}) => {
  const [wordPage, setWordPage] = useState(1);
  const [wordTestTitle, setWordTestTitle] = useState('');
  const [grammarTitle, setGrammarTitle] = useState('');
  const [passageTestTitle, setPassageTestTitle] = useState('');
  const [newMessagesCount, setNewMessagesCount] = useState(0);
    const db = new Db();
    db.getMessages({setNewMessagesCount:(value) => setNewMessagesCount(value)});
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
const WordTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#220c5c",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontFamily: "Vazir",
        },
        lazy: true,
      }}
    >
      <Tab.Screen
        name="WordGroup"
        component={WordGroup}
        options={{
          headerTitle: "",
          headerShown: false,
          tabBarLabel: "لغات",
          tabBarIcon: ({ color }) => (
            <Ionicons name="md-menu" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          headerTitle: "",
          headerShown: false,
          tabBarLabel: "جستجو",
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="VTestSection"
        component={VTestSection}
        options={{
          headerTitle: "آزمون ها",
          headerShown: false,
          tabBarLabel: "آزمون ها",
          tabBarIcon: ({ color }) => (
            <Ionicons name="book-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);
  I18nManager.swapLeftAndRightInRTL(false);
  const [isLogin, setIsLogin] = useState(true);
  const [mobile,setMobile] = useState();
  const [isCodeSent,setIsCodeSend] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [verifyApiErrors,setVerifyApiErrors] = useState([]);
  const login = (phone) => {
    setMobile(phone);
    fetch(`http://mscenglish.ir/api/verificationCode?mobile=${phone}`, {
      method: "POST",
      //Request Type
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success
        console.log(responseJson);
        setIsCodeSend(true);
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        console.error(error);
      });
  };
  const verifyCode = (name,code,invitationCode) => {
    fetch(`http://mscenglish.ir/api/verify?mobile=${mobile}&name=${name}&code=${code}&invitationCode=${invitationCode}`, {
      method: "POST",
      //Request Type
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success
        if(responseJson.status['code'] == 200)
          setIsLogin(true);
        else
        {
          console.log('send');
          setVerifyApiErrors(responseJson.errors);
        }

      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        console.error(error);
      });
  };
  useEffect(() => {
    const db = new Db();
    db.createDb();
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          Vazir: require("./assets/fonts/Vazir.ttf"),
          Maian: require("./assets/fonts/maian.ttf")
        });
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
 const backgroundImage = require("./assets/logo.png");
 function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          display:'flex',
          flexDirection:'row',
          marginLeft:-8,
          alignItems:'center'
        }}
      >
        <Image
          source={backgroundImage}
          style={{ width: 140, height: 140 }}
          resizeMode="stretch"
        ></Image>
        <Text
          style={{
            color:'#fff',
            fontSize:30,
            fontFamily:'Maian',
            marginLeft:-35,
            marginTop:38,
            flex:1,
          }}
        >
          MSc
        </Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

  const Drawer = createDrawerNavigator();
  if (isLogin) {
    return (
      <NavigationContainer onLayout={onLayoutRootView}>
        <Drawer.Navigator
          drawerContent={CustomDrawerContent}
          screenOptions={{
            drawerStyle: {
              backgroundColor: "#220c5c",

              paddingTop: 50,
            },
          }}
        >
          <Drawer.Screen
            name="HomeStack"
            component={HomeStack}
            options={{
              headerShown: false,
              drawerLabel: "Home",
              drawerIcon: () => (
                <Ionicons name="home-outline" size={30} color="#fff" />
              ),
              drawerItemStyle: {
                // backgroundColor: "#220c5c",
                marginTop: 1,
                marginBottom: 1,
              },
              // drawerActiveTintColor: "#fff",
              drawerLabelStyle: {
                fontFamily: "Maian",
                marginLeft: -20,
                marginTop: 8,
                fontSize: 20,
                color: "#fff",
              },
              drawerPosition: "left",
            }}
          />
          <Drawer.Screen
            name="SupportStack"
            component={SupportStack}
            options={{
              headerShown: false,
              drawerLabel: "Support",
              drawerIcon: () => (
                <Ionicons name="headset-outline" size={30} color="#fff" />
              ),
              drawerItemStyle: {
                // backgroundColor: "#220c5c",
                marginTop: 1,
                marginBottom: 1,
              },
              drawerLabelStyle: {
                fontFamily: "Maian",
                marginLeft: -20,
                marginTop: 8,
                fontSize: 20,
                color: "#fff",
              },
            }}
          />
          <Drawer.Screen
            name="AboutUs"
            component={AboutStack}
            options={{
              headerShown: false,
              drawerIcon: () => (
                <Ionicons name="people-outline" size={30} color="#fff" />
              ),
              drawerLabel: "About Us",
              drawerItemStyle: {
                marginTop: 1,
                marginBottom: 1,
              },
              drawerLabelStyle: {
                fontFamily: "Maian",
                marginLeft: -20,
                marginTop: 8,
                fontSize: 20,
                color: "#fff",
              },
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  } else {
    if(!isCodeSent)
      return <Login login={(prop) => login(prop)} />;
    else
      return <VerifyCode errors={verifyApiErrors} verifyCode={(name,code,invitationCode) => verifyCode(name,code,invitationCode)} />
  }
}
