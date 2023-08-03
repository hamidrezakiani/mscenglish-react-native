import React, { useContext, useState } from "react";
import HomeStack from "./HomeStack";
import SupportStack from "./SupportStack";
import AboutStack from "./AboutStack";
import CompletionInformation from "../../pages/CompletionInformation";
import { UserContext } from "../../context/UserContext";
import { AppContext } from "../../context/AppContext";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons} from "@expo/vector-icons";
import CustomDrawerContent from "./CustomDrawerContent";
const Drawer = createDrawerNavigator();
export default function VerifiedUser(){
     
    const { user, setUser,setUserData,setShowSpinner } = useContext(AppContext);
    const [updateProfileApiErrors, setUpdateProfileApiErrors] = useState([]);
    const updateProfile = (name = null,invitationCode = null) => {
      console.log('update profile request sent!');
      fetch(`http://mscenglish.ir/api/account/profile/update`, {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization:`Bearer ${user.token}`
        },
        body: JSON.stringify({
          name: name,
          invitationCode: invitationCode,
        }),
      })
      .then(response => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(response => {
        console.log(response[0]);
        console.log(response[1]);
        if(response[0] == 200)
        {
           setUserData({
          name: name,
          mobile: user.mobile,
          token: user.token,
          verify: user.verify,
          payStatus: user.payStatus,
          new_user:0,
        });
        setUser({
          name: name,
          mobile: user.mobile,
          token: user.token,
          verify: user.verify,
          payStatus: user.payStatus,
          new_user:0,
        });
        }
        else if(response[0] == 422)
        {
          setUpdateProfileApiErrors(response[1].errors);
        }
        else
        {
          console.log(response);
        }
      })
      //If response is not in json then in error
      .catch((error) => {
        // setUpdateProfileApiErrors(responseJson.errors);
        console.error(error);
      });
    }
    const getUserProfile = () => {
        console.log('get user profile request sent!');
        setShowSpinner(true);
        fetch(`http://mscenglish.ir/api/account/profile`, {
          method: "GET",
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization:`Bearer ${user.token}`
          },
        })
        .then(response => {
          const statusCode = response.status;
          const data = response.json();
          return Promise.all([statusCode, data]);
        })
        .then(response => {
          // console.log(response[0]);
          // console.log(response[1]);
          if(response[0] == 200)
          {
          //    setUserData({
          //   name: response[1].data.name,
          //   mobile: user.mobile,
          //   token: user.token,
          //   verify: user.verify,
          //   payStatus: Number.parseInt(response[1].data.payStatus),
          //   new_user:0,
          // });
          setUser({
            name: response[1].data.name,
            mobile: user.mobile,
            token: user.token,
            verify: user.verify,
            payStatus: Number.parseInt(response[1].data.payStatus),
            new_user:0,
          });
          }
          else if(response[0] == 422)
          {
            setUpdateProfileApiErrors(response[1].errors);
          }
          else
          {
            console.log(response);
          }
          setShowSpinner(false);
        })
        //If response is not in json then in error
        .catch((error) => {
          setShowSpinner(false);
          // setUpdateProfileApiErrors(responseJson.errors);
          console.error(error);
        });
      }

      
      
    if(!user.new_user)
    {
      return (
        <UserContext.Provider value={{user:user,setUser:setUser}}>
        <NavigationContainer /*onLayout={onLayoutRootView}*/>
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
              initialParams={{ getUserProfile:() => getUserProfile(),user:user}}
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
       </UserContext.Provider>
      );
    }
    else
    {
       return <CompletionInformation errors={updateProfileApiErrors} updateProfile={(name,invitationCode) => updateProfile(name,invitationCode)} />
    }
}