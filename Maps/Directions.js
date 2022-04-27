import React, { useState, useEffect, useRef } from "react";
import MapView from "react-native-map-clustering";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Dimensions, View, StyleSheet, TouchableOpacity } from 'react-native'
import Constants from 'expo-constants';
import Geocoder from 'react-native-geocoding';
import { isEqual } from "lodash";
import DirectionsMap from './DirectionsMap'
import { h as height, w as width } from '../constants'
import { Container, Header, Content, Icon, Text, Button } from 'native-base';
import { FAB } from 'react-native-paper'
import { graphql, useLazyQuery } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { isOnLine } from '../queries/query'
import LottieView from 'lottie-react-native';

const GOOGLE_PLACES_API_KEY = 'AIzaSyBvZX8lKdR6oCkPOn2z-xmw0JHMEzrM_6w';

const ASPECT_RATIO = width / height;

console.log("Width: ", width)
console.log('Height: ', height)

var coords = []

const Directions = (props) => {

  Geocoder.init("AIzaSyBvZX8lKdR6oCkPOn2z-xmw0JHMEzrM_6w");

  const [initialRegion, setInitialRegion] = useState({
    latitude: 52.5,
    longitude: 19.2,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04 * ASPECT_RATIO,
  })

  const [showSearch, setShowSearch] = useState(false)
  const [from, setFrom] = useState(null)
  const [fromName, setFromName] = useState(null)
  const [to, setTo] = useState(null)
  const [toName, setToName] = useState(null)
  const [showStart, setShowStart] = useState(false)
  const animation = useRef(null);

  const handleSearch = async () => {
    setShowSearch(true)
    setTimeout(() => {
      animation.current.play();
    }, 200);
  }

  const [isOn, { called, loading, data }] = useLazyQuery(
    isOnLine,
    {
      variables: {
        encoded: coords
      }
    }
  );

  const handleFrom = (data) => {

    var region = null

    Geocoder.from(data)
      .then(json => {
        var location = json.results[0].geometry.location;
        console.log("From Location: ", json.results[0].address_components[0].short_name);
        setFromName(json.results[0].address_components[0].long_name)
        region = {
          latitude: location.lat,
          longitude: location.lng,
        }

        setFrom(region)
      })
      .catch(error => console.warn(error));
  }

  const handleTo = (data) => {

    var region = null

    Geocoder.from(data)
      .then(async (json) => {
        var location = json.results[0].geometry.location;
        setToName(json.results[0].address_components[0].long_name)

        console.log("tununu: ", json.results[0].address_components[0].long_name)

        region = {
          latitude: location.lat,
          longitude: location.lng,
        }
        setTo(region)
      })
      .catch(error => console.warn(error));
  }

  const changeState = async () => {
    console.log("From: ", fromName)
    console.log("To: ", toName)
    let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${fromName}&destination=${toName}&mode=driving&key=AIzaSyBvZX8lKdR6oCkPOn2z-xmw0JHMEzrM_6w`)
    let respJson = await resp.json()
    //console.log("JSON response: ", respJson)

    var encoded = respJson.routes[0].legs[0].steps.map((obj, key) => {
      return obj.polyline.points
    })

    coords = [...encoded]
    isOn();

    if (data) {
      console.log("CHEDJASB: ", data)
    }

    setShowSearch(false)
    setShowStart(true)
  }

  if (called && loading) {
    console.log("Patience is virtue")
  }
  if (data) {
    console.log("CHEDJASB: ", data)
  }

  return (
    <>
      {
        showSearch ?
          <GooglePlacesAutocomplete
            placeholder="From"
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: 'en', // language of the results
            }}
            onPress={(data, details = null) => { handleFrom(data.structured_formatting.main_text) }}
            onFail={(error) => console.error(error)}
            requestUrl={{
              url:
                'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
              useOnPlatform: 'web',
            }}
            styles={{
              container: {
                backgroundColor: 'white',
              },
              textInputContainer: {
                backgroundColor: '#f5f5f5',
                height: 38,
                marginTop: height * 0.07,
                // borderTopRightRadius: 12,
                // borderTopLeftRadius: 12,
                // borderBottomLeftRadius: 12,
                marginLeft: width * 0.05,
                marginRight: width * 0.05,
                borderRadius: 24
              },
              textInput: {
                height: 38,
                color: '#5d5d5d',
                backgroundColor: '#f5f5f5',
                fontSize: 16,
                position: 'absolute',
                width: width * 0.9,
                // borderTopRightRadius: 12,
                // borderTopLeftRadius: 12,
                // borderBottomLeftRadius: 12,
                paddingLeft: width * 0.05,
                borderRadius: 24
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
              row: {
                marginLeft: width * 0.05,
                marginRight: width * 0.05,
              },
              separator: {
                marginLeft: width * 0.05,
                marginRight: width * 0.05,
              },
              poweredContainer: {
                marginLeft: width * 0.05,
                marginRight: width * 0.05,
              },
              listView: {
                borderRadius: 12,
              }
            }}
          >
            <GooglePlacesAutocomplete
              placeholder="To"
              query={{
                key: GOOGLE_PLACES_API_KEY,
                language: 'en', // language of the results
              }}
              onPress={(data, details = null) => { handleTo(data.structured_formatting.main_text) }}
              onFail={(error) => console.error(error)}
              requestUrl={{
                url:
                  'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
                useOnPlatform: 'web',
              }}
              styles={{
                container: {
                  backgroundColor: 'white',
                },
                textInputContainer: {
                  backgroundColor: '#f5f5f5',
                  height: 38,
                  marginTop: height * 0.02,
                  // borderTopRightRadius: 12,
                  // borderTopLeftRadius: 12,
                  // borderBottomLeftRadius: 12,
                  marginLeft: width * 0.05,
                  marginRight: width * 0.05,
                  borderRadius: 24
                },
                textInput: {
                  height: 38,
                  color: '#5d5d5d',
                  backgroundColor: '#f5f5f5',
                  fontSize: 16,
                  position: 'absolute',
                  width: width * 0.9,
                  // borderTopRightRadius: 12,
                  // borderTopLeftRadius: 12,
                  // borderBottomLeftRadius: 12,
                  paddingLeft: width * 0.05,
                  borderRadius: 24
                },
                predefinedPlacesDescription: {
                  color: '#1faadb',
                },
                row: {
                  marginLeft: width * 0.05,
                  marginRight: width * 0.05,
                },
                separator: {
                  marginLeft: width * 0.05,
                  marginRight: width * 0.05,
                },
                poweredContainer: {
                  marginLeft: width * 0.05,
                  marginRight: width * 0.05,
                },
                listView: {
                  borderRadius: 12,
                }
              }}
            >
              <View style={{ height: height * 0.4, width: width, marginTop: height * 0.1 }}>
                <LottieView ref={animation} source={require('../assets/Lottie/selectLoco.json')} loop={true} />
              </View>
              <FAB
                style={styles.fab1}
                small
                icon="magnify"
                onPress={() => changeState()}
              />
              <FAB
                style={styles.fab}
                small
                icon="close"
                onPress={() => setShowSearch(false)}
              />
            </GooglePlacesAutocomplete>
          </GooglePlacesAutocomplete>
          : (
            data && data.length != 0 ? (
              <DirectionsMap from={from} to={to} toName={toName} fromName={fromName} handleSearch={handleSearch} showStart={showStart} isOnLine={data} />
              ) : (
              <DirectionsMap from={from} to={to} toName={toName} fromName={fromName} handleSearch={handleSearch} showStart={showStart} isOnLine={[]} />
            )
          )}
    </>
  )
};

const styles = StyleSheet.create({
  searchBox: {
    padding: 10,
    paddingTop: Constants.statusBarHeight + 10,
    backgroundColor: '#ecf0f1',
    top: 50
  },
  overlay: {
    position: 'absolute',
    top: 70,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    height: height * 0.1,
    width: width * 0.8,
    left: width * 0.1
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'white'
  },
  fab1: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 50,
    backgroundColor: 'white'
  },
});

export default Directions