import * as React from "react";
import { useState, useEffect } from "react";
import { Text, View, ScrollView, Pressable } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { TextInput } from "react-native";
import styles from "./AddFriendsStylesheet.jsx";
import MyComponent from "./MyComponent.jsx";
import { getRequests, getUser } from "../firebase";
import { getAuth } from "@firebase/auth";
import MyComponentAccept from "./MyComponentAccept.jsx";

export default function AddFriendsScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState(""); // to only get info for specific user
  const [myUID, setMyUID] = useState("");
  const [reqData, setReqData] = useState([""]);
  const [myData, setMyData] = useState([]);

  // test to seee if users is properly collected from firebase
  useEffect(() => {
    try {
      async function getAllRequests() {
        const requests = await getRequests();
        setReqData(requests);
        return requests;
      }
      const auth = getAuth();
      console.log("getAuth in AddFriendsScreen");
      const user = auth.currentUser;

      async function getMyself() {
        const me = await getUser(user.uid);
        setMyData(me);
        return me;
      }
      getMyself();
      if (myData) {
        getAllRequests();
        setMyUID(user.uid);
      }
    } catch {
      console.error("Error in UseEffect: ", error);
    }
  }, [myUID]);

  console.log("MYDATA");
  console.log(myData);

  useEffect(() => {
    // collect all user information
    async function getUsers() {
      console.log("AddFriendsScreen - before getDocs in useEffect");
      const snapshot = await getDocs(collection(db, "users"));
      console.log("AddFriendsScreen - after getDocs in useEffect");
      if (snapshot && myUID && myData) {
        let snapshotMap = snapshot.docs.map((doc) => doc.data());
        setData(
          snapshotMap.filter(
            (item) => item.uid != myUID && !myData.friends?.includes(item.uid)
          )
        );
        return snapshotMap.filter(
          (item) => item.uid != myUID && !myData.friends?.includes(item.uid)
        );
      } else {
        setData(null);
      }
    }

    getUsers();
  }, [myData]);

  console.log("DATA: ");
  console.log(data);
  console.log(myData);

  // filter data based on what's entered in searchbar
  const search = (data, query) => {
    if (data) {
      return data.filter((item) => item.name.includes(query));
    }
  };
  // display the contents when you're in the searchbar
  const display = (data) => {
    try {
      if (data) {
        return data.map(({ uid, name, username, requests, profilePic }) => {
          return (
            <View>
              <MyComponent
                key={uid}
                uid={uid}
                name={name}
                username={"@" + username}
                userReqs={requests ? requests : [0, 0]}
                myUID={myUID}
                image={profilePic}
                buttonStyle={styles.button}
              />
            </View>
          );
        });
      }
    } catch {
      console.error("Error in Display: ", error);
    }
  };

  const displayRequests = (query) => {
    try {
      console.log("reqData", reqData);
      if (reqData) {
        if (query == "") {
          return reqData.map(({ uid, name, username, profilePic }) => {
            return (
              <View>
                <MyComponentAccept
                  uid={uid}
                  name={name}
                  username={"@" + username}
                  image={profilePic}
                  buttonStyle={styles.button}
                />
              </View>
            );
          });
        }
      } else {
        console.log("bad");
      }
    } catch {
      console.error("Error in displayRequest: ", error);
    }
  };

  // searchbar functionality
  function searchBar() {
    return (
      <View style={styles.container}>
        <Text
          style={{
            paddingTop: 40,
            padding: 10,
            fontSize: 30,
            fontFamily: "Avenir-Black",
            color: "#581212",
          }}
        >
          Friends
        </Text>
        <View style={{ alignItems: "center" }}>
          <TextInput
            style={styles.search}
            text={query}
            type="text"
            placeholder="Search..."
            className="search"
            onChangeText={(text) => {
              setQuery(text);
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 24,
            padding: 10,
            fontFamily: "Avenir-Black",
            color: "#581212",
          }}
        >{`${query == "" ? "Requests" : ""}`}</Text>

        {displayRequests(query)}
        <Text
          style={{
            fontSize: 24,
            padding: 10,
            fontFamily: "Avenir-Black",
            color: "#581212",
          }}
        >
          Recommended
        </Text>
        {display(search(data, query))}
      </View>
    );
  }

  return <ScrollView style={styles.container}>{searchBar()}</ScrollView>;
}
