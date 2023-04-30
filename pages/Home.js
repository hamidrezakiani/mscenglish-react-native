import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  I18nManager,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
const backgroundImage = require("../assets/background.png");
const Home = (props) => {
  const { navigation } = props;
  return (
    <View style={style.container}>
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          flexDirection: "column",
          flexWrap: "wrap",
          alignItems: "flex-end",
          paddingBottom: Dimensions.get("window").height / 22,
          height: Dimensions.get("window").height - 50,
        }}
      >
        <View
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          <View style={style.item}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("PTestSection")}
              style={[style.touchable, { backgroundColor: "white" }]}
            >
              <Text style={style.itemEnglishText}>Passage</Text>
              <Text style={style.itemPersianText}>متن</Text>
            </TouchableOpacity>
          </View>
          <View style={style.item}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("WordTab")}
              style={[style.touchable, { backgroundColor: "white" }]}
            >
              <Text style={style.itemEnglishText}>Vocabulary</Text>
              <Text style={style.itemPersianText}>لغات</Text>
            </TouchableOpacity>
          </View>
          <View style={style.item}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Planning")}
              style={[style.touchable, { backgroundColor: "white" }]}
            >
              <Text style={style.itemEnglishText}>Planning</Text>
              <Text style={style.itemPersianText}>برنامه ریزی</Text>
            </TouchableOpacity>
          </View>
          <View style={style.item}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("GrammarList")}
              style={[style.touchable, { backgroundColor: "white" }]}
            >
              <Text style={style.itemEnglishText}>Grammar</Text>
              <Text style={style.itemPersianText}>قواعد</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Home;

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  item: {
    maxHeight: 140,
    height: Dimensions.get("window").height / 6,
    width: "50%",
    padding: 10,
  },
  itemEnglishText: {
    fontFamily: "Maian",
    fontWeight: "600",
    fontSize: 25,
    marginTop: 5,
  },
  itemPersianText: {
    fontFamily: "Vazir",
    fontWeight: "500",
    fontSize: 15,
    color: "#220c5c",
    marginTop: 2,
  },
  touchable: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
    flex: 1,
    borderRadius: 10,
  },
  customIcon: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
