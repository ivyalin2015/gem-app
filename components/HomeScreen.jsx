import * as React from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import axios from "axios";

import { MarkerAnimated, PROVIDER_GOOGLE } from "react-native-maps";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import HomeSelectGroup from "./homeScreenComponents/HomeSelectGroup";

import * as Location from "expo-location";
import Constants from "expo-constants";

import BottomInfo from "./common/BottomInfo";
import {
  Pressable,
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
} from "react-native";
import {
  Box,
  Input,
  Fab,
  Text,
  ThreeDotsIcon,
  Icon,
  Circle,
} from "native-base";

export default function HomeScreen({ navigation, route }) {
  const { selectedGroup, displayMap } = route.params; // the route equivalents of selectedGroupInfo and displaySelectGroupsButton

  const [mapRegion, setMapRegion] = useState(null);
  const mapRef = useRef(null);
  const searchBarRef = useRef(null);
  const [displayBottomSheet, setDisplayBottomSheet] = useState(-1); // -1 to close; 0 to show, 1 for full-screen display
  const [displaySelectGroupsButton, setDisplaySelectGroupsButton] =
    useState(displayMap);
  const [placeInfo, setPlaceInfo] = useState(null);
  const [curDisplayedCoords, setCurDisplayedCoords] = useState(null);
  Location.setGoogleApiKey("[fill in]");

  const [selectedGroupInfo, setSelectedGroupInfo] = useState(selectedGroup); // object of selected group info. (also has members, created Date)
  // index: index of selected group in groups array (int)
  // uid: uid of selected group (string)
  // name: name of selected group (string)
  // locations: array of locations (array of objects)

  // Get current location of user
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  useEffect(() => {
    if (placeInfo) {
      searchBarRef.current?.setAddressText(placeInfo.name);
    }
  }, [placeInfo]);

  // hook for when we open the map from the groups screen
  useEffect(() => {
    if (selectedGroup) {
      setSelectedGroupInfo(selectedGroup);
      setDisplaySelectGroupsButton(displayMap);
    }
  }, [selectedGroup]);

  const animateToLocation = (coordinate) => {
    //Animate the user to new region. Complete this animation in 1 second
    mapRef.current.animateToRegion(coordinate, 1000);
  };

  //address_components,adr_address,business_status,formatted_address,geometry,icon,icon_mask_base_uri,icon_background_color,name,permanently_closed,photo,place_id,plus_code,type,url,utc_offset,vicinity,wheelchair_accessible_entrance
  const setPlaceInfoFromPlaceId = (placeId, coordinate) => {
    let formattedCoordinate = coordinate;
    formattedCoordinate["latitudeDelta"] = 0.01;
    formattedCoordinate["longitudeDelta"] = 0.01;

    axios({
      method: "get",
      url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,name&key=[fill in]`,
      headers: {},
    })
      .then(function (response) {
        console.log("response.data.result", response.data.result);
        setPlaceInfo({
          name: response.data.result.name,
          formatted_address: response.data.result.formatted_address,
          coords: formattedCoordinate,
        });
        return;
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const setPlaceInfoFromLocationId = (locationId) => {
    setPlaceInfo({
      name: selectedGroupInfo.locations[locationId].name,
      formatted_address: selectedGroupInfo.locations[locationId].address,
      coords: selectedGroupInfo.locations[locationId].coords,
    });
  };

  const handlePoiPress = async (
    coords,
    isMarkerPress,
    nativeEvent = null,
    data = null
  ) => {
    animateToLocation(coords);
    setCurDisplayedCoords(coords);
    setDisplayBottomSheet(0);

    // pressed marker on the map; need to get details from firebase
    if (isMarkerPress) {
      setPlaceInfoFromLocationId(nativeEvent.id);
    }
    // pressed name / pin on map; get details from place API
    else {
      setPlaceInfoFromPlaceId(nativeEvent.placeId, nativeEvent.coordinate);
    }
  };

  // handles the search of a new location
  const handleSearchPress = async (data, location) => {
    const { lat, lng } = location;
    const coords = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    animateToLocation(coords);
    setCurDisplayedCoords(coords);
    setDisplayBottomSheet(0);
    setPlaceInfo({
      name: data.structured_formatting.main_text,
      formatted_address: data.description,
      coords: coords,
    });
  };

  // pulls up modal when marker is pressed
  const handleMarkerPress = async () => {
    setDisplayBottomSheet(0);
  };

  const handleShowGroupsPress = async () => {
    setDisplaySelectGroupsButton(false);
    setCurDisplayedCoords(null);
  };

  const ShowAllGroupsButton = () => {
    return (
      <Pressable style={styles.threeDotsButton} onPress={handleShowGroupsPress}>
        <Circle bg="rose.400" size={"55px"} shadow={7}>
          <ThreeDotsIcon color={"black"} />
        </Circle>
      </Pressable>
    );
  };

  return mapRegion ? (
    displaySelectGroupsButton ? (
      <View style={styles.container}>
        <ShowAllGroupsButton renderInPortal={displaySelectGroupsButton} />
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={mapRegion}
          zoomEnabled={true}
          showsUserLocation={true}
          moveOnMarkerPress={true}
          showsMyLocationButton={true}
          loadingEnabled={true}
          onPoiClick={(e) =>
            handlePoiPress(
              e.nativeEvent.coordinate,
              (isMarkerPress = false),
              e.nativeEvent
            )
          }
          onMarkerPress={(e) =>
            handlePoiPress(
              e.nativeEvent.coordinate,
              (isMarkerPress = true),
              e.nativeEvent
            )
          }
        >
          {selectedGroupInfo && selectedGroupInfo.locations
            ? Object.keys(selectedGroupInfo.locations).map((locationUid) => {
                return (
                  <MarkerAnimated
                    key={locationUid}
                    pinColor={"#00ACC1"}
                    identifier={locationUid}
                    coordinate={selectedGroupInfo.locations[locationUid].coords}
                  />
                );
              })
            : null}
          <MarkerAnimated coordinate={curDisplayedCoords} />
        </MapView>
        <View
          style={{
            position: "absolute",
            top: "5%",
            width: "90%",
            paddingTop: 10,
          }}
        >
          <GooglePlacesAutocomplete
            ref={searchBarRef}
            placeholder={"Search"}
            placeholderTextColor={"#666"}
            GooglePlacesDetailsQuery={{ fields: "geometry" }}
            query={{
              key: "AIzaSyAlXol8kTHp1bqRowon8Z0TmgntF1YLT1g",
              language: "en", // language of the results
            }}
            onPress={(data, details = null) => {
              handleSearchPress(data, details?.geometry?.location);
            }}
            onFail={(error) => console.error(error)}
            fetchDetails={true}
            onNotFound={() => console.log("no results")}
            listEmptyComponent={() => (
              <View style={{ flex: 1 }}>
                <Text>No results were found.</Text>
              </View>
            )}
          />
        </View>
        <BottomInfo
          displayIndex={displayBottomSheet}
          placeInfo={placeInfo}
          setDisplayIndex={setDisplayBottomSheet}
          selectedGroupInfo={selectedGroupInfo}
        />
      </View>
    ) : (
      <HomeSelectGroup
        setSelectedGroupInfo={setSelectedGroupInfo}
        selectedGroupInfo={selectedGroupInfo}
        setDisplayMap={setDisplaySelectGroupsButton}
      />
    )
  ) : null;
}

{
  /* <MapView region={this.state.region} onRegionChange={this.onRegionChange}>
  {this.state.markers.map((marker, index) => (
    <Marker
      key={index}
      coordinate={marker.latlng}
      title={marker.title}
      description={marker.description}
    />
  ))}
</MapView>; */
}

const styles = StyleSheet.create({
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
    alignItems: "center",
  },
  threeDotsButton: {
    zIndex: 1,
    position: "absolute",
    top: 100,
    right: 20,
    boxShadow: "0px 17px 10px -10px",
  },
  touchableOpacityStyle: {
    position: "absolute",
    zIndex: 1,
    top: 100,
    right: 20,
  },
  floatingButtonStyle: {
    resizeMode: "contain",
    width: 50,
    height: 50,
    //backgroundColor:'black'
  },
});
