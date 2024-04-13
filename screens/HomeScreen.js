import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Text, Alert,Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons'; 
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themeColors } from '../theme';
import { fetchProfileImage as fetchProfileImageFromDrawer  } from '../components/CustomDrawerContent';
import Snack from '../components/Snack';


export default function HomeScreen() {
  const navigation = useNavigation();
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationArrowPressed, setIsLocationArrowPressed] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null); 
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;  


      const fetchLocationAndImage = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }
        getCurrentLocation();
        const imageUrl = await fetchProfileImageFromDrawer(); 
        if (isActive) {
          setProfileImageUrl(imageUrl);
        }
      };

      fetchLocationAndImage();

      return () => {
        isActive = false; 
      };
    }, [])
  );

  const zoomOut = () => {
    setUserLocation(prevRegion => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2, 
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };
  

  const getCurrentLocation = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      postLocation(latitude, longitude); 
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const fetchProfileImage = async () => {
    const imageUrl = await fetchProfileImage(); 
    setProfileImageUrl(imageUrl);
  };


  const postLocation = async (latitude, longitude) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found.');
        return;
      }

      const response = await axios.post(apiUrl+'/user/update-location', {
        latitude,
        longitude
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setSnackbarMessage('Location updated');
      } else {
        setSnackbarMessage('Failed to post location');
      }
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage('Failed to post location');
      setSnackbarVisible(true);
    }
  };



  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.bgColor(1) }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ width: '100%', height: '100%' }}
        region={userLocation || {
          latitude: 37.78825, 
          longitude: -122.4324, 
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      > 
        {userLocation && profileImageUrl && (
          <Marker coordinate={userLocation}>
            <Image
              source={{ uri: profileImageUrl }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
          </Marker>
        )}
      </MapView>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ position: 'absolute', top: 40, left: 16 }}>
        <FontAwesome name="bars" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setIsLocationArrowPressed(!isLocationArrowPressed);
          getCurrentLocation(); 
        }}
        style={{ position: 'absolute', top: 40, right: 16 }}>
        <FontAwesome name="location-arrow" size={30} color={isLocationArrowPressed ? "red" : "black"} />
      </TouchableOpacity> 
      <TouchableOpacity onPress={zoomOut} style={{ position: 'absolute', bottom: 40, right: 40 }}>
    <FontAwesome name="search-minus" size={30} color="black" />
</TouchableOpacity>

      <Snack
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
      />
    </View>
  );
}
