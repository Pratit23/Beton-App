import React, { useEffect, useState, useContext, useRef } from "react";
import {
    StyleSheet,
    ImageBackground,
    Dimensions,
    StatusBar,
    KeyboardAvoidingView,
    ScrollView,
    View,
    Image
} from "react-native";
import { Block, Checkbox, Text, theme, Button } from "galio-framework";
import { Icon, Input } from "../components";
import { Images } from "../constants";
import { AuthContext } from './context'
import { selectHttpOptionsAndBody } from "@apollo/client";
import DateTimePicker from '@react-native-community/datetimepicker';
import LottieView from 'lottie-react-native';
import { Container, Header, Content, Footer, FooterTab } from 'native-base'
import { Col, Row, Grid } from "react-native-easy-grid";
import GradientButton from 'react-native-gradient-buttons';
import { useFonts } from 'expo-font';

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

const Register = (props) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [address, setAddress] = useState('')
    const [dob, setDob] = useState(new Date())
    const { signUp } = useContext(AuthContext)
    const [emailError, setEmailError] = useState(false)
    const [passError, setPassError] = useState(false)
    const animation = useRef(null);
    const [showTimePicker, setShowTimePicker] = useState(false)

    console.log("Name: ", name)
    console.log("Email: ", email)
    console.log("Password: ", password)
    console.log("Address: ", address)
    console.log("DOB: ", dob)

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
            setPassError(true)
        } else {
            setPassError(false)
            console.log("test")
        }
    }

    const signUpHandle = () => {
        if (!emailError && !passError && address !== '') {
            signUp(name, email, password, address, dob)
        } else {
            alert('Please fill all the required fields')
        }
    }

    const valDob = (selectDate) => {
        setDob(selectDate)
        console.log("Selected dob: ", dob)
    }

    const sendVal = () => {
        props.showLogin(false)
    }

    const [loaded] = useFonts({
        Lexand: require('../assets/font/LexendDeca-Regular.ttf'),
    });

    useEffect(() => {
        setTimeout(() => {
            animation.current.play();
        }, 200);
    }, [])

    return (
        <Container style={{ backgroundColor: 'rgb(35, 37, 47)' }}>
            <Grid>
                <Row size={1.5} style={{ backgroundColor: 'rgb(35, 37, 47)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ height: height * 0.6, width: width * 0.6, marginBottom: height * 0.06 }}>
                        <LottieView ref={animation} source={require('../assets/Lottie/signUpBack.json')} loop={true} />
                    </View>
                </Row>
                <View style={{ height: height * 0.12, width: width, position: 'absolute', marginTop: height * 0.27 }}>
                    <Image style={{ height: '100%', width: '100%' }} source={require('../imgs/wave-haikei.png')} />
                </View>
                <View style={{ height: height * 0.12, width: width, position: 'absolute', marginTop: height * 0.13, marginLeft: width * 0.29 }}>
                    {
                        loaded ?
                            <Text style={{ fontFamily: 'Lexand', fontSize: 50, color: 'white' }}>Sign Up</Text> : null
                    }
                </View>
                <Row size={2} style={{ backgroundColor: '#fff' }}>
                    <ScrollView>
                        <Col style={{ justifyContent: 'center', alignItems: 'center', paddingTop: height * 0.02 }}>
                            <Block width={width * 0.8} style={{ marginBottom: 15, borderBottomWidth: 1, borderStyle: 'solid', borderColor: '#D2D2D2' }}>
                                <Input
                                    onChangeText={(text) => setName(text)}
                                    borderless
                                    placeholder="Name"
                                    iconContent={
                                        <Icon
                                            size={16}
                                            color={argonTheme.COLORS.ICON}
                                            name="hat-3"
                                            family="ArgonExtra"
                                            style={styles.inputIcons}
                                        />
                                    }
                                    style={{
                                        backgroundColor: 'transparent'
                                    }}
                                />
                            </Block>
                            <Block width={width * 0.8} style={{ marginBottom: 15, borderBottomWidth: 1, borderStyle: 'solid', borderColor: '#D2D2D2' }}>
                                <Input
                                    onChangeText={(text) => checkEmail(text)}
                                    borderless
                                    placeholder="Email"
                                    iconContent={
                                        <Icon
                                            size={16}
                                            color={argonTheme.COLORS.ICON}
                                            name="ic_mail_24px"
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
                                            name="padlock-unlocked"
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
                            <Block width={width * 0.8} style={{ marginBottom: 15, borderBottomWidth: 1, borderStyle: 'solid', borderColor: '#D2D2D2' }}>
                                <Input
                                    onChangeText={(text) => setAddress(text)}
                                    borderless
                                    placeholder="Address"
                                    iconContent={
                                        <Icon
                                            size={16}
                                            color={argonTheme.COLORS.ICON}
                                            name="ic_mail_24px"
                                            family="ArgonExtra"
                                            style={styles.inputIcons}
                                        />
                                    }
                                    style={{
                                        backgroundColor: 'transparent'
                                    }}
                                />
                            </Block>
                            <Block width={width * 0.8} style={{ marginBottom: 15 / height, marginLeft: width * 0.09 }}>
                                <Row>
                                    <Col>
                                        {
                                            showTimePicker ?
                                                <DateTimePicker
                                                    testID="dateTimePicker"
                                                    value={dob}
                                                    mode={'date'}
                                                    is24Hour={false}
                                                    display="default"
                                                    onChange={() => valDob}
                                                /> : loaded ? <Button onPress={() => setShowTimePicker(true)} shadowless={true} style={{ fontFamily: 'Lexand', fontSize: 17, backgroundColor: '#F1EFF2', height: height * 0.035, marginTop: height * 0.004, marginLeft: 0, width: width * 0.26 }}><Text style={{ color: '#44A0F7', fontFamily: 'Lexand', fontSize: 16 }}>Select DOB</Text></Button> : null
                                        }
                                    </Col>
                                    <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        {
                                            loaded ?
                                                <Button shadowless={true} style={{ fontFamily: 'Lexand', fontSize: 17, backgroundColor: '#F1EFF2', height: height * 0.035, marginTop: height * 0.004, marginRight: width * 0.1 }}><Text style={{ color: '#44A0F7', fontFamily: 'Lexand', fontSize: 16 }}>Upload Picture</Text></Button> : null
                                        }
                                    </Col>
                                </Row>
                            </Block>
                            <Block middle style={{ marginTop: height * 0.05 }}>
                                {
                                    loaded ?
                                        <Text onPress={() => sendVal()} style={{ fontFamily: 'Lexand', fontSize: 17, color: '#F21B3F' }}>or Sign In</Text> : null
                                }
                            </Block>
                        </Col>
                    </ScrollView>
                </Row>
                <View style={{ height: height * 0.1, width: width, paddingRight: width * 0.1, paddingLeft: width * 0.08, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                    <GradientButton
                        text="Create"
                        gradientBegin="#F21B3F"
                        gradientEnd="#D9594C"
                        gradientDirection="diagonal"
                        width={'100%'}
                        height={'60%'}
                        impact
                        impactStyle='Heavy'
                        onPressAction={() => signUpHandle()}
                    />
                </View>
            </Grid>
        </Container>
    );
}

const styles = StyleSheet.create({
    registerContainer: {
        width: width * 0.9,
        height: height * 0.85,
        backgroundColor: "rgba(244, 245, 247, 0.7)",
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
        top: height * 0.03,
        borderRadius: 24
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
    }
});

export default Register;
