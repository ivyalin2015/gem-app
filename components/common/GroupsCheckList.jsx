import * as React from "react";
import { useState, useEffect } from "react";

import { View, Text, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import CheckBox from "react-native-check-box";
import { isLocationInGroup, checkLocationInGroups } from "../../firebase";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { Divider, Radio, Spacer, Box, HStack } from "native-base";

export default function GroupsCheckList({
  route,
  navigation,
  groups,
  selectedGroups,
  setSelectedGroups,
  locationInfo,
  onSelect,
}) {
  const [value, setValue] = useState("");
  const [isChecked, setIsChecked] = useState([]); //array of added status. index is order in groups prop

  // populate the isChecked array
  useEffect(() => {
    async function getLocationInGroupInfo() {
      // get current user
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const checked = await checkLocationInGroups(groups, locationInfo);
        setIsChecked(checked);

        // Loop through isChecked values and reset corresponding selectedGroups values
        const updatedSelectedGroups = { ...selectedGroups }; // Create a copy of selectedGroups
        // console.log("original selected groups: " + Object.keys(selectedGroups) + Object.values(selectedGroups) + Object.keys(selectedGroups).length)
        checked.forEach((isChecked, index) => {
          if (isChecked) {
            const groupUid = groups[index].uid; // Assuming groups array has the same order as checked array
            updatedSelectedGroups[groupUid] = isChecked;
          }
        });
        // console.log("updated selected groups: " + Object.keys(updatedSelectedGroups) + Object.values(updatedSelectedGroups) + Object.keys(updatedSelectedGroups).length);
        setSelectedGroups(updatedSelectedGroups);
      } else {
        // error; prompt user to log in?
        console.log("Error: no user is signed in");
      }
    }
    getLocationInGroupInfo();
  }, []);

  const addToGroup = (groupUid, index) => {
    // if we have value, do opposite, otherwise default to adding group
    if (groupUid in selectedGroups) {
      selectedGroups[groupUid] = !selectedGroups[groupUid];
      setSelectedGroups(selectedGroups);
    } else {
      let newSelectedGroups = selectedGroups;
      newSelectedGroups[groupUid] = true;
      setSelectedGroups(newSelectedGroups);
    }

    console.log(selectedGroups);
    //change display state
    let newGroupAdded = [...isChecked];
    newGroupAdded[index] = !isChecked[index];
    setIsChecked(newGroupAdded);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      {groups.map((group, index) => (
        <CheckBox
          index={index}
          style={{ width: "80%", paddingVertical: 10, alignSelf: "center" }}
          textStyle={{fontFamily: 'Avenir', fontSize: 30}}
          onClick={() => {
            addToGroup(group.uid, index);
          }}
          isChecked={isChecked[index]}
          leftText={group.name}
          key={group.uid}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Avenir",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 6,
  },
  verticalSpacer: {
    height: 10,
  },
});
