import * as React from "react";
import { useState, useEffect } from "react";
import { getGroups } from "../firebase";
import GroupScreensFlatList from "./common/GroupScreensFlatList";

import { StyleSheet } from "react-native";
import {
  Box,
  Input,
  Text,
  Button,
  Spinner,
  View,
  ScrollView,
  TouchableOpacity,
} from "native-base";

export default function GroupsScreen({ navigation }) {
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

  const createGroup = () => {
    navigation.navigate("creategroupname");
  };

  const onSelect = (index) => {
    newGroupsInfo = groups[index];
    newGroupsInfo["index"] = index;
    setTimeout(() => {
      navigation.navigate("groupinfo", { groupInfo: newGroupsInfo });
    }, 100);
  };

  return (
    <View style={{ padding: 15, paddingTop: 50 }}>
      <Text style={styles.groups}>Groups</Text>
      <View style={{ paddingTop: 10, paddingBottom: 20 }}>
        <Button
          colorScheme={"red"}
          onPress={createGroup}
          width="100%"
          height="50"
        >
          Create group
        </Button>
      </View>
      <View style={{ paddingBottom: 20 }}>
        <Input
          style={styles.search}
          size={"xl"}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
          }}
          placeholder={`Search groups`}
        />
      </View>
      <Text style={styles.myGroups}>My Groups</Text>
      <ScrollView>
        {groups ? (
          groups.length > 0 ? (
            <GroupScreensFlatList
              groups={search(groups)}
              onSelect={onSelect}
              style={{ color: "#581212", fontFamily: "Avenir-Light" }}
            />
          ) : (
            <Text fontFamily="Avenir" paddingLeft="3">
              No groups found.
            </Text>
          )
        ) : (
          <Spinner accessibilityLabel="Loading groups" />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    width: "80%",
    fontFamily: "Avenir",
    borderRadius: 10,
  },
  button: {
    width: "100%",
    height: 50,
    color: "#581212",
  },
  myGroups: {
    color: "#581212",
    fontSize: 24,
    alignContent: "flex-start",
    padding: 10,
    paddingTop: 13,
    fontFamily: "Avenir-Black",
  },
  groups: {
    color: "#581212",
    fontSize: 30,
    paddingTop: 50,
    paddingBottom: 10,
    fontFamily: "Avenir-Black",
  },
});
