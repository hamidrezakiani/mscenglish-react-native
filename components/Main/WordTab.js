import React from "react";
import WordGroup from '../../pages/WordGroup';
import Search from '../../pages/Search';
import VTestSection from '../../pages/VTestSection';
import { Ionicons} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();
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

  export default WordTab;