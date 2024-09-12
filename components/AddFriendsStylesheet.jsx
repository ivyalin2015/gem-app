import { StyleSheet } from "react-native";

// stylesheet for all elements of page
export default styles = StyleSheet.create({
  // overall page container
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 7,
    paddingTop: 20,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  // add button
  button: {
    borderColor: "#ff4b4b",
    borderWidth: 2,
    backgroundColor: "transparent",
    padding: 15,
    paddingTop: 7,
    paddingBottom: 7,
    alignItems: "right",
    borderRadius: 20,
    alignSelf: "flex-end",
    justifyContent: "center",
  },

  // text within button
  loginText: {
    color: "#ff4b4b",
    paddingLeft: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  // separating each user in the overall list
  eachUser: {
    padding: 7,
    flexDirection: "row",
    fontFamily: 'Avenir'
  },
  username: {
    alignItems: "flex-start",
    fontFamily: 'Avenir'
  },
  profilePic: {
    resizeMode: "cover",
    height: 40,
    width: 40,
    paddingRight: 50,
    borderRadius: 40 / 2,
  },

  // searchbar information
  search: {
    margin: 20,
    borderColor: "gray",
    width: "85%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },

  results: {
    fontFamily: "Avenir",
  },

  acceptButton: {
    borderColor: "#58CC02",
    borderWidth: 2,
    backgroundColor: "#58CC02",
    padding: 15,
    paddingTop: 7,
    paddingBottom: 7,
    alignItems: "right",
    borderRadius: 20,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
});
