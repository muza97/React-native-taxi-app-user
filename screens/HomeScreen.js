//screens/HomeScreen.js

//screens/HomeScreen.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { themeColors } from '../theme';
import * as Location from 'expo-location';
import BottomSheetComponent from '../components/BottomSheetComponent';
import RideSummaryBox from '../components/RideSummaryBox'; // Import the component

export default function HomeScreen() {
  const navigation = useNavigation();
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationArrowPressed, setIsLocationArrowPressed] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false); // State to track bottom sheet open status
  const [rideRequested, setRideRequested] = useState(false); // State to track if ride is requested
  const bottomSheetRef = useRef(null);
  const [showSummaryBox, setShowSummaryBox] = useState(false);


  const handleFocus = useCallback(() => {
    setIsBottomSheetOpen(!isBottomSheetOpen);
    bottomSheetRef.current?.snapToIndex(isBottomSheetOpen ? 0 : 1); // Toggle between 10% and 70%
  }, [isBottomSheetOpen]);

  const handleRequestRide = useCallback(() => {
    setShowSummaryBox(true); // Show the summary box
    // Optionally, close the bottom sheet if it should be hidden
    bottomSheetRef.current?.snapToIndex(0); // Close bottom sheet
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      getCurrentLocation();
    })();
  }, []);

  const getCurrentLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setUserLocation({
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  return (
    <View className="flex-1 justify-center items-center bg-[color:themeColors.bgColor(1)]">
      <MapView
        provider={PROVIDER_GOOGLE}
        className="absolute top-0 left-0 right-0 bottom-0"
        initialRegion={userLocation || {
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={userLocation}
      />
      <TouchableOpacity
        onPress={() => navigation.toggleDrawer()}
        className="absolute top-10 left-4 z-10"
      >
        <FontAwesome name="bars" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setIsLocationArrowPressed(!isLocationArrowPressed);
          getCurrentLocation();
        }}
        className="absolute top-10 right-4 z-10"
      >
        <FontAwesome name="location-arrow" size={30} color={isLocationArrowPressed ? "red" : "black"} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleFocus}
        className="absolute top-16 self-center z-10"
      >
        <MaterialIcons name="travel-explore" size={30} color="black" />
      </TouchableOpacity>
      <BottomSheetComponent
        ref={bottomSheetRef}
        onFocus={handleFocus}
        onRequestRide={handleRequestRide}
      />
      {showSummaryBox && (
  <RideSummaryBox
    pickupAddress="123 PickUp St."
    dropoffAddress="456 DropOff Ave."
    distance="2.5 miles"
    rate="5"
    onRequestConfirm={() => {
      console.log('Ride confirmed');
      setShowSummaryBox(false); // Hide the summary box
    }}
  />
)}
    </View>
  );
}
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { View, TouchableOpacity, Platform, PermissionsAndroid, Text, Button} from 'react-native';
// import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
// import { FontAwesome } from '@expo/vector-icons'; 
// import { useNavigation } from '@react-navigation/native';
// import useGeocoding from '../hooks/useGeocoding';
// import { themeColors } from '../theme';
// import * as Location from 'expo-location';
// import BottomSheetComponent from '../components/BottomSheetComponent'; 
// import { MaterialIcons } from '@expo/vector-icons';
// import RideSummaryBox from '../components/RideSummaryBox';



// export default function HomeScreen() {
//   const navigation = useNavigation(); 
//   const { geocodeAddress } = useGeocoding();
//   const [userLocation, setUserLocation] = useState(null);
//   const [isLocationArrowPressed, setIsLocationArrowPressed] = useState(false);
//   const [routeCoordinates, setRouteCoordinates] = useState([]);
//   const [startCoordinates, setStartCoordinates] = useState(null);
//   const [destinationCoordinates, setDestinationCoordinates] = useState(null);
//   const bottomSheetRef = useRef(null);
//   const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
//   const [rideRequested, setRideRequested] = useState(false);

//   const handleFocus = useCallback(() => {
//     const targetIndex = isBottomSheetOpen ? 0 : 1;  // Use isBottomSheetOpen to toggle
//     bottomSheetRef.current?.snapToIndex(targetIndex);
//     setIsBottomSheetOpen(!isBottomSheetOpen);  // Toggle the state
//   }, [isBottomSheetOpen]);


// const handleRequestRide = useCallback(() => {
//   // This would be triggered when the Request Ride button is pressed
//   setRideRequested(true);
// }, []);

//   // const toggleBottomSheet = () => {
//   //   if (isBottomSheetOpen) {
//   //     bottomSheetRef.current?.close(0);  // Close to minimum snap point instead of completely closing
//   //   } else {
//   //     bottomSheetRef.current?.expand(2);  // Expand to the next snap point or fully open
//   //   }
//   //   setIsBottomSheetOpen(!isBottomSheetOpen);
//   // };

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         console.log('Permission to access location was denied');
//         return;
//       }

//       getCurrentLocation();
//     })();
//   }, []);

// const getCurrentLocation = async () => {
//     let location = await Location.getCurrentPositionAsync({});
//     const { latitude, longitude } = location.coords;
//     setUserLocation({
//       latitude,
//       longitude,
//       latitudeDelta: 0.005,
//       longitudeDelta: 0.005,
//     });
//   };


//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.bgColor(1) }}>
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         style={{ width: '100%', height: '100%' }}
//         initialRegion={userLocation || {
//           latitude: 37.78825, 
//           longitude: -122.4324, 
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//         region={userLocation} // re-center the map to userLocation 
//       >
//         {/* Marker and Polyline as before */}
//       </MapView>
//       <TouchableOpacity 
//         onPress={() => navigation.toggleDrawer()} 
//         className="absolute top-10 left-4" // Tailwind CSS classes for positioning
//       >
//         <FontAwesome name="bars" size={30} color="black" />
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() => {
//           setIsLocationArrowPressed(!isLocationArrowPressed);
//           getCurrentLocation(); 
//         }}
//         className="absolute top-10 right-4" 
//       >
//         <FontAwesome name="location-arrow" size={30} color={isLocationArrowPressed ? "red" : "black"} />
//       </TouchableOpacity>
//       <TouchableOpacity 
//         onPress={handleFocus} 
//         className="absolute top-12 self-center"
//       >
//         <MaterialIcons name="travel-explore" size={30} color="black" />
//       </TouchableOpacity>
//       <BottomSheetComponent
//         ref={bottomSheetRef}
//         onFocus={handleFocus}
//       />
//       {/* <BottomSheetComponent
//         ref={bottomSheetRef}
//         onFocus={handleFocus}
//         onRequestRide={handleRequestRide}
//       />
//       <TouchableOpacity 
//         onPress={() => handleFocus('pickUp')}  
//         className="absolute top-12 self-center"
//       >
//         <MaterialIcons name="travel-explore" size={30} color="black" />
//       </TouchableOpacity>
//       <BottomSheetComponent ref={bottomSheetRef} />
//       {isBottomSheetOpen ? <Text>Bottom Sheet is Open</Text> : <Text>Bottom Sheet is Closed to 10%</Text>} */}
//     </View>
//   );}