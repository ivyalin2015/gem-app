import * as React from "react";
import { useState, useEffect, Fragment } from "react";

import { View, Text, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import { Divider, Radio, Spacer, Box, HStack } from "native-base";

export default function GroupsFlatList({
  route,
  navigation,
  groups,
  onSelect,
  defaultSelectedIndex,
}) {
  const [value, setValue] = useState(defaultSelectedIndex);

  const radioPressed = (nextValue) => {
    setValue(nextValue);
    onSelect(nextValue);
  };

  return (
    <Radio.Group
      name="myRadioGroup"
      value={value}
      aria-label={"select-group-radio-group"}
      onChange={(nextValue) => {
        setValue(nextValue);
        onSelect(nextValue);
      }}
    >
      {groups.map((group, index) => {
        return (
          <Pressable
            style={styles.container}
            key={group.name}
            onPress={() => radioPressed(index)}
          >
            <HStack style={styles.container}>
              <Text style={styles.text}>{group.name}</Text>
              <Spacer />
              <Radio
                accessibilityLabel="radio-button"
                size={"lg"}
                value={index}
                my={1}
                aria-label={`${group.name}-radio-button`}
              />
            </HStack>
            <Box style={styles.verticalSpacer} />
          </Pressable>
        );
      })}
    </Radio.Group>
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
    height: 25,
  },
  radio: {
    ariaLabel: "radio-button",
  },
});
