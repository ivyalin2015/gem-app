import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { getAuth } from "@firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { requestFriend, unrequestFriend } from "../firebase";

// add/request button for each member
export default function MyComponent({
  uid,
  name,
  username,
  userReqs,
  myUID,
  image,
  buttonStyle,
}) {
  const [request, setRequest] = useState(true);
  const [count, setCount] = useState(0);
  console.log(count);
  console.log(name + " " + userReqs);
  console.log("userReqs")
  console.log(userReqs ? userReqs.includes(myUID) : 'sad')
  return (
    <View style={styles.eachUser}>
      <View>
        <Image source={{ uri: image }} style={styles.profilePic} />
      </View>
      <View
        style={{
          alignSelf: "center",
          flex: 1,
          paddingLeft: 7,
          paddingRight: 5,
        }}
      >
        <Text style={{ alignSelf: "flex-start", fontFamily: 'Avenir-Black', color: '#581212' }}>
          {name}
          {"\n"}
          <Text style={{ alignSelf: "flex-start", fontFamily: 'Avenir', color: '#581212' }}>{username}</Text>
        </Text>
      </View>
      <View style={{ alignSelf: "flex-end", flexDirection: "row" }}>
        <TouchableOpacity
          style={buttonStyle}
          onPress={() => {
            if (count != 2 && userReqs.includes(myUID)) {
              setRequest(false);
              setCount(2);
              console.log("hi");
              unrequestFriend(uid);
            } else if (count != 4 && !userReqs.includes(myUID)) {
              setRequest(!request);
              setCount(4);
              console.log("howdy");
              requestFriend(uid);
            } else if (count == 2 || count == 4) {
              if (userReqs.includes(myUID)) {
                console.log("hello");
                setRequest(!request);
                if (!request) {
                  requestFriend(uid);
                } else {
                  unrequestFriend(uid);
                }
              } else {
                setRequest(!request);
                if (!request) {
                  unrequestFriend(uid);
                } else {
                  requestFriend(uid);
                }
              }
            }
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="person-add" size={20} color="#ff4b4b" />
            <Text style={styles.loginText}>{`${
              (!userReqs?.includes(myUID) && request) ||
              (userReqs?.includes(myUID) && !request)
                ? "Add"
                : "Requested"
            }`}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
