import * as React from "react";
import { useState, useEffect } from "react";

import { StyleSheet } from "react-native";
import {
  Box,
  Input,
  Text,
  Stack,
  FormControl,
  Divider,
  Button,
  WarningOutlineIcon,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function CreateGroupName({ navigation }) {
  const [isEmpty, setIsEmpty] = useState(false);
  const [groupName, setGroupName] = useState("");

  const confirmName = () => {
    navigation.navigate("creategroupfriends", {
      groupName: groupName,
    });
  };

  return (
    <Stack
      space={2.5}
      alignSelf="center"
      px="4"
      safeArea
      mt="4"
      w={{
        base: "100%",
        md: "25%",
      }}
    >
      <Box>
        <Text bold fontSize={"xl"} mb="4" paddingTop="10">
          Create your group
        </Text>
        <FormControl isInvalid={isEmpty} mb="5">
          <FormControl.Label>Group Name</FormControl.Label>
          <Input
            size={"xl"}
            value={groupName}
            w="100%"
            onChangeText={(text) => {
              setGroupName(text);
              setIsEmpty(text === "");
            }}
            placeholder="Group Name"
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Please enter a group name.
          </FormControl.ErrorMessage>
        </FormControl>
        <Button colorScheme={"red"} onPress={confirmName}>
          Next
        </Button>
      </Box>
    </Stack>
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
