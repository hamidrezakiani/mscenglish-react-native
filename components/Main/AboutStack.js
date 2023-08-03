import React from "react";
import {Pressable} from 'react-native';
import About from "../../pages/About";
import { Feather } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
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

  export default AboutStack;