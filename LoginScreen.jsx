import * as React from "react";
import { useState, useEffect } from "react";
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from "@firebase/auth";
import { app } from "../firebase-config";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import { StyleSheet, Text, View, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUser, getUser } from "../firebase";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [token, setToken] = useState("");

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId:
      "908901120890-hf4ucrk93gqo5smlkdgga1qpqril340m.apps.googleusercontent.com",
    androidClientId:
      "908901120890-ra3pfoqf44qco829967369uhfgkspbjr.apps.googleusercontent.com.apps.googleusercontent.com",
    iosClientId:
      "908901120890-ra3pfoqf44qco829967369uhfgkspbjr.apps.googleusercontent.com.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      setToken(response.params.id_token);
      signInCredential();
    }
  }, [response, token]);

  const signInCredential = async () => {
    const auth = getAuth(app);
    const credential = GoogleAuthProvider.credential(token);
    try {
      let res = await signInWithCredential(auth, credential);
      // if the user does not exist in the Firestore, create them in Firestore
      let user = await getUser(res.user.uid);
      if (!user) {
        createUser(
          res.user.uid,
          res.user.displayName,
          res.user.displayName.replace(/\s/g, "").toLowerCase(),
          res.user.email,
          res.user.photoURL,
          null,
          null,
          null,
          null
        );
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button
        title="Sign in with Google"
        disabled={!request}
        onPress={() => {
          promptAsync();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
