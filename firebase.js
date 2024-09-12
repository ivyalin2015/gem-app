import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  updateDoc,
  serverTimestamp,
  documentId,
} from "firebase/firestore";
import { db } from "./firebase-config";
import { getAuth } from "@firebase/auth";
import { arrayRemove, arrayUnion } from "firebase/firestore";

export async function createUser(uid, name, username, email, profilePic) {
  await setDoc(doc(db, "users", uid), {
    name: name,
    uid: uid,
    username: username,
    email: email,
    profilePic: profilePic,
    friends: null, // null initially bc no friends or groups
    requested: null,
    requests: [],
    groups: null,
  });
}

// Returns false if user does not exist
export async function getUser(uid) {
  const userRef = doc(db, "users", uid);
  console.log("getUser - wait for getDoc")
  const userSnapshot = await getDoc(userRef);
  console.log("getUser -  got getDoc")

  if (userSnapshot.exists()) {
    return userSnapshot.data();
  } else {
    return false;
  }
}

export async function addFriend(addUID) {
  // input: another user's uid
  let myUID = null;
  const user = getAuth().currentUser; // getting my data
  if (user) {
    myUID = user.uid; // setting var
  }

  await new Promise(() => {
    const userRef = doc(db, "users", addUID); // another user's doc
    const myRef = doc(db, "users", myUID);
    return (
      updateDoc(
        userRef,
        {
          // update another user
          friends: arrayUnion(myUID),
          requested: arrayRemove(myUID),
        },
        { merge: true }
      ),
      updateDoc(
        // update my own doc
        myRef,
        {
          requests: arrayRemove(addUID),
          friends: arrayUnion(addUID),
        },
        { merge: true }
      )
    );
  });
}

// Get all the requests of the current user
export async function getRequests() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user !== null) {
    const userRef = doc(db, "users", user.uid); // pointer to info
    console.log("grabbind all of the info - getRequests")
    const userSnapshot = await getDoc(userRef); // grab dat info

    if (userSnapshot.exists()) {
      if (userSnapshot.data().requests === null) {
        return [];
      }

      requests = userSnapshot.data().requests; // get requests

      if (!requests) {
        return [];
      }

      //reqUids = Object.keys(requests).filter((uid) => requests[uid]);

      let reqData = await Promise.all(
        requests.map(async function (uid, index) {
          reqInfo = await getUser(uid);
          reqInfo["uid"] = uid;
          return reqInfo;
        })
      );
      return reqData;
    } else {
      return false;
    }
  }
}

export async function requestFriend(reqUID) {
  // input: another user's uid
  // first find current user
  let myUID = null; // setting my own UID
  console.log("before requestFriend getAuth")
  const user = getAuth().currentUser; // getting my data
  console.log("after requestFriend getAuth")
  if (user) {
    myUID = user.uid; // setting var
  }

  await new Promise(() => {
    console.log("getting another user's doc - requestFriend")
    const userRef = doc(db, "users", reqUID); // another user's doc
    console.log("getting my doc - requestFriend")
    const myRef = doc(db, "users", myUID);
    return (
      updateDoc(
        userRef,
        {
          requests: arrayUnion(myUID),
        },
        { merge: true }
      ),
      updateDoc(
        // update my own doc
        myRef,
        {
          requested: arrayUnion(reqUID),
        },
        { merge: true }
      )
    );
  });
}

export async function unrequestFriend(reqUID) {
  // input: another user's uid
  // first find current user
  let myUID = null; // setting my own UID
  const user = getAuth().currentUser; // getting my data
  if (user) {
    myUID = user.uid; // setting var
  }

  await new Promise(() => {
    const userRef = doc(db, "users", reqUID); // another user's doc
    const myRef = doc(db, "users", myUID);
    return (
      updateDoc(
        userRef,
        {
          requests: arrayRemove(myUID),
        },
        { merge: true }
      ),
      updateDoc(
        // update my own doc
        myRef,
        {
          requested: arrayRemove(reqUID),
        },
        { merge: true }
      )
    );
  });
}

// Returns false if group does not exist
export async function getGroup(uid) {
  const groupRef = doc(db, "groups", uid);
  const groupSnapshot = await getDoc(groupRef);

  if (groupSnapshot.exists()) {
    return groupSnapshot.data();
  } else {
    return false;
  }
}

// Returns false if location does not exist, by Uid
export async function getLocation(uid) {
  const locationRef = doc(db, "locations", uid);
  const locationSnapshot = await getDoc(locationRef);

  if (locationSnapshot.exists()) {
    return locationSnapshot.data();
  } else {
    return false;
  }
}

// get location by address, returns false if DNE
export async function getLocationByAddr(location) {
  const locationRef = collection(db, "locations");
  const locationSnapshot = await getDocs(
    query(locationRef, where("address", "==", location.formatted_address))
  );

  let foundLocation = false;
  locationSnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    if (doc.exists()) {
      foundLocation = doc;
    }
  });

  return foundLocation;
}

// Get all the friends of the current user
export async function getFriends() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user !== null) {
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      friends = userSnapshot.data().friends;

      if (!friends) {
        return [];
      }

      const friendsData = await Promise.all(
        friends.map(async function (uid) {
          friendInfo = await getUser(uid);
          friendInfo["uid"] = uid;
          return friendInfo;
        })
      );
      return friendsData;
    } else {
      return false;
    }
  }
}

// Get all the groups of the current user
export async function getGroups() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user !== null) {
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      groups = userSnapshot.data().groups;

      if (!groups) {
        return [];
      }

      groupUids = Object.keys(groups).filter((uid) => groups[uid]);

      const groupsData = await Promise.all(
        groupUids.map(async function (uid) {
          groupInfo = await getGroup(uid);
          groupInfo["uid"] = uid;
          return groupInfo;
        })
      );
      return groupsData.sort((a, b) => a.created - b.created); // sorts by least to most recent created by we want newest groups to have high indices
    } else {
      console.log("error");
      return false;
    }
  }
}

// check if given location is in given group, returns array of booleans in order of groups
export async function isLocationInGroup(group, location) {
  // location doesn't have an id yet, so we need to check
  // whether the address of the current location matches
  // the address of any other location in user's groups
  if (!location || !location.formatted_address) {
    return false; // or handle the error appropriately
  }

  address = location.formatted_address;
  const groupData = await getGroup(group.uid);
  let locations = groupData.locations;
  let inLocationFlag = false;

  if (!locations) {
    locations = [];
  }

  let locationUids = Object.keys(locations).filter((uid) => locations[uid]);

  for (const uid of locationUids) {
    const locationInfo = await getLocation(uid);
    if (locationInfo && address === locationInfo.address) {
      inLocationFlag = true;
      break; // Exit the loop if a match is found
    }
  }
  return inLocationFlag;
}

// check if given location is in given groups, returns array of booleans in order of groups
export async function checkLocationInGroups(groups, location) {
  if (groups) {
    const checkLocationPromises = groups.map((group) => {
      return isLocationInGroup(group, location);
    });

    const checked = await Promise.all(checkLocationPromises);
    return checked;
  }
}

// deletes location from the given group
export async function deleteLocationFromGroup(groupId, location) {
  const groupRef = doc(db, "groups", groupId);
  // query specific location where key == location.id, update the map to not include the location id and then update the location field
  const groupSnapshot = await getDoc(groupRef);
  let groupData = groupSnapshot.data();
  let locations = new Map(Object.entries(groupData.locations));

  // Remove the location from locations
  locations.delete(location.id);

  // Convert the locations Map back to an object
  const updatedLocations = Object.fromEntries(locations);
  await updateDoc(groupRef, { locations: updatedLocations });
}

// deletes location from the given groups
export async function deleteLocation(groups, location) {
  // if there are no groups to delete, return
  // if there are no groups to delete, return
  if (groups.length === 0) {
    return;
  }

  await Promise.all(
    groups.map((group) => deleteLocationFromGroup(group, location))
  );
}

// add a given location to all selected groups
export async function addLocation(selectedGroups, location) {
  let newLocation = await getLocationByAddr(location);
  const addGroups = [];
  const deleteGroups = [];

  console.log(Object.keys(selectedGroups));

  // if there are no selected groups, return!
  if (Object.keys(selectedGroups).length === 0) {
    return;
  }

  // filter true groups only
  for (let groupUid of Object.keys(selectedGroups)) {
    if (selectedGroups[groupUid]) {
      addGroups.push(groupUid);
    } else {
      deleteGroups.push(groupUid);
    }
  }

  // if location is not in database, add location to database
  // otherwise, fetch it from the database
  if (!newLocation && addGroups.length > 0) {
    newLocation = await addDoc(collection(db, "locations"), {
      name: location.name,
      coords: location.coords, // contains lat, long, latDelt, longDelt
      address: location.formatted_address,
    });
  }

  // delete groups
  isLocationDeleted = await deleteLocation(deleteGroups, newLocation);

  // for each group, add the location information to their groups/gid/locations
  await Promise.all(
    addGroups.map((uid) => {
      const groupRef = doc(db, "groups", uid);
      return setDoc(
        groupRef,
        {
          locations: {
            [`${newLocation.id}`]: {
              name: location.name,
              coords: location.coords, // contains lat, long, latDelt, longDelt
              address: location.formatted_address,
            },
          },
        },
        { merge: true }
      );
    })
  );
  return newLocation.id;
}

export async function createGroup(groupName, friends) {
  // filter true friends only
  for (friendUid in friends) {
    if (!friends[friendUid]) {
      delete friends[friendUid];
    }
  }

  // add yourself to the group
  const user = getAuth().currentUser;
  if (user) {
    friends[user.uid] = true;
  }

  // add group to database
  const newGroup = await addDoc(collection(db, "groups"), {
    name: groupName,
    members: friends,
    locations: null,
    created: serverTimestamp(),
  });

  // for each person, add the group ID to their user/uid/groups
  await Promise.all(
    Object.keys(friends).map((uid) => {
      const userRef = doc(db, "users", uid);
      return setDoc(
        userRef,
        {
          groups: {
            [`${newGroup.id}`]: true,
          },
        },
        { merge: true }
      );
    })
  );
}
