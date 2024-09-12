import * as React from "react";
import { useState, useEffect } from "react";
import { getFriends, createGroup } from "../../firebase";

import { StyleSheet } from "react-native";
import FriendsFlatList from "../common/FriendsFlatList";
import {
  Box,
  Input,
  Text,
  View,
  Stack,
  FormControl,
  Divider,
  Button,
  FlatList,
  Spacer,
  HStack,
  VStack,
  WarningOutlineIcon,
  Avatar,
  Spinner,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function CreateGroupFriends({ route, navigation }) {
  const { groupName } = route.params;
  const [query, setQuery] = useState("");
  const [friends, setFriends] = useState(null);
  const [addedFriends, setAddedFriends] = useState({}); // map of friendUIDs: true

  // get user's friends on component mount
  useEffect(() => {
    async function fetchFriends() {
      data = await getFriends();
      if (data) {
        setFriends(data);
      }
    }
    fetchFriends();
  }, []);

  // DEPRECATED folder functionality
  const confirmFriends = () => {
    navigation.navigate("creategroupfolders", {
      groupName: groupName,
      addedFriends: addedFriends,
    });
  };

  const keys = ["name", "username"];

  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(query.toLowerCase()))
    );
  };

  const createGroupSubmit = () => {
    createGroup(groupName, addedFriends);
    navigation.navigate("groupscreen");
  };

  return (
    <Box
      safeArea
      px="4"
      style={{ paddingTop: 60, paddingLeft: 30, paddingRight: 30 }}
    >
      <Text bold fontSize={"xl"} mb="4" paddingTop="10">
        Add your friends!
      </Text>
      <View style={{ paddingBottom: 20 }}>
        <Input
          size={"xl"}
          value={query}
          w="100%"
          onChangeText={(text) => {
            setQuery(text);
          }}
          placeholder={`Add friends to ${groupName}...`}
        />
      </View>
      {friends ? (
        friends.length > 0 ? (
          <FriendsFlatList
            friends={search(friends)}
            addedFriends={addedFriends}
            setAddedFriends={setAddedFriends}
          />
        ) : (
          <Text fontFamily="Avenir" fontSize="15">
            No friends found
          </Text>
        )
      ) : (
        <Spinner accessibilityLabel="Loading friends" />
      )}

      <Box style={{ paddingTop: 20 }}>
        <Button
          colorScheme={"red"}
          onPress={createGroupSubmit}
          fontStyle="Avenir"
        >
          Create Group
        </Button>
      </Box>
    </Box>
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
