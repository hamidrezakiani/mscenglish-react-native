import React, { useContext, useEffect, useState } from "react";
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
import * as WebBrowser from 'expo-web-browser';
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from "react-native-gesture-handler";
import { color, log } from "react-native-reanimated";
const backgroundImage = require("../assets/background.png");
const lockImage = require("../assets/lock.png");
import * as Linking from 'expo-linking';
import { UserContext } from "../context/UserContext";

const Home = (props) => {
  // const [user, setUser] = useState({
  //   name: null,
  //   mobile: null,
  //   token: null,
  //   verify: false,
  //   new_user: true,
  //   payStatus: false
  // });
  const { user, setUser ,getUserProfile} = useContext(UserContext);
  const [testText,setTestText] = useState('');
  
  
  //  console.log(url);
  // useEffect(() => {
  //   if(url)
  //   {
  //     const { hostname, path, queryParams } = Linking.parse(url);
  //   console.log(hostname,path,queryParams);
  //   }
  // }, [url]);
  // if (url) {
  //   const { hostname, path, queryParams } = Linking.parse(url);
  //   // setTestText(`Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
  //   //   queryParams
  //   // )}`)
  //   console.log(hostname);
  // }

  const [showModal, setShowModal] = useState(0);
  // const getUserData = async () => {
  //   try {
  //     const userString = await AsyncStorage.getItem('@user');
  //     const userData = JSON.parse(userString);
  //     setUser(userData);
  //   } catch (e) {
  //     console.log('failed: unable to read user data');
  //   }
  // }

  var url = Linking.useURL();
  useEffect(() => {
    Linking.addEventListener('url', ({url}) => { 
      console.log(url);
      const { hostname, path, queryParams } = Linking.parse(url);
      if(queryParams.pay == 'success')
       {
          getUserProfile();

          // getUserData();
       }
    });
    // getUserData();
  }, []);

  const PayModal = () => {
     const [discount,setDiscount] = useState(0);
     const [code,setCode] = useState('');
     const [error,setError] = useState('');
     const [discountCode,setDiscountCode] = useState('');
     const [amount,setAmount] = useState(0);
     const [readyStatus,setReadyStatus] = useState(0);
     useEffect(() => {
        getAmount();
     },[]);
    
   function getAmount()
   {
       setReadyStatus(0);
       fetch(`http://mscenglish.ir/api/services/purchases?service=SUBSCRIPTION`,{
         method:'GET',
         headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
       })
       .then((response) => response.json())
       .then((responseJson) => {
           setAmount(parseInt(responseJson.data.amount));
           setReadyStatus(1);
        })
   .catch((error) => {
     //Error
     setReadyStatus(-1);
   });
   }

   function checkDiscount()
    {
      fetch(`http://mscenglish.ir/api/check-discount-code`, {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
        }),
      //Request Type
    })
    .then((response) => response.json())
    //If response is in json then in success
    .then((responseJson) => {
         if(parseInt(responseJson.status.code) == 200)
          {
              setDiscount(parseInt(responseJson.data.amount));
              setDiscountCode(responseJson.data.code);
          }
          else
          {
               setError(responseJson.errors[0].value);
          }
    })
    .catch((error) => {
      //Error
      console.error(error);
    });

    }

     return (
      <View style={style.modal}>
      <View style={style.modalHeader}>
        <TouchableOpacity style={style.modalCloseButton} onPress={() => setShowModal(0)}>
          <Ionicons name="close" size={24} color={'white'} />
        </TouchableOpacity>
      </View>
      
      <View style={style.modalContent}>
        <View>
        <Text style={style.modalContentText}>
          هنوز اشتراک را خریداری نکرده اید!
        </Text>
        </View>
        <View style={{display:'flex',flexDirection:'row-reverse',flexWrap:'wrap',justifyContent:'center',marginVertical:30}}>
         <TextInput
          onChangeText={(value) => setCode(value)}
         style={{
             backgroundColor:'#fff',
             width:140,
             marginHorizontal:10,
             paddingHorizontal:10,
             paddingVertical:5,
             fontSize:18,
             color:'#777',
             borderRadius:5,
         }} placeholder="کد تخفیف دارید؟"></TextInput>
         <TouchableOpacity 
         onPress={() => checkDiscount()}
         style={{
            backgroundColor:'olivedrab',
            justifyContent:'center',
            paddingHorizontal:14,
            borderRadius:5,
            paddingVertical:5,
         }}>
            <Text style={{
                fontFamily:'Vazir',
                fontSize:18,
                color:'#fff',
                paddingBottom:6,
            }}>اعمال</Text>
         </TouchableOpacity>
         {/* <Text style={{color:'orangered',fontFamily:'Vazir'}}>
             کد وارد شده معتبر نیست
          </Text> */}
          {/* <Text style={{color:'lightgreen',fontFamily:'Vazir'}}>
             تبریک! 22000 تومان تخفیف اعمال شد.
          </Text> */}
           <Text style={{color:'lightgreen',fontFamily:'Vazir'}}>
             {error}
          </Text>
      </View>
        <View style={style.modalTable}>
          <View  style={[style.modalTableRow,{borderBottomWidth:2,borderColor:'#eee'}]}>
            <Text style={[style.modalTableCell,style.modalTableRowTitle]}>هزینه اشتراک</Text>
            <Text style={[style.modalTableCell,{textAlign:'center'}]}>{amount}</Text>
          </View>
          <View style={[style.modalTableRow,{borderBottomWidth:2,borderColor:'#eee'}]}>
            <Text style={[style.modalTableCell,style.modalTableRowTitle,{color:'green'}]}>تخفیف</Text>
            <Text style={[style.modalTableCell,{textAlign:'center',color:'green'}]}>{discount}</Text>
          </View>
          <View style={style.modalTableRow}>
            <Text style={[style.modalTableCell,style.modalTableRowTitle,{color:'mediumblue'}]}>مبلغ قابل پرداخت</Text>
            <Text style={[style.modalTableCell,{textAlign:'center',color:'mediumblue'}]}>{parseInt(amount) - parseInt(discount)}</Text>
          </View>
        </View>
      </View>
      <View style={style.modalFooter}>
         <TouchableOpacity style={{
            backgroundColor:'olivedrab',
            justifyContent:'center',
            paddingHorizontal:20,
            borderRadius:8,
            paddingVertical:5,
         }}
            onPress={() => {
              Linking.openURL('https://mscenglish.ir/pay',);
            }}
         >
             <Text style={{ 
                fontFamily:'Vazir',
                fontSize:20,
                color:'#fff',
                paddingBottom:6,
            }}>
                 پرداخت
             </Text>
         </TouchableOpacity>
      </View>
    </View>
     );
  }

  const SuccessPayModal = () => {
    return (
     <View style={style.modal}>
     <View style={style.modalHeader}>
       <TouchableOpacity style={style.modalCloseButton} onPress={() => setShowModal(0)}>
         <Ionicons name="close" size={24} color={'white'} />
       </TouchableOpacity>
     </View>
     
     <View style={style.modalContent}>
       <View>
       <Text style={style.modalContentText}>
           پرداخت با موفقیت انجام شد
       </Text>
       </View>
     </View>

   </View>
    );
 }

  const { navigation } = props;
  var modal = null;
  switch (user.payStatus) {
    case 1:
        modal = <SuccessPayModal></SuccessPayModal>;
      break;
    case 0 :
       modal = <PayModal></PayModal>;
       break;
    default:
      break;
  }
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
        {showModal ? modal : null}
        <View
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >

          <View style={style.item}>
            <TouchableOpacity
              onPress={() => {
                user.payStatus == 1 ? (
                  props.navigation.navigate("PTestSection")
                ):(
                  setShowModal(1)
                )
              }}
              style={style.touchable}
            // disabled={!user.payStatus}
            >
              {/* <ImageBackground
                  source={user.payStatus ? null :lockImage}
                  resizeMode="cover"
                  style={{
                    flex:1,
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    // width:'100%',
                    // height:'100%',
                  }}
                > */}
              <Text style={style.itemEnglishText}>Passage</Text>
              <Text style={style.itemPersianText}>متن</Text>
              {/* </ImageBackground> */}
            </TouchableOpacity>
          </View>
          <View style={style.item}>
            <TouchableOpacity
              onPress={() => {
                user.payStatus == 1 ?
                  props.navigation.navigate("WordTab")
                  :
                  setShowModal(1)
              }}
              style={style.touchable}
            // disabled={!user.payStatus}
            >
              {/* <ImageBackground
                source={user.payStatus ? null :lockImage}
                resizeMode="cover"
                style={{
                  flex:1,
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  // width:'100%',
                  // height:'100%',
                }}
              > */}
              <Text style={style.itemEnglishText}>Vocabulary</Text>
              <Text style={style.itemPersianText}>لغات</Text>
              {/* </ImageBackground> */}
            </TouchableOpacity>
          </View>
          <View style={style.item}>
            <TouchableOpacity
              onPress={() => {
                user.payStatus == 1 ?
                  props.navigation.navigate("Planning")
                  :
                  setShowModal(1)
              }}
              style={style.touchable}
            // disabled={!user.payStatus}
            >
              {/* <ImageBackground
                  source={user.payStatus ? null :lockImage}
                  resizeMode="cover"
                  style={{
                    flex:1,
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    // width:'100%',
                    // height:'100%',
                  }}
                > */}
              <Text style={style.itemEnglishText}>Planning</Text>
              <Text style={style.itemPersianText}>برنامه ریزی</Text>
              {/* </ImageBackground> */}
            </TouchableOpacity>
          </View>
          <View style={style.item}>
            <TouchableOpacity
              onPress={() => {
                user.payStatus == 1 ?
                  props.navigation.navigate("GrammarList")
                  :
                  setShowModal(1)
              }}
              style={style.touchable}
            // disabled={!user.payStatus}
            >
              {/* <ImageBackground
                  source={user.payStatus ? null :lockImage}
                  resizeMode="cover"
                  style={{
                    flex:1,
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    // width:'100%',
                    // height:'100%',
                  }}
                > */}
              <Text style={style.itemEnglishText}>Grammar</Text>
              <Text style={style.itemPersianText}>قواعد</Text>
              {/* </ImageBackground> */}
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Home;

