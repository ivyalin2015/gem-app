import * as React from "react";
import { useState, useEffect } from "react";

import { PROVIDER_GOOGLE } from "react-native-maps";
import MapView from "react-native-maps";
import { Spinner } from "native-base";
import { getGroups, addLocation } from "../../firebase";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import GroupsCheckList from "../common/GroupsCheckList";
import {
  StyleSheet,
  View,
  Text,
  Button,
  ScrollView,
  TextInput,
  CheckBox,
} from "react-native";

import { ref, onValue, push, update, remove } from "firebase/database";

export default function AddLocToGroup({ route, navigation }) {
  const { locationInfo, selectedGroupInfo } = route.params;
  const [groups, setGroupInfo] = useState({});
  const [query, setQuery] = useState("");
  const [selectedGroups, setSelectedGroups] = useState({}); // map of groupUIDS: true, initialized as groupUIDS: false

  useEffect(() => {
    async function getAllGroupInfo() {
      // get current user
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const allGroups = await getGroups(user.uid);
        setGroupInfo(allGroups);

        // Initialize selectedGroups with group UIDs as keys and false as values
        let selectedGroupsObj = allGroups.reduce((obj, group) => {
          obj[group.uid] = false;
          return obj;
        }, {});

        setSelectedGroups(selectedGroupsObj);
      } else {
        // error; prompt user to log in?
        console.log("Error: no user is signed in");
      }
    }
    getAllGroupInfo();
  }, []);

  const keys = ["name"];

  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key]?.toLowerCase().includes(query.toLowerCase()))
    );
  };

  // adds location to groups thru backend firebase func
  const addLocationSubmit = () => {
    if (selectedGroups.length === 0) {
      // Display an error message or alert here to prompt the user to select at least one group
      console.log("Error: No group selected");
      return;
    }

    locationUid = addLocation(selectedGroups, locationInfo);

    // add location to map pins
    if (selectedGroupInfo) {
      if (selectedGroupInfo.uid in selectedGroups) {
        // if we selected a group to display on the map and its the group we just added to, display on map
        if (selectedGroupInfo["locations"]) {
          selectedGroupInfo["locations"][`${locationUid}`] = locationInfo;
        } else {
          selectedGroupInfo["locations"] = {};
          selectedGroupInfo["locations"][`${locationUid}`] = locationInfo;
        }
      }
    }
    navigation.navigate("homescreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add to Groups:</Text>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <View fontFamily="Avenir">
          {groups ? (
            groups.length > 0 ? (
              <GroupsCheckList
                fontFamily="Avenir"
                groups={search(groups)}
                selectedGroups={selectedGroups}
                setSelectedGroups={setSelectedGroups}
                locationInfo={locationInfo}
              />
            ) : (
              <Spinner accessibilityLabel="Loading groups" />
            )
          ) : (
            <Spinner accessibilityLabel="Loading groups" />
          )}
        </View>
      </ScrollView>
      <Button
        title="DONE"
        onPress={() => {
          addLocationSubmit();
          navigation.navigate("homescreen");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    paddingTop: "20%",
    paddingBottom: "3%",
    paddingLeft: "10%",
    fontSize: 25,
    textAlign: "left",
    fontFamily: "Avenir-Black",
    color: "#581212",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 10,
  },
  contentContainerStyle: {
    fontFamily: "Avenir",
  },
});
