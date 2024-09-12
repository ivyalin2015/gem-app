import * as React from "react";
import { useState, useEffect } from "react";
import { getGroups } from "../../firebase";
import GroupsFlatList from "../common/GroupsFlatList";

import { StyleSheet, Pressable } from "react-native";
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
  ArrowBackIcon,
  Icon,
  Spinner,
  IconButton,
} from "native-base";

export default function HomeSelectGroup({
  navigation,
  setSelectedGroupInfo,
  selectedGroupInfo,
  setDisplayMap,
}) {
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState(null);

  // get user's friends on component mount
  useEffect(() => {
    async function fetchGroups() {
      data = await getGroups();
      if (data) {
        setGroups(data);
      }
    }
    fetchGroups();
  }, []);

  const keys = ["name"];

  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key]?.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const onSelect = (nextValue) => {
    newGroupsInfo = groups[nextValue];
    newGroupsInfo["index"] = nextValue;
    setSelectedGroupInfo(newGroupsInfo);
    setTimeout(() => {
      setDisplayMap(true);
    }, 100);
  };

  const pie = () => {
    console.log("pie");
    setDisplayMap(true);
  };

  return (
    <Box safeArea px="4" style={{ paddingTop: 70 }}>
      <View style={{ paddingBottom: 10, paddingTop: 50 }}>
        <Pressable
          style={styles.threeDotsButton}
          onPress={() => setDisplayMap(true)}
        >
          <ArrowBackIcon color={"black"} />
        </Pressable>
        <Input
          style={styles.search}
          size={"xl"}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
          }}
          placeholder={`Select a group to display`}
        />
      </View>
      {groups ? (
        groups.length > 0 ? (
          <GroupsFlatList
            groups={search(groups)}
            onSelect={onSelect}
            defaultSelectedIndex={
              selectedGroupInfo ? selectedGroupInfo.index : null
            }
          />
        ) : (
          <Text fontFamily="Avenir">No groups found</Text>
        )
      ) : (
        <Spinner accessibilityLabel="Loading groups" />
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    width: "100%",
    fontFamily: "Avenir",
  },
  threeDotsButton: {
    zIndex: 1,
    position: "absolute",
    top: 0,
    left: 20,
    boxShadow: "0px 17px 10px -10px",
  },
});
