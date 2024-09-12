import * as React from "react";
import { useState, useEffect } from "react";

import { StyleSheet } from "react-native";
import {
  Box,
  Text,
  Button,
  FlatList,
  Spacer,
  HStack,
  VStack,
  Avatar,
} from "native-base";

export default function FriendsFlatList({
  route,
  navigation,
  friends,
  addedFriends,
  setAddedFriends,
}) {
  const [isAdded, setIsAdded] = useState(null); // array of added status. index is order in friends prop

  useEffect(() => {
    if (friends) {
      setIsAdded(Array(friends.length).fill(false));
    }
  }, [friends]);

  // also un adds friends if they are already added
  const addFriend = (friendUid, index) => {
    // added other friends
    if (true) {
      // if we have a value, do the opposite, otherwise, default to adding friend
      if (friendUid in addedFriends) {
        addedFriends[friendUid] = !addedFriends[friendUid];
        setAddedFriends(addedFriends);
      } else {
        let newAddedFriends = addedFriends;
        newAddedFriends[friendUid] = true;
        setAddedFriends(newAddedFriends);
      }
    }

    // change display state
    let newIsAdded = [...isAdded];
    newIsAdded[index] = !isAdded[index];
    setIsAdded(newIsAdded);
  };

  return (
    <FlatList
      data={friends}
      renderItem={({ item, index }) => (
        <Box
          _dark={{
            borderColor: "muted.50",
          }}
          borderColor="muted.800"
          pl={["0", "4"]}
          pr={["0", "5"]}
          py="2"
        >
          <HStack display={"flex"} alignItems={"center"}>
            <Avatar
              size="46px"
              source={{
                uri: item.profilePic,
              }}
            />
            <VStack paddingLeft={"20px"}>
              <Text
                _dark={{
                  color: "warmGray.50",
                }}
                color="coolGray.800"
                bold
              >
                {item.name}
              </Text>
              <Text
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
                fontSize={"12px"}
              >
                @{item.username}
              </Text>
            </VStack>
            <Spacer />
            {isAdded ? (
              <Button
                colorScheme={addedFriends[item.uid] ? "green" : "red"}
                size={"sm"}
                height={"70%"}
                onPress={() => {
                  addFriend(item.uid, index);
                }}
              >
                {addedFriends[item.uid] ? "Added" : "Add"}
              </Button>
            ) : null}
          </HStack>
        </Box>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}
