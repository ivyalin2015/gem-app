import * as React from "react";
import { useState, useEffect } from "react";

import { StyleSheet, Text, View, Button } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function CreateGroupFolders({ route, navigation }) {
  const { groupName, addedFriends } = route.params;
  const createGroup = () => {};

  useEffect(() => {
    if (addedFriends) {
      console.log(addedFriends);
    }
  }, [addedFriends]);

  return (
    <View style={styles.container}>
      <Text>create group folders</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