const style = StyleSheet.create({
  modalContent: {
    flex: 8,
  },
  modalTable:{
     backgroundColor:'#fff',
     marginHorizontal:10,
     borderRadius:10,
  },
  modalTableRow:{
    display:'flex',
    flexDirection:'row-reverse',
  },
  modalTableRowTitle:{
    // borderLeftWidth:2,
    // borderLeftColor:'#fff'
  },
  modalTableCell:{
    flex:1,
    textAlign:'right',
    fontSize:15,
    fontFamily:'Vazir',
    padding:8,
    paddingRight:20,
  },
  modalContentText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
  },
  modalContentAmount: {
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 15,
  },
  modalContentDiscount: {
    color: 'yellow',
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 15,
  },
  modalContentAmountPayable: {
    color: 'lightgreen',
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 15,
  },
  modalHeader: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 0,
  },
  modalCloseButton: {

  },
  modalCloseButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontFamily: 'Vazir'
  },
  modalFooter:{
    flex:1.5,
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'flex-start',
  },
  modal: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    backgroundColor: '#331d6d',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    height: 460,
    width: '80%',
    top: '20%',
    left: '10%',
    zIndex: 1000,
    padding: 5,
  },
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
    textAlign: 'center',
    color:'#222',
  },
  itemPersianText: {
    fontFamily: "Vazir",
    fontWeight: "500",
    fontSize: 15,
    color: "#220c5c",
    textAlign: 'center',
    marginTop: 2,
  },
  touchable: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
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
