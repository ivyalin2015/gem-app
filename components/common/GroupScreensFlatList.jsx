import * as React from "react";
import { useState, useEffect, Fragment } from "react";

import { View, Text, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import { Divider, Radio, Spacer, Box, HStack } from "native-base";

export default function GroupScreensFlatList({
  route,
  navigation,
  groups,
  onSelect,
}) {
  return (
    <React.Fragment>
      {groups.map((group, index) => {
        return (
          <Pressable
            key={group.name}
            onPress={() => {
              onSelect(index);
            }}
          >
            <HStack style={styles.container}>
              <Text style={styles.text}>
                {"\u2728"} {group.name}
              </Text>
            </HStack>
            <Box style={styles.verticalSpacer} />
          </Pressable>
        );
      })}
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    textAlign: "center",
    paddingLeft: 5,
    color: "#581212",
    fontFamily: "Avenir-Black",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 6,
  },
  verticalSpacer: {
    height: 20,
  },
  radio: {
    ariaLabel: "radio-button",
  },
});
