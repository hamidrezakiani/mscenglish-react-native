import React from "react";
import {View,Text,Image} from 'react-native';
import {DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
const backgroundImage = require("../../assets/logo.png");
export default function CustomDrawerContent(props){
    return (
      
        <DrawerContentScrollView {...props}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginLeft: -8,
              alignItems: 'center'
            }}
          >
            <Image
              source={backgroundImage}
              style={{ width: 140, height: 140 }}
              resizeMode="stretch"
            ></Image>
            <Text
              style={{
                color: '#fff',
                fontSize: 30,
                fontFamily: 'Maian',
                marginLeft: -35,
                marginTop: 38,
                flex: 1,
              }}
            >
              MSc
            </Text>
          </View>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      );
}