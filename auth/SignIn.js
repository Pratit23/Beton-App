import React, { useEffect, useState, useContext, useRef } from "react";
import {
    StyleSheet,
    ImageBackground,
    Dimensions,
    StatusBar,
    KeyboardAvoidingView,
    ScrollView,
    View,
    ActivityIndicator,
    Image
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import { Button, Input } from "../components";
import { Images } from "../constants";
import { AuthContext } from './context'
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
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppIntroSlider from 'react-native-app-intro-slider';
import LottieView from 'lottie-react-native';
import { Container, Header, Content, Footer, FooterTab, List, ListItem } from 'native-base'
import { Col, Row, Grid } from "react-native-easy-grid";
import GradientButton from 'react-native-gradient-buttons';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';


const { width, height } = Dimensions.get("screen");

const argonTheme = {
    COLORS: {
        DEFAULT: '#172B4D',
        PRIMARY: '#5E72E4',
        SECONDARY: '#F7FAFC',
        LABEL: '#FE2472',
        INFO: '#11CDEF',
        ERROR: '#F5365C',
        SUCCESS: '#2DCE89',
        WARNING: '#FB6340',
        /*not yet changed */
        MUTED: '#ADB5BD',
        INPUT: '#DCDCDC',
        INPUT_SUCCESS: '#7BDEB2',
        INPUT_ERROR: '#FCB3A4',
        ACTIVE: '#5E72E4', //same as primary
        BUTTON_COLOR: '#9C26B0', //wtf
        PLACEHOLDER: '#9FA5AA',
        SWITCH_ON: '#5E72E4',
        SWITCH_OFF: '#D4D9DD',
        GRADIENT_START: '#6B24AA',
        GRADIENT_END: '#AC2688',
        PRICE_COLOR: '#EAD5FB',
        BORDER_COLOR: '#E7E7E7',
        BLOCK: '#E7E7E7',
        ICON: '#172B4D',
        HEADER: '#525F7F',
        BORDER: '#CAD1D7',
        WHITE: '#FFFFFF',
        BLACK: '#000000'
    }
};

const bruh = 'bruh'

const Login = (props) => {

    const slides = [
        {
            key: 'one',
            title: 'Title 1',
            text: 'Description.\nSay something cool',
            //image: require('./assets/1.jpg'),
            backgroundColor: '#F5F5F5',
        },
        {
            key: 'two',
            title: 'Title 2',
            text: 'Other cool stuff',
            //image: require('./assets/2.jpg'),
            backgroundColor: '#F5F5F5',
        },
        {
            key: 'three',
            title: 'Rocket guy',
            text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
            //image: require('./assets/3.jpg'),
            backgroundColor: '#F5F5F5',
        }
    ];


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { signIn } = useContext(AuthContext)
    const [showSplash, setShowSplash] = useState(true)
    const animation = useRef(null);
    const animation1 = useRef(null);
    const animation2 = useRef(null);
    const [emailError, setEmailError] = useState(false)
    const [passError, setPassError] = useState(false)
    const [currentItem, setCurrentItem] = useState(null)

    console.log("Email: ", email)
    console.log("Password: ", password)

    const checkSplash = async () => {
        const splashCheck = await AsyncStorage.getItem('splashToken')
        if (splashCheck != null) {
            setShowSplash(false)
        } else {
            await AsyncStorage.setItem('splashToken', bruh)
        }
    }

    useEffect(() => {
        checkSplash()
    }, [])


    const loginHandle = (userName, password) => {

        if (!emailError && !passError) {
            signIn(userName, password)
        } else {
            alert("Please fill all the required fields")
        }
    }

    const [loaded] = useFonts({
        Lexand: require('../assets/font/LexendDeca-Regular.ttf'),
    });

    const [loaded_bold] = useFonts({
        LexendBold: require('../assets/font/Lexend-SemiBold.ttf'),
    });

    useEffect(() => {
        setTimeout(() => {
            animation.current.play();
        }, 200);
    }, [])

    const checkEmail = (text) => {
        setEmail(text)
        if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))) {
            setEmailError(true)
        } else {
            setEmailError(false)
            console.log("test")
        }
    }
    const checkPassword = (text) => {
        setPassword(text)
        if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/.test(password))) {
            setPassError(false)
        } else {
            setPassError(false)
            console.log("test")
        }
    }

    // useEffect(() => {
    //     console.log("Sign in useffect is running")
    //     console.log("Check this: ", props.show)
    // }, [props.show])

    if (props.load) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <PacmanIndicator color='white' />
            </View>
        )
    }

    const renderNextButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Icon
                    name="arrow-forward-outline"
                    color="rgba(255, 255, 255, .9)"
                    size={24}
                />
            </View>
        );
    };

    const renderPreviousButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Icon
                    name="arrow-back-outline"
                    color="rgba(255, 255, 255, .9)"
                    size={24}
                />
            </View>
        );
    };

    const renderDoneButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Icon
                    name="md-checkmark"
                    color="rgba(255, 255, 255, .9)"
                    size={24}
                />
            </View>
        );
    };

    const runAnimation = (item) => {
        if (item == 0) {
            setTimeout(() => {
                animation.current.play();
            }, 200);
        }
        if (item == 1) {
            setTimeout(() => {
                animation1.current.play();
            }, 200);
        }
        if (item == 2) {
            setTimeout(() => {
                animation2.current.play();
            }, 200);
        }
    }

    const renderItem = ({ item }) => {

        return (
            <View style={{ height: height, width: width }}>
                <Container style={{ backgroundColor: item.backgroundColor }}>
                    <Grid>
                        {
                            item.key == 'one' && loaded && loaded_bold ?
                                <>
                                    <Col>
                                        <Row size={2.3}>
                                            <View style={{ height: height * 0.5, width: width * 1.6, marginTop: height * 0.09, marginLeft: -109 }}>
                                                <LottieView ref={animation} source={require('../assets/Lottie/gift.json')} loop={true} />
                                            </View>
                                        </Row>
                                        <Row size={1.5}>
                                            <View style={{ height: height * 0.1, width: width, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontFamily: 'LexendBold', fontSize: 25, color: 'black' }}>Claim your Rewards!</Text>
                                                <Text style={{ fontFamily: 'Lexand', fontSize: 22, color: '#B4B4B4', textAlign: 'center', marginTop: height * 0.02 }}>Report Potholes easily with quick verification in 3 easy steps</Text>
                                            </View>
                                        </Row>
                                    </Col>
                                </> : null
                        }
                        {
                            item.key == 'two' && loaded_bold && loaded ?
                                <>
                                    <Col>
                                        <Row size={2.3}>
                                            <View style={{ height: height * 0.5, width: width, justifyContent: 'center', alignItems: 'center', marginTop: height * 0.1 }}>
                                                <LottieView ref={animation1} source={require('../assets/Lottie/map.json')} loop={true} />
                                            </View>
                                        </Row>
                                        <Row size={1.5}>
                                            <View style={{ height: height * 0.1, width: width, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontFamily: 'LexendBold', fontSize: 25, color: 'black' }}>Easy Reporting on the Go!</Text>
                                                <Text style={{ fontFamily: 'Lexand', fontSize: 22, color: '#B4B4B4', textAlign: 'center', marginTop: height * 0.02 }}>Report Potholes easily with quick verification in 3 easy steps</Text>
                                            </View>
                                        </Row>
                                    </Col>
                                </> : null
                        }
                        {
                            item.key == 'three' && loaded && loaded_bold ?
                                <>
                                    <Col>
                                        <Row size={2.3}>
                                            <View style={{ height: height * 0.5, width: width * 0.8, justifyContent: 'center', alignItems: 'center', marginTop: height * 0.1, marginLeft: width * 0.096 }}>
                                                <LottieView ref={animation2} source={require('../assets/Lottie/route.json')} loop={true} />
                                            </View>
                                        </Row>
                                        <Row size={1.5}>
                                            <View style={{ height: height * 0.1, width: width, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontFamily: 'LexendBold', fontSize: 25, color: 'black' }}>Plan route without potholes!</Text>
                                                <Text style={{ fontFamily: 'Lexand', fontSize: 22, color: '#B4B4B4', textAlign: 'center', marginTop: height * 0.02, paddingLeft: width * 0.05, paddingRight: width * 0.05 }}>View the potholes on selected route, plan your ride accordingly</Text>
                                            </View>
                                        </Row>
                                    </Col>
                                </> : null
                        }
                    </Grid>
                </Container>
            </View>
        )
    }

    return (
        <>
            {
                !showSplash ?
                    <Container style={{ backgroundColor: 'rgb(35, 37, 47)' }}>
                        <Grid>
                            <Row size={3} style={{ backgroundColor: 'rgb(35, 37, 47)', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ height: height * 0.8, width: width * 0.8, marginBottom: height * 0.06 }}>
                                    <LottieView ref={animation} source={require('../assets/Lottie/signBack.json')} loop={true} />
                                </View>
                            </Row>
                            <View style={{ height: height * 0.12, width: width, position: 'absolute', marginTop: height * 0.36 }}>
                                <Image style={{ height: '100%', width: '100%' }} source={require('../imgs/wave-haikei.png')} />
                            </View>
                            <View style={{ height: height * 0.12, width: width, position: 'absolute', marginTop: height * 0.21, marginLeft: width * 0.29 }}>
                                {
                                    loaded ?
                                        <Text style={{ fontFamily: 'Lexand', fontSize: 50, color: 'white' }}>Sign In</Text> : null
                                }
                            </View>
                            <Row size={2} style={{ backgroundColor: '#fff' }}>
                                <ScrollView style={{ height: height * 0.23 }}>
                                    <Col style={{ justifyContent: 'center', alignItems: 'center', paddingTop: height * 0.06 }}>
                                        <Block width={width * 0.8} style={{ marginBottom: 15, borderBottomWidth: 1, borderStyle: 'solid', borderColor: '#D2D2D2' }}>
                                            <Input
                                                onChangeText={(text) => checkEmail(text)}
                                                borderless
                                                placeholder="Email"
                                                iconContent={
                                                    <Icon
                                                        size={16}
                                                        color={argonTheme.COLORS.ICON}
                                                        name="mail-outline"
                                                        family="ArgonExtra"
                                                        style={styles.inputIcons}
                                                    />
                                                }
                                                style={{
                                                    backgroundColor: 'transparent',
                                                }}
                                            />
                                        </Block>
                                        {

                                            emailError && loaded ?
                                                <Text color="red" size={12}>Please enter a valid email address!</Text> : null

                                        }
                                        <Block width={width * 0.8} style={{ marginBottom: 15, borderBottomWidth: 1, borderStyle: 'solid', borderColor: '#D2D2D2' }}>
                                            <Input
                                                onChangeText={(text) => checkPassword(text)}
                                                password
                                                borderless
                                                placeholder="Password"
                                                iconContent={
                                                    <Icon
                                                        size={16}
                                                        color={argonTheme.COLORS.ICON}
                                                        name="lock-closed-outline"
                                                        family="ArgonExtra"
                                                        style={styles.inputIcons}
                                                    />
                                                }
                                                style={{
                                                    backgroundColor: 'transparent'
                                                }}
                                            />
                                            {
                                                passError ?
                                                    <Text color="red" size={12}>8-10 characters, one uppercase, one lowercase, one number, one special character (atleast)</Text> : null
                                            }
                                        </Block>
                                    </Col>
                                </ScrollView>
                            </Row>
                            <View style={{ height: height * 0.1, width: width, paddingRight: width * 0.1, paddingLeft: width * 0.08, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                                <GradientButton
                                    text="Sign In"
                                    gradientBegin="rgb(35, 37, 47)"
                                    gradientEnd="rgb(35, 37, 47)"
                                    gradientDirection="diagonal"
                                    width={'100%'}
                                    height={'60%'}
                                    impact
                                    impactStyle='Heavy'
                                    onPressAction={() => loginHandle(email, password)}
                                />
                                <View style={{ height: height * 0.05, width: width }}>
                                    <Container>
                                        <Grid>
                                            <Col size={1.33} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ height: '5%', width: '70%', backgroundColor: '#BDBDBD', marginLeft: width * 0.1 }}>

                                                </View>
                                            </Col>
                                            <Col size={0.2} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                {
                                                    loaded ?
                                                        <Text style={{ fontFamily: 'Lexand', fontSize: 20, color: '#BDBDBD' }}>or</Text> : null
                                                }
                                            </Col>
                                            <Col size={1.33} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ height: '5%', width: '70%', backgroundColor: '#BDBDBD', marginRight: width * 0.1 }}>

                                                </View>
                                            </Col>
                                        </Grid>
                                    </Container>
                                </View>
                            </View>
                            <View style={{ height: height * 0.1, width: width, paddingRight: width * 0.1, paddingLeft: width * 0.08, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                                <GradientButton
                                    text="Sign Up"
                                    gradientBegin="rgb(35, 37, 47)"
                                    gradientEnd="rgb(35, 37, 47)"
                                    gradientDirection="diagonal"
                                    width={'100%'}
                                    height={'60%'}
                                    impact
                                    impactStyle='Heavy'
                                    onPressAction={() => props.showLogin(true)}
                                    style={{ marginBottom: height * 0.04 }}
                                />
                            </View>
                        </Grid>
                    </Container> :
                    <AppIntroSlider renderItem={renderItem} data={slides} onDone={() => setShowSplash(false)} activeDotStyle={{ backgroundColor: '#212121' }} renderDoneButton={renderDoneButton}
                        renderNextButton={renderNextButton} renderPrevButton={renderPreviousButton} onSlideChange={(item) => runAnimation(item)} />
            }
        </>
    );
}

const styles = StyleSheet.create({
    registerContainer: {
        width: width * 0.9,
        height: height * 0.6,
        backgroundColor: "#F4F5F7",
        borderRadius: 4,
        shadowColor: argonTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1,
        overflow: "hidden",
    },
    socialConnect: {
        backgroundColor: argonTheme.COLORS.WHITE,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#8898AA"
    },
    socialButtons: {
        width: 120,
        height: 40,
        backgroundColor: "#fff",
        shadowColor: argonTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1
    },
    socialTextButtons: {
        color: argonTheme.COLORS.PRIMARY,
        fontWeight: "800",
        fontSize: 14
    },
    inputIcons: {
        marginRight: 12
    },
    passwordCheck: {
        paddingLeft: 15,
        paddingTop: 13,
        paddingBottom: 30
    },
    createButton: {
        width: width * 0.5,
        marginTop: 25
    },
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Login;
