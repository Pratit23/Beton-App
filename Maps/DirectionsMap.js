import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapView from "react-native-map-clustering";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Dimensions, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import Constants from 'expo-constants';
import Geocoder from 'react-native-geocoding';
import { isEqual, set } from "lodash";
import { Container, Header, Content, Icon, Text, Button } from 'native-base';
import { Switch } from 'galio-framework';
import * as Location from 'expo-location';
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
} from 'react-native-indicators';
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BottomSheet from 'reanimated-bottom-sheet';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'
import AppleHeader from "react-native-apple-header";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Accelerometer } from 'expo-sensors';
import * as TaskManager from "expo-task-manager";
import { Audio } from 'expo-av';
import { flowRight as compose } from 'lodash';
import { graphql } from 'react-apollo'
import { decrypt, AddAccReport } from '../queries/query'
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';



const GOOGLE_PLACES_API_KEY = 'AIzaSyBvZX8lKdR6oCkPOn2z-xmw0JHMEzrM_6w';

const { width, height } = Dimensions.get("screen");
const ASPECT_RATIO = width / height;

var normalArray = []

console.log("Width: ", width)
console.log('Height: ', height)

const darkStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#181818"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1b1b1b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8a8a8a"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#373737"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3c3c3c"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3d3d3d"
            }
        ]
    }
]

const lightStyle = [
    {
        "featureType": "poi.attraction",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    }
]

var prevLocation = {
    coords: {
        latitude: 9999,
        longitude: 9999
    }
}


