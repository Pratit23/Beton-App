import React, { useState, useEffect } from 'react'
import MapView from "react-native-map-clustering";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
const { width, height } = Dimensions.get("screen");
const ASPECT_RATIO = width / height;
import { List, ListItem, Button, Text } from 'native-base';
import { ScrollView, Dimensions, View, Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Switch } from 'galio-framework';
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
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'

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



export default function Individual(props) {

    console.log("Props in Indi: ", props)

    const [initialRegion, setInitialRegion] = useState({
        latitude: Number(props.indData.loco.split(" ")[0]),
        longitude: Number(props.indData.loco.split(" ")[1]),
        latitudeDelta: 0.08,
        longitudeDelta: 0.08 * ASPECT_RATIO
    })
    const [isLoading, setIsLoading] = useState(true)
    const [tempRegion, setTempRegion] = useState(null)
    const [toggle, setToggle] = useState(true)
    const [title, setTitle] = useState(null)

    const goBack = () => {
        props.back(false)
    }

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
        var title = props.indData.address.split(',')
        setTitle((title[title.length - 4] + ', ' + title[title.length - 3]).trim())
    }, [isLoading]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <PulseIndicator color='white' />
                <Text style={{ color: 'white' }}>Fetching...</Text>
            </View>
        )
    }

    return (
        <>
            {
                props && props.indData ?
                    <ParallaxScrollView
                        backgroundColor="#cfd8dc"
                        contentBackgroundColor="#cfd8dc"
                        parallaxHeaderHeight={height * 0.55}
                        renderForeground={() => (
                            <Switch
                                value={toggle}
                                onChange={() => setToggle(!toggle)}
                                style={{ top: height * 0.09, left: width * 0.85 }}
                            />
                        )}
                        renderBackground={() => (
                            <View style={{ height: height * 0.55, width: width }}>
                                <MapView
                                    customMapStyle={toggle ? darkStyle : lightStyle}
                                    loadingEnabled
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
                                    {
                                        <Marker coordinate={{ latitude: initialRegion.latitude, longitude: initialRegion.longitude }}><Image source={require('../imgs/pothole.png')} style={{ height: 35, width: 35 }} /></Marker>
                                    }
                                </MapView>
                            </View>
                        )}
                    >
                        <View style={{ flex: 1, backgroundColor: '#cfd8dc' }}>
                            <Card style={{ borderRadius: 24, backgroundColor: '#fff' }}>
                                <CardTitle
                                    title={title}
                                    subtitle={props.indData.reportAt}
                                />
                                <CardContent text={props.indData.reportOn} />
                                <CardContent text={props.indData.address} />
                                <CardContent text={"Lat/Lng: " + props.indData.loco} />
                            </Card>
                        </View>
                        <Button iconLeft onPress={() => goBack()} style={{ width: width, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 20, color: 'black' }}>Back</Text></Button>
                    </ParallaxScrollView> : null
            }
        </>
    )
}
