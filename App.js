import React, { Fragment, useCallback, useEffect, useState } from "react";
import "react-native-gesture-handler";
import { Text, Button, I18nManager, Pressable, View, Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import * as Linking from "expo-linking"
import Login from "./pages/Login";
import VerifyCode from "./pages/VerifyCode";
import Spinner from "./pages/Spinner";
import AsyncStorage from '@react-native-async-storage/async-storage';
const Db = require("./functions/db.js");
import VerifiedUser from "./components/Main/VerifiedUser";
import { AppContext } from "./context/AppContext";
export default function App() {
  SplashScreen.hideAsync();
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);
  I18nManager.swapLeftAndRightInRTL(false);
  const [user, setUser] = useState({
    name: null,
    mobile: null,
    token: null,
    verify: true,
    new_user:true,
    payStatus: true
  });
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSpinner,setShowSpinner] = useState(false);
  
  const getUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('@user');
      if (user !== null) {
        const userData = JSON.parse(user);
        setUser(userData);
      } else {
        setUser({
          name: null,
          mobile: null,
          token: null,
          verify: false,
          new_user:true,
          payStatus: false
        })
      }
    } catch (e) {
      // error reading value
    }
  }
  const setUserData = async (value) => {
  
    try {
      await AsyncStorage.setItem('@user', JSON.stringify(value))
    } catch (e) {
      // saving error
    }
  }
  // setUserData({
  //   name: user.name,
  //   mobile: user,mobile,
  //   token: user.token,
  //   verify: user.verify,
  //   new_user:user.new_user,
  //   payStatus: 0
  // });
 
  
  useEffect(() => {
    const db = new Db();
    db.createDb();
    // db.getWords();
    db.updateWords();
    getUserData();
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

  // const onLayoutRootView = useCallback(async () => {
  //   if (appIsReady) {
  //     // This tells the splash screen to hide immediately! If we call this after
  //     // `setAppIsReady`, then we may see a blank screen while the app is
  //     // loading its initial state and rendering its first pixels. So instead,
  //     // we hide the splash screen once we know the root view has already
  //     // performed layout.
  //     await SplashScreen.hideAsync();
  //   }
  // }, [appIsReady]);

  const backgroundSplash = require("./assets/splash.gif");

  if (!appIsReady) {
    return <View style={{ width: '100%', height: '100%' }}>
      <Image
        source={backgroundSplash}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
        backgroundColor="#220c5c"
      ></Image>
    </View>
    return null;
  }
  if(showSpinner)
  {
     return <Spinner />;l
  }

  if (user.verify) {
    return (
      <AppContext.Provider value={{user:user,setUser:setUser,setUserData:setUserData,setShowSpinner:setShowSpinner}}>
          <VerifiedUser></VerifiedUser>
      </AppContext.Provider> 
    )
  } else {
    if (!isCodeSent)
      return (
        <AppContext.Provider value={{setIsCodeSent:setIsCodeSent,user:user,setUser:setUser}}>
           <Login />
        </AppContext.Provider>
      );
    else
      return (
      <AppContext.Provider value={{setUserData:setUserData,setUser:setUser,user:user}}>
          <VerifyCode />
      </AppContext.Provider>
      )
  }
}
