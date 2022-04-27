import React, { useState, useEffect, useRef } from "react";
import MapView from "react-native-map-clustering";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Dimensions, View, StyleSheet, TouchableOpacity } from 'react-native'
import Constants from 'expo-constants';
import Geocoder from 'react-native-geocoding';
import { isEqual } from "lodash";
import ClusterChild from './ClusterChild'
import { h as height, w as width } from '../constants'
import { Container, Header, Content, Icon, Text, Button } from 'native-base';
import { FAB } from 'react-native-paper'
import { allBaseReports } from '../queries/query';
import { graphql } from 'react-apollo';
import { flowRight as composey } from 'lodash';
import LottieView from 'lottie-react-native';

const GOOGLE_PLACES_API_KEY = 'AIzaSyBvZX8lKdR6oCkPOn2z-xmw0JHMEzrM_6w';

const ASPECT_RATIO = width / height;

console.log("Width: ", width)
console.log('Height: ', height)

global.allMarkers = []


const ClusterMap = (props) => {

    Geocoder.init("AIzaSyBvZX8lKdR6oCkPOn2z-xmw0JHMEzrM_6w");

    const [initialRegion, setInitialRegion] = useState({
        latitude: 52.5,
        longitude: 19.2,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04 * ASPECT_RATIO,
    })
    const [tempRegion, setTempRegion] = useState(null)
    const [markers, setMarkers] = useState([])
    const [showSearch, setShowSearch] = useState(false)
    const animation = useRef(null);


    const handleAddress = (data) => {

        var region = null

        Geocoder.from(data)
            .then(json => {
                var location = json.results[0].geometry.location;
                console.log(location);

                region = {
                    latitude: location.lat,
                    longitude: location.lng,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04 * ASPECT_RATIO,
                }

                setInitialRegion(region)
                setTempRegion(region)
                setShowSearch(false)
                console.log("Region: ", initialRegion)
            })
            .catch(error => console.warn(error));
    }

    const handleSearch = () => {
        setShowSearch(true)
        setTimeout(() => {
            animation.current.play();
        }, 200);
    }

    useEffect(() => {
        console.log("Useeffect for fetching", props)
        if (props && props.allBaseReports && !props.allBaseReports.loading) {
            let temp = []
            temp = props.allBaseReports.allBaseReports.map(i => {
                if (i.noOfReports < 3) {
                    return;
                }
                let test = {
                    ...i,
                    key: i.id,
                    latitude: Number(i.location.split(" ")[0]),
                    longitude: Number(i.location.split(" ")[1])
                }

                return test;
            })
            global.allMarkers = temp
            setMarkers(temp)
        }
    }, [props])

    console.log("yayayay", global.allMarkers)

    useEffect(() => {
        return () => {
            setMarkers([])
        }
    }, [])

    return (
        <>
            {
                showSearch ?
                    <GooglePlacesAutocomplete
                        placeholder="Search"
                        query={{
                            key: GOOGLE_PLACES_API_KEY,
                            language: 'en', // language of the results
                        }}
                        onPress={(data, details = null) => { handleAddress(data.structured_formatting.main_text) }}
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
                        <View style={{ height: height * 0.4, width: width, marginTop: height * 0.2 }}>
                            <LottieView ref={animation} source={require('../assets/Lottie/selectLoco.json')} loop={true} />
                        </View>
                        <FAB
                            style={styles.fab}
                            small
                            icon="close"
                            onPress={() => setShowSearch(false)}
                        />
                    </GooglePlacesAutocomplete>
                    : <ClusterChild initRegion={tempRegion} handleSearch={handleSearch} />
            }
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
});

export default composey(
    graphql(allBaseReports, { name: "allBaseReports" })
)(ClusterMap);