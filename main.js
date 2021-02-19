import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useMemo, useReducer } from 'react';
import { Container, Footer, FooterTab, Button, Icon } from 'native-base'
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from './auth/context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { users, addUser, loginQuery } from './queries/query'


function Main(props) {

    const [showSignIn, setShowSignIn] = useState(false)
    const Tab = createBottomTabNavigator();

    useEffect(() => {
        setTimeout(async () => {
            //setIsLoading(false)
            let userToken = null
            try {
                await AsyncStorage.getItem('userToken', userToken)
            } catch (err) {
                console.log(err)
            }
            console.log("User token: ", userToken)
            dispatch({ type: 'RETRIEVE_TOKEN', token: userToken })
        }, 1000)
    }, [])

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
                    await AsyncStorage.setItem('userToken', result.data.login.token)
                } else {
                    cls = "error";
                }
                userToken = result.data.login.token
            } catch (err) {
                console.log("Sign in error: ", err)
            }
            console.log("User token: ", userToken)
            dispatch({ type: 'LOGIN', id: userName, token: userToken })
        },
        signOut: async () => {
            // setUserToken(null)
            // setIsLoading(false)
            try {
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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    const showLogin = () => {
        setShowSignIn(true)
    }

    return (
        <AuthContext.Provider value={authContext}>

            {
                loginState.userToken !== null ?
                    <NavigationContainer theme={DarkTheme}>
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
                                    }

                                    // You can return any component that you like here!
                                    return <Ionicons name={iconName} size={size} color={color} />;
                                },
                            })}
                            tabBarOptions={{
                                activeTintColor: 'tomato',
                                inactiveTintColor: 'gray',
                            }}
                        >
                            <Tab.Screen name="Home" component={HomePage} />
                            <Tab.Screen name="Report" component={ReportPage} />
                            <Tab.Screen name="Map" component={ClusterMap} />
                            <Tab.Screen name="Profile" component={Profile} />
                        </Tab.Navigator>
                    </NavigationContainer> : showSignIn ?  <SignUp showLogin={showLogin} /> : <Login />
            }


        </AuthContext.Provider>
    )
}

export default compose(
    graphql(users, { name: "users" }),
    graphql(addUser, { name: "addUser" }),
    graphql(loginQuery, { name: "loginQuery" })
)(Main)