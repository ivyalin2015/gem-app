import { useState } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { addFriend } from "../firebase";
import { Ionicons } from "@expo/vector-icons";

import { acceptFriend } from "../firebase";

// add/accept button for each member
export default function MyComponent({
  uid,
  name,
  username,
  image,
  buttonStyle,
}) {
  const [accept, setAccept] = useState(true);

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
        <Text
          style={{
            alignSelf: "flex-start",
            fontFamily: "Avenir-Black",
            color: "#581212",
          }}
        >
          {name}
          {"\n"}
          <Text
            style={{
              alignSelf: "flex-start",
              fontFamily: "Avenir",
              color: "#581212",
            }}
          >
            {username}
          </Text>
        </Text>
      </View>
      <View style={{ alignSelf: "flex-end", flexDirection: "row" }}>
        <TouchableOpacity
          style={buttonStyle}
          onPress={() => {
            setAccept(false);
            addFriend(uid);
            //console.log(uid);
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="person-add" size={20} color="#ff4b4b" />
            <Text style={styles.loginText}>{`${
              accept ? "Accept" : "Accepted!"
            }`}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
