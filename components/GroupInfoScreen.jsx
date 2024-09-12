import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "native-base";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { getUser, getLocation } from "../firebase";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function GroupInfoScreen({ navigation, route }) {
  const { groupInfo } = route.params;
  const [members, setMembers] = useState([]);
  const [location, setLocation] = useState(groupInfo.locations);
  const [locUIDs, setLocUIDs] = useState([]);

  // get user's friends on component mount
  useEffect(() => {
    async function fetchMembers() {
      const grpInfoArray = Object.keys(groupInfo.members);
      console.log("grpInfoArray: ");
      console.log(grpInfoArray);
      const memberPromises = grpInfoArray.map(async (uid) => {
        const memberInfo = await getUser(uid);
        return memberInfo;
      });
      const memberData = await Promise.all(memberPromises);
      setMembers(memberData);
      console.log("members");
      console.log(members);
    }

    async function fetchLocUIDs() {
      const locInfoArray = Object.keys(location);
      // console.log("locInfoArray: ")
      // console.log(locInfoArray)
      const locInfoPromises = locInfoArray.map(async (uid) => {
        const locInfo = await getLocation(uid);
        console.log(locInfo);
        return locInfo;
      });
      const locInfoData = await Promise.all(locInfoPromises);
      setLocUIDs(locInfoData);
      console.log(locUIDs);
    }

    fetchMembers();
    fetchLocUIDs();
  }, [groupInfo, location]);

  const displayMembers = (
    <ScrollView style={styles.membersContainer} horizontal={true}>
      {members.map((member, index) => (
        <View key={index} style={styles.memberContainer}>
          <View style={{ alignItems: "center" }}>
            <Image
              source={{ uri: member.profilePic }}
              style={styles.profilePic}
            />
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberUsername}>{member.username}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const displayLocations = (
    <ScrollView style={{ padding: 5 }}>
      {locUIDs.length > 0 ? (
        locUIDs.map((locInfo, index) => (
          <View key={index} style={{ padding: 5, paddingLeft: 25 }}>
            <Text style={styles.locations}>{locInfo.name}</Text>
            <Text style={styles.locAddress}>{locInfo.address}</Text>
          </View>
        ))
      ) : (
        <Text style={{ color: "#888", paddingLeft: 15, fontFamily: "Avenir" }}>
          No locations yet.
        </Text>
      )}
    </ScrollView>
  );

  const handleOpenInMap = () => {
    navigation.navigate("homescreen", {
      selectedGroup: groupInfo,
      diplayMap: true,
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", paddingBottom: 10 }}>
        <Text
          style={{
            fontSize: 30,
            textAlign: "center",
            padding: 10,
            paddingTop: 30,
            fontFamily: "Avenir-Roman",
            color: "#581212",
          }}
        >
          {groupInfo.name}
        </Text>
        <TouchableOpacity onPress={handleOpenInMap} style={styles.mapButton}>
          <Text
            style={{ fontSize: 16, color: "white", fontFamily: "Avenir-Light" }}
          >
            See Locations in Map
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.titles}>Group Members</Text>
      {displayMembers}
      <Text style={styles.titles}>Locations</Text>
      {displayLocations}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingLeft: 5,
    paddingRight: 5,
  },
  members: {
    alignSelf: "flex-start",
    color: "#581212",
    fontSize: 16,
    fontFamily: "Avenir",
  },
  locations: {
    color: "#581212",
    fontSize: 16,
    fontFamily: "Avenir-Black",
  },
  locAddress: {
    color: "#581212",
    fontSize: 16,
    fontFamily: "Avenir",
  },
  titles: {
    color: "#ffc800",
    fontSize: 24,
    alignContent: "flex-start",
    padding: 10,
    fontFamily: "Avenir-Black",
  },
  mapButton: {
    backgroundColor: "#581212",
    minHeight: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 80,
    paddingRight: 80,
  },
  memberContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    marginBottom: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#581212",
    fontFamily: "Avenir-Black",
  },
  memberUsername: {
    fontSize: 14,
    color: "#888",
    fontFamily: "Avenir",
  },
  memberContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  membersContainer: {
    flexGrow: 0,
    paddingLeft: 15,
    padding: 20,
  },
});
