import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useMemo, useReducer } from 'react';
import { Container, Footer, FooterTab, Button, Icon } from 'native-base'
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import {
    AnimatedTabBarNavigator,
    DotSize, // optional
    TabElementDisplayOptions, // optional
    TabButtonLayout, // optional
    IAppearenceOptions // optional
} from 'react-native-animated-nav-tab-bar'
import ReportPage from './layouts/ReportPage'
import Test from './layouts/Test'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import ClusterMap from './Maps/ClusterMap'
import HomePage from './layouts/HomePage'
import Profile from './layouts/Profile'
import SignUp from './auth/SignUp'
import Login from './auth/SignIn'
import { View, ActivityIndicator, Dimensions } from 'react-native';
import { AuthContext } from './auth/context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { users, addUser, loginQuery } from './queries/query'
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
import Directions from './Maps/Directions'
import * as Location from 'expo-location';
import Testing from './Maps/Testing'
import Acce from './Acce'

const { width, height } = Dimensions.get("screen");
const ASPECT_RATIO = width / height;


function Main(props) {
    const [showSignIn, setShowSignIn] = useState(false)
    const Tab = AnimatedTabBarNavigator();
    const [showSignInError, setShowSignInError] = useState(false)
    const [signInError, setSignInError] = useState(null)
    const [signInLoad, setSignInLoad] = useState(false)
    

    useEffect(() => {
        setTimeout(async () => {
            //setIsLoading(false)
            let userToken = null
            let splashCheck = null
            try {
                userToken = await AsyncStorage.getItem('userToken')


                console.log("Splash check: ", splashCheck)
                // global.tempo = userToken
                let { status } = await Location.requestPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    setIsLoading(false)
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                location = ({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04 * ASPECT_RATIO,
                })
                console.log("Location in main: ", location)
                await AsyncStorage.setItem('currLocation', JSON.stringify(location))
                let value = location
                let regionName = await Location.reverseGeocodeAsync({ longitude: value.longitude, latitude: value.latitude });
                let area = regionName[0].name
                let city = regionName[0].city
                global.city = city
                let district = regionName[0].subregion
                let postalCode = regionName[0].postalCode
                global.postCode = postalCode
                console.log("WORK PLIS: ", global.postCode)
            } catch (err) {
                console.log(err)
            }
            console.log("User token: ", userToken)
            dispatch({ type: 'RETRIEVE_TOKEN', token: userToken })
        }, 1000)
    }, [showSignInError])

    // const [isLoading, setIsLoading] = useState(true)
    // const [userToken, setUserToken] = useState(null)

    const initialLoginState = {
        isLoading: true,
        userName: null,
        userToken: null,
    };

    const loginReducer = (prevState, action) => {
        switch (action.type) {
            case 'RETRIEVE_TOKEN':
                return {
                    ...prevState,
                    userToken: action.token,
                    isLoading: false,
                };
            case 'LOGIN':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    isLoading: false,
                };
            case 'LOGOUT':
                return {
                    ...prevState,
                    userName: null,
                    userToken: null,
                    isLoading: false,
                };
            case 'REGISTER':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    isLoading: false,
                };
        }
    };

    const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

    const authContext = useMemo(() => ({
        signIn: async (userName, password) => {
            // setUserToken('ahsg')
            // setIsLoading(false)
            setSignInLoad(true)
            console.log("Username: ", userName)
            let userToken;
            userToken = null
            try {
                let result = await props.loginQuery({
                    variables: {
                        email: userName,
                        password
                    }
                })
                console.log("Result: ", result)
                let cls = "";
                if (result.data.login) {
                    cls = "success";
                    global.tempo = result.data.login.token;
                    await AsyncStorage.setItem('userToken', result.data.login.token)
                } else {
                    cls = "error";
                }
                setSignInLoad(false)
                userToken = result.data.login.token
            } catch (err) {
                console.log("Sign in error: ", err)
                setSignInError(err.message)
                setShowSignInError(true)
            }
            console.log("User token: ", userToken)
            dispatch({ type: 'LOGIN', id: userName, token: userToken })
        },
        signOut: async () => {
            // setUserToken(null)
            // setIsLoading(false)
            try {
                global.tempo = ''
                await AsyncStorage.removeItem('userToken')
            } catch (err) {
                console.log(err)
            }
            dispatch({ type: 'LOGOUT' })
        },
        signUp: async (name, email, password, address, dob) => {
            // setUserToken('ahsg')
            // setIsLoading(false)

            try {
                let res = await props.addUser({
                    variables: {
                        name,
                        email,
                        password,
                        dob,
                        address
                    }
                })

                setShowSignIn(true)
                console.log("Res: ", res)
            } catch (err) {
                console.log(err)
            }
        }
    }), [])

    if (loginState.isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <PacmanIndicator color='white' />
            </View>
        )
    }

    const showLogin = (show) => {
        setShowSignIn(show)
    }

    return (
        <AuthContext.Provider value={authContext}>

            {
                loginState.userToken !== null ?
                    <NavigationContainer>
                        <Tab.Navigator
                            screenOptions={({ route }) => ({
                                tabBarIcon: ({ focused, color, size }) => {
                                    let iconName;

                                    if (route.name === 'Report') {
                                        iconName = focused
                                            ? 'warning'
                                            : 'warning-outline';
                                    } else if (route.name === 'Map') {
                                        iconName = focused ? 'map-outline' : 'map-outline';
                                    } else if (route.name === 'Home') {
                                        iconName = focused ? 'home-outline' : 'home-outline';
                                    } else if (route.name === 'Profile') {
                                        iconName = focused ? 'person-outline' : 'person-outline';
                                    } else if (route.name === 'Directions') {
                                        iconName = focused ? 'compass-outline' : 'compass-outline';
                                    }

                                    // You can return any component that you like here!
                                    return <Ionicons name={iconName} size={size} color={color} />;
                                },
                            })}
                            tabBarOptions={{
                                activeTintColor: 'black',
                                inactiveTintColor: 'grey',
                            }}
                            appearance={{
                                tabBarBackground: '#000000',
                                activeTabBackgrounds: ['#ffffff', '#f44336', '#ffffff', '#ffffff', '#7768D8'],
                            }}
                        >
                            <Tab.Screen name="Home" component={HomePage} />
                            <Tab.Screen name="Report" component={ReportPage} />
                            <Tab.Screen name="Map" component={ClusterMap} />
                            <Tab.Screen name="Directions" component={Directions} />
                            <Tab.Screen name="Profile" component={Profile} />
                            {/*<Tab.Screen name="TestMap" component={Acce} />*/}
                        </Tab.Navigator>
                    </NavigationContainer> : showSignIn ? <SignUp showLogin={showLogin} /> : <Login show={showSignInError} signInError={signInError} load={signInLoad} showLogin={showLogin}/>
            }


        </AuthContext.Provider>
    )
}

export default compose(
    graphql(users, { name: "users" }),
    graphql(addUser, { name: "addUser" }),
    graphql(loginQuery, { name: "loginQuery" })
)(Main)
