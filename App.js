import * as React from "react";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NativeBaseProvider, Text, Box } from "native-base";
import { getAuth, onAuthStateChanged } from "@firebase/auth";

import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./components/LoginScreen";
import BucketScreen from "./components/BucketScreen";
import GroupsScreen from "./components/GroupsScreen";
import GroupInfoScreen from "./components/GroupInfoScreen";
import AddFriendsScreen from "./components/AddFriendsScreen";
import HomeSelectGroup from "./components/homeScreenComponents/HomeSelectGroup";

import CreateGroupName from "./components/createGroupComponents/createGroupName";
import CreateGroupFriends from "./components/createGroupComponents/createGroupFriends";
import CreateGroupFolders from "./components/createGroupComponents/createGroupFolders";

import BottomInfo from "./components/common/BottomInfo";
import AddLocToGroup from "./components/addLocationComponents/AddLocToGroup";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const auth = getAuth();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, [user]);

  const GroupStack = () => {
    const GroupStackNav = createNativeStackNavigator();
    return (
      <GroupStackNav.Navigator
        initialRouteName="groupscreen"
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerShadowVisible: false,
          headerTitle: "",
          headerTintColor: "#fff",
        }}
      >
        <GroupStackNav.Screen name="groupscreen" component={GroupsScreen} />

        <GroupStackNav.Screen name="groupinfo" component={GroupInfoScreen} />

        <GroupStackNav.Screen
          name="creategroupname"
          component={CreateGroupName}
        />
        <GroupStackNav.Screen
          name="creategroupfriends"
          options={{ headerShown: false }}
          component={CreateGroupFriends}
        />
        <GroupStackNav.Screen
          name="creategroupfolders"
          component={CreateGroupFolders}
        />
      </GroupStackNav.Navigator>
    );
  };

  const HomeScreenStack = () => {
    const HomeStackNav = createNativeStackNavigator();
    return (
      <HomeStackNav.Navigator
        initialRouteName="homescreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <HomeStackNav.Screen
          name="homescreen"
          component={HomeScreen}
          initialParams={{ selectedGroup: null, displayMap: true }}
        />
        <HomeStackNav.Screen name="bottominfo" component={BottomInfo}/>
        <HomeStackNav.Screen name="addlocation" component={AddLocToGroup} />
      </HomeStackNav.Navigator>
    );
  };

  const HomeStack = () => {
    // can search for more icons here https://ionic.io/ionicons/v4
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "addfriends") {
              iconName = focused ? "person-add" : "person-add-outline";
            } else if (route.name === "groups") {
              iconName = focused ? "folder" : "folder-outline";
            } else if (route.name === "pin") {
              iconName = focused ? "pin" : "pin-outline";
            }

            // You can return any component that you like here!
            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
                key={iconName}
              />
            );
          },
          tabBarActiveTintColor: "red",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="home" component={HomeScreenStack} />
        <Tab.Screen name="groups" component={GroupStack} />
        <Tab.Screen name="addfriends" component={AddFriendsScreen} />
      </Tab.Navigator>
    );
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <NativeBaseProvider>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            {user ? (
              <Stack.Screen
                name="HomeStack"
                component={HomeStack}
              ></Stack.Screen>
            ) : (
              <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
            )}
          </Stack.Navigator>
        </NativeBaseProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