const DirectionsMap = (props) => {

    const [initialRegion, setInitialRegion] = useState(props.from)
    const [isLoading, setIsLoading] = useState(true)
    const [tempRegion, setTempRegion] = useState(null)
    const [showStart, setShowStart] = useState(props.showStart)
    const [changeHeight, setChangeHeight] = useState(false)
    const [toggle, setToggle] = useState(true)
    const [enc, setEnc] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [showMap, setShowMap] = useState(false)

    const handleButton = () => {
        props.handleSearch()
    }

    const [data, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });

    const [subscription, setSubscription] = useState(null);

    // variables
    const snapPoints = useMemo(() => ['50%', '100%'], []);
    const [showMessage, setShowMessage] = useState(false)

    const unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };

    const startNavigation = () => {
        if (props.from != null) {
            getDirections()
        } else {
            alert("Please select source and destinaton")
        }
    }

    const handleGetDirections = async () => {
        if (props.from != null) {
            const data = {
                source: {
                    latitude: props.from.latitude,
                    longitude: props.from.longitude
                },
                destination: {
                    latitude: props.to.latitude,
                    longitude: props.to.longitude
                },
                params: [
                    {
                        key: "travelmode",
                        value: "driving"        // may be "walking", "bicycling" or "transit" as well
                    },
                    {
                        key: "dir_action",
                        value: "navigate"       // this instantly initializes navigation using the given travel mode
                    }
                ],
            }

            //getDirections(data)

            setSubscription(
                // Accelerometer.addListener(async (accelerometerData) => {
                //     if (accelerometerData.y <= -1.3) {
                //         let newLocation = await Location.getCurrentPositionAsync({
                //             maximumAge: 60000, // only for Android
                //             accuracy: Location.Accuracy.Lowest,
                //         })
                //         console.log("Hmmmm: ", newLocation, prevLocation)
                //         if ((newLocation.coords.latitude) != (prevLocation.coords.latitude)) {
                //             console.log("LOCATION CHANGEDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
                //             if (newLocation) {
                //                 var x = newLocation.coords.latitude + ' ' + newLocation.coords.longitude
                //                 console.log("X: ", x)
                //                 let obj = {
                //                     location: x,
                //                     userID: props.decrypt.decrypt.id,
                //                     reportedAt: new Date().toDateString(),
                //                     reportedOn: new Date().toLocaleString().split(", ")[1]
                //                 }
                //                 console.log("boah boah boah boah boah", obj)
                //                 normalArray.push(obj);
                //                 console.log("Pothole detected!")
                //             }

                //             let res = await props.AddAccReport({
                //                 variables: {
                //                     coords: normalArray
                //                 }
                //             })
                //             console.log("AFter mathttt ----", res);
                //             console.log("Document write here!");
                //             normalArray = []

                //             prevLocation = {
                //                 ...newLocation
                //             }
                //         } else {
                //             console.log("Location not changed")
                //         }

                //     }
                // })
                Accelerometer.addListener(async (accelerometerData) => {
                    if (accelerometerData.y <= -1.25) {
                        console.log("New location: ", newLocation)
                        let newLocation = await Location.getCurrentPositionAsync({
                            maximumAge: 60000, // only for Android
                            accuracy: Location.Accuracy.Lowest,
                        })
                        console.log("New location: ", newLocation)
                        if (newLocation) {
                            var x = newLocation.coords.latitude + ' ' + newLocation.coords.longitude
                            console.log("X: ", x)
                            let obj = {
                                location: x,
                                userID: props.decrypt.decrypt.id,
                                reportedAt: new Date().toDateString(),
                                reportedOn: new Date().toLocaleString().split(", ")[1]
                            }
                            console.log("boah boah boah boah boah", obj)
                            normalArray.push(obj);
                            console.log("Pothole detected!")
                            if (normalArray != []) {
                                let res = await props.AddAccReport({
                                    variables: {
                                        coords: normalArray
                                    }
                                })
                                console.log("AFter mathttt ----", res);
                                console.log("Document write here!");
                                normalArray = []
                            } else {
                                console.log("this shits empty dawg.")
                            }
                        }
                    }
                })
            )
            // console.log("Zoom zoom: ", accelerometerData)
            setShowMap(true)
        } else {
            alert("Please select source and destinaton")
        }
    }

    const resetting = () => {
        subscription && subscription.remove();
        setSubscription(null);
        setShowMap(false)
    }

    // TaskManager.defineTask(
    //     "LOCATION_TASK_NAME",
    //     async ({ data, error }) => {
    //         if (error) {
    //             console.log("I GOT AN ERROR", error);
    //             return;
    //         }
    //         if (data) {
    //             console.log("Background task working")
    //             try {
    //                 const { sound } = await Audio.Sound.createAsync(
    //                     require('../assets/Sounds/donefor.mp3')
    //                 );
    //                 await sound.playAsync();
    //             } catch {
    //                 console.log("Error playing sound!")
    //             }
    //             try {
    //                 Accelerometer.addListener(async (accelerometerData) => {
    //                     if (accelerometerData.y <= -1.25) {
    //                         console.log("New location: ", newLocation)
    //                         let newLocation = await Location.getCurrentPositionAsync({
    //                             maximumAge: 60000, // only for Android
    //                             accuracy: Location.Accuracy.Lowest,
    //                         })
    //                         console.log("New location: ", newLocation)
    //                         if (newLocation) {
    //                             var x = newLocation.coords.latitude + ' ' + newLocation.coords.longitude
    //                             console.log("X: ", x)
    //                             let obj = {
    //                                 location: x,
    //                                 userID: props.decrypt.decrypt.id,
    //                                 reportedAt: new Date().toDateString(),
    //                                 reportedOn: new Date().toLocaleString().split(", ")[1]
    //                             }
    //                             console.log("boah boah boah boah boah", obj)
    //                             normalArray.push(obj);
    //                             console.log("Pothole detected!")
    //                             if (normalArray != []) {
    //                                 let res = await props.AddAccReport({
    //                                     variables: {
    //                                         coords: normalArray
    //                                     }
    //                                 })
    //                                 console.log("AFter mathttt ----", res);
    //                                 console.log("Document write here!");
    //                                 normalArray = []
    //                             } else {
    //                                 console.log("this shits empty dawg.")
    //                             }
    //                         }
    //                     }
    //                 })
    //                 // console.log("Zoom zoom: ", accelerometerData)
    //             } catch {
    //                 console.log("Array hai ye", normalArray);
    //                 if (normalArray != []) {
    //                     let res = await props.AddAccReport({
    //                         variables: {
    //                             coords: normalArray
    //                         }
    //                     })
    //                     console.log("AFter mathttt ----", res);
    //                     console.log("Document write here!");
    //                     normalArray = []
    //                 } else {
    //                     console.log("this shits empty dawg.")
    //                 }
    //             }
    //         }
    //     }
    // );


    useEffect(() => {
        setTimeout(async () => {
            try {
                let value = await AsyncStorage.getItem('currLocation')
                setTempRegion(JSON.parse(value))
                setIsLoading(false)
            } catch (e) {
                console.log("Error fetching location: ", e)
            }
        }, 1000)
    }, [isLoading]);


    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <PulseIndicator color='white' />
                <Text style={{ color: 'white' }}>Loading...</Text>
            </View>
        )
    }

    const renderContent = () => {
        return (
            <View
                style={{
                    backgroundColor: '#F5F5F5',
                    paddingRight: 16,
                    paddingLeft: 16,
                    height: 450,
                }}
            >
                <StatusBar style="light" />
                <View style={{ height: height * 0.25 }}>
                    <Card style={{ height: height * 0.2, backgroundColor: '#FFF', borderRadius: 24, justifyContent: 'center', alignItems: 'center' }}>
                        {
                            props && props.isOnLine && props.isOnLine.isOnLine && props.isOnLine.isOnLine.length != 0 ?
                                <>
                                    <Text style={{ fontFamily: 'Lexand', fontSize: 70, color: '#454649' }}>{props.isOnLine.isOnLine.length}{props.isOnLine.isOnLine.length == 1 ? <Text style={{ fontFamily: 'Lexand', fontSize: 15 }}>pothole on route</Text> : <Text style={{ fontFamily: 'Lexand', fontSize: 15 }}>potholes on route</Text>}</Text>
                                    <Text style={{ fontFamily: 'Lexand', fontSize: 20, color: '#454649' }}>{props.fromName}  •••••••  {props.toName}</Text>
                                    {
                                        props.isOnLine.isOnLine.length == 0 ? <Text style={{ fontFamily: 'Lexand', fontSize: 15, color: '#dd2c00', marginTop: height * 0.01 }}>Smoooooth Operator!</Text> : null
                                    }
                                    {
                                        props.isOnLine.isOnLine.length <= 5 && props.isOnLine.isOnLine.length > 0 ? <Text style={{ fontFamily: 'Lexand', fontSize: 15, color: '#1b5e20', marginTop: height * 0.01 }}>Should be a fairly smooth ride!</Text> : null
                                    }
                                    {
                                        props.isOnLine.isOnLine.length > 5 && props.isOnLine.isOnLine.length < 20 ? <Text style={{ fontFamily: 'Lexand', fontSize: 15, color: '#b71c1c', marginTop: height * 0.01 }}>A few bumps, you should be fine!</Text> : null
                                    }
                                    {
                                        props.isOnLine.isOnLine.length > 20 ? <Text style={{ fontFamily: 'Lexand', fontSize: 15, color: '#00c853', marginTop: height * 0.01 }}>You should consider an alternative route!</Text> : null
                                    }

                                </> : <Text style={{ fontFamily: 'Lexand', fontSize: 25, color: '#454649' }}>Select a route to view data</Text>
                        }
                    </Card>
                </View>
                <Button iconLeft onPress={() => startNavigation()} style={{ width: '90%', justifyContent: 'center', alignItems: 'center', margin: width * 0.04 }}><Text style={{ fontFamily: 'Lexand', fontSize: 20, color: '#fff' }}>Start Navigation</Text></Button>
            </View>
        )
    };

    const renderHeader = () => (
        <View
            style={{
                backgroundColor: '#F5F5F5',
                padding: 16,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            {
                isOpen ? <View style={{ height: 10, width: 30, backgroundColor: '#212121', borderRadius: 12 }}></View> :
                    <Text style={{ fontFamily: 'Lexand', fontSize: 20, color: '#454649' }}>Swipe up to check potholes</Text>
            }
            <Grid style={{ marginTop: height * 0.01 }}>
                <Col>
                    <Button iconLeft onPress={() => handleButton()} style={{ width: '90%', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontFamily: 'Lexand', fontSize: 20, color: '#fff' }}>Search</Text></Button>
                </Col>
                <Col>
                    <Button iconLeft onPress={() => handleGetDirections()} style={{ width: '90%', justifyContent: 'center', alignItems: 'center', marginLeft: width * 0.04 }}><Text style={{ fontFamily: 'Lexand', fontSize: 20, color: '#fff' }}>Details</Text></Button>
                </Col>
            </Grid>

        </View>
    );

    //const sheetRef = React.useRef(null);
    console.log("PRAPS IDHAR HAI", props.isOnLine);
    return (
        <>
            <View
                style={{
                    flex: 1,
                }}
            >
                {
                    !showMap ?
                        <MapView
                            customMapStyle={toggle ? darkStyle : lightStyle}
                            initialRegion={initialRegion ? {
                                ...initialRegion,
                                latitudeDelta: 0.08,
                                longitudeDelta: 0.08 * ASPECT_RATIO,
                            } : tempRegion}
                            onRegionChangeComplete={reg => {
                                if (reg) {
                                    setInitialRegion(reg)
                                }
                            }}
                            style={{ flex: 1 }} provider={PROVIDER_GOOGLE}>
                            <MapViewDirections
                                origin={props.from}
                                destination={props.to}
                                apikey={GOOGLE_PLACES_API_KEY}
                                strokeWidth={3}
                                strokeColor="hotpink"
                            />
                            <Switch
                                value={toggle}
                                onChange={() => setToggle(!toggle)}
                                style={{ top: height * 0.09, left: width * 0.85 }}
                            />
                            {
                                props && props.isOnLine && props.isOnLine.isOnLine && props.isOnLine.isOnLine.length != 0 ?
                                    props.isOnLine.isOnLine.map((marker, key) => {
                                        console.log("Marker: ", marker)
                                        return (
                                            <Marker key={key} coordinate={{ latitude: Number(marker.latitude), longitude: Number(marker.longitude) }}><Image source={require('../imgs/pothole.png')} style={{ height: 35, width: 35 }} /></Marker>
                                        )

                                    }) : null
                            }
                        </MapView> :
                        <View style={{ marginTop: height * 0.05, height: height * 0.78 }}>
                            <StatusBar style="dark" />
                            <WebView
                                source={{
                                    uri: `https://maps.google.com/?saddr=${props.fromName}&daddr=${props.toName}`
                                }}
                            />
                            <Button iconLeft onPress={() => resetting()} style={{ width: width * 0.1, justifyContent: 'center', alignItems: 'center', position: 'absolute', marginTop: height * 0.01, marginLeft: width * 0.01 }} color={"#4B85F2"}><Text style={{ fontSize: 20, color: 'black' }}>{'<'}</Text></Button>
                        </View>
                }
            </View>
            <BottomSheet
                //ref={sheetRef}
                snapPoints={[400, 100]}
                renderContent={renderContent}
                initialSnap={1}
                renderHeader={renderHeader}
            // onOpenEnd={() => setIsOpen(true)}
            // onCloseEnd={() => setIsOpen(false)}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        position: 'absolute',
        bottom: 0,
        width: width,
        height: height * 0.1,
    },
    container1: {
        padding: 24,
        position: 'absolute',
        bottom: 0,
        width: width,
        height: height * 0.3,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        position: 'absolute',
        bottom: 40,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        justifyContent: 'center',
        alignItems: 'center',
        height: height * 0.1,
        width: width * 0.8,
        left: width * 0.1,
        borderRadius: 24
    },
    plainView: {
        width: 60,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
});

export default compose(
    graphql(decrypt, {
        name: "decrypt",
        options: () => {
            console.log("Global Tempo: ", global.tempo, typeof (global.tempo))
            return {
                variables: {
                    token: global.tempo
                }
            }
        }
    }),
    graphql(AddAccReport, { name: "AddAccReport" })
)(DirectionsMap)


