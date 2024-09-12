import * as React from "react";
import { useState, useEffect } from "react";

import { PROVIDER_GOOGLE } from "react-native-maps";
import MapView from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";

import BottomToolbar from "./common/BottomToolbar";

export default function BucketScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Bucket list screen!</Text>
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
