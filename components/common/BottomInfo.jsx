import * as React from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native"; // janky current solution for navigation
import { SafeAreaView } from "react-native-safe-area-context";
import { Spacer } from "native-base";

export default function BottomInfo({
  displayIndex,
  placeInfo,
  setDisplayIndex,
  selectedGroupInfo,
}) {
  const [bottomInfoIndex, setBottomInfoIndex] = useState(displayIndex);
  const bottomSheetRef = useRef(null);
  const [data, setData] = useState(placeInfo);
  const [groupButton, setGroupButton] = useState("add-circle");
  const navigation = useNavigation();

  const snapPoints = useMemo(() => ["40%", "90%"], []);
  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setDisplayIndex(-1);
    }
  }, []);

  // when bottom info sheet view changes, update state var to reflect the change
  useEffect(() => {
    setBottomInfoIndex(displayIndex);
    if (displayIndex == -1) {
      bottomSheetRef.current.close();
    } else {
      bottomSheetRef.current.snapToIndex(bottomInfoIndex);
    }
  }, [displayIndex]);

  // when place info prop changes, update info state var
  useEffect(() => {
    setData(placeInfo);
  }, [placeInfo]);

  // handles the functionality for adding a location to a group

  const handleAddLocationToGroup = async() => {
    navigation.navigate("addlocation", 
      {locationInfo: data});

    setGroupButton("checkmark-circle");
    setDisplayIndex(-1);
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={bottomInfoIndex}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
    >
      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.locationView}>
          <View style={styles.modalTopStyling}>
            {data ? <Text style={styles.title}> {data.name} </Text> : null}
            <Spacer />
            <Icon 
              name={"add-circle"}
              size={35} color="red" 
              style={styles.groupAddButton}
              onPress={handleAddLocationToGroup}
            />
          </View>
          {data ? (
            <Text style={styles.address}>{data.formatted_address}</Text>
          ) : null}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  address: {
    paddingTop: "2%",
  },
  modalTopStyling: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  groupAddButton: {
    alignItems: "flex-end",
    paddingLeft: "3%",
  },
  title: {
    fontWeight: "bold",
    maxWidth: "90%",
    fontSize: 25,
  }, 
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    paddingLeft: "5%",
    paddingRight: "5%",
    alignItems: "left",
  },
});
