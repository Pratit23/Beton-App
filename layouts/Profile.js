import React, { useState, useRef, useEffect, useContext, useCallback } from 'react'
import { StyleSheet, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text } from 'native-base'
import { Col, Row, Grid } from "react-native-easy-grid";
import LottieView from 'lottie-react-native';
import { useFonts } from 'expo-font';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'
import { AuthContext } from '../auth/context'
import { flowRight as compose } from 'lodash';
import { graphql } from 'react-apollo'
import AllReports from "./AllReports";
import { addBaseReport, addReport, decrypt, existingBaseCoordinate } from '../queries/query'
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get("screen");

function Profile(props) {

    const { signOut } = useContext(AuthContext)
    const [showAllReports, setShowAllReports] = useState(false)
    const animation = useRef(null);

    const changeView = (check) => {
        setShowAllReports(check)
    }

    useFocusEffect(
        useCallback(() => {
            // Do something when the screen is focused
            setTimeout(() => {
                animation.current.play();
            }, 200);
            return () => {
                setShowAllReports(false)
            };
        }, [])
    );

    useEffect(() => {
        setTimeout(() => {
            animation.current.play();
        }, 200);
    }, [])

    const [loaded] = useFonts({
        Lexand: require('../assets/font/LexendDeca-Regular.ttf'),
    });

    return (
        <>
            {
                !showAllReports ?
                    <Container style={{ backgroundColor: 'rgb(35, 37, 47)' }}>
                        <Grid>
                            <Row size={1.8} style={{ backgroundColor: 'rgb(35, 37, 47)' }}>
                                <LottieView ref={animation} source={require('../assets/Lottie/shapes.json')} loop={false} />
                                <Image
                                    source={require('../imgs/prof.jpg')}
                                    style={styles.avatar}
                                />
                                <Text onPress={() => signOut()} style={{ fontFamily: 'Lexand', fontSize: 20, marginTop: height * 0.06, color: '#6E727F', marginLeft: width * 0.08 }}>Log Out</Text>
                            </Row>
                            <Row size={2.2} style={{ backgroundColor: '#171A1F', borderTopRightRadius: 32, borderTopLeftRadius: 32 }}>
                                {
                                    loaded && props && props.decrypt && props.decrypt.loading == false && props.decrypt.decrypt ?
                                        <>
                                            <View style={{ height: height * 0.47, width: width, marginLeft: width * 0.05 }}>
                                                <Text style={{ fontFamily: 'Lexand', fontSize: 40, marginTop: height * 0.07, color: '#fff', marginLeft: width * 0.05 }}>{(props.decrypt.decrypt.name.split(" "))[0]}</Text>
                                                <Text style={{ fontFamily: 'Lexand', fontSize: 40, color: '#fff', marginLeft: width * 0.05 }}>{(props.decrypt.decrypt.name.split(" "))[1]}</Text>
                                                {
                                                    props && props.decrypt && props.decrypt.loading == false && props.decrypt.decrypt ?
                                                        <>
                                                            {
                                                                props.decrypt.decrypt.karma < 25 ?
                                                                    <Text style={{ fontFamily: 'Lexand', fontSize: 20, marginTop: height * 0.02, color: '#6E727F', marginLeft: width * 0.05 }}>Beginner</Text> :
                                                                    props.decrypt.decrypt.karma < 65 ?
                                                                        <Text style={{ fontFamily: 'Lexand', fontSize: 20, marginTop: height * 0.02, color: '#6E727F', marginLeft: width * 0.05 }}>Intermediate</Text> :
                                                                        <Text style={{ fontFamily: 'Lexand', fontSize: 20, marginTop: height * 0.02, color: '#6E727F', marginLeft: width * 0.05 }}>Pro</Text>
                                                            }
                                                        </> : <Text size={16} color="#ffffff" style={{ marginTop: 10 }}>Loading...</Text>
                                                }

                                                <Row style={{ marginLeft: width * 0.05 }}>
                                                    <Col style={{ marginTop: height * 0.05 }}>
                                                        <Text style={{ fontFamily: 'Lexand', fontSize: 15, color: '#6E727F' }}>Reports</Text>
                                                        <Text style={{ fontFamily: 'Lexand', fontSize: 25, color: '#fff', marginLeft: width * 0.03 }}>{props.decrypt.decrypt.reports.length}</Text>
                                                    </Col>
                                                    <Col style={{ marginTop: height * 0.05 }}>
                                                        <Text style={{ fontFamily: 'Lexand', fontSize: 15, color: '#6E727F' }}>Completed</Text>
                                                        <Text style={{ fontFamily: 'Lexand', fontSize: 25, color: '#fff', marginLeft: width * 0.05 }}>69</Text>
                                                    </Col>
                                                    <Col style={{ marginTop: height * 0.05 }}>
                                                        <Text style={{ fontFamily: 'Lexand', fontSize: 15, color: '#6E727F' }}>Rewards</Text>
                                                        <Text style={{ fontFamily: 'Lexand', fontSize: 25, color: '#fff', marginLeft: width * 0.03 }}>40</Text>
                                                    </Col>
                                                </Row>
                                                <TouchableOpacity onPress={() => changeView(true)} style={{ height: height * 0.14, width: width }}>
                                                    <Card style={{ borderRadius: 24, backgroundColor: '#7768D8', marginRight: width * 0.11 }}>
                                                        <CardTitle
                                                            title="Your Reports"
                                                            subtitle="Click to view all your reports"
                                                        />
                                                    </Card>
                                                </TouchableOpacity>
                                            </View>
                                        </>
                                        : null
                                }
                            </Row>
                        </Grid>
                    </Container> : <AllReports changeView={changeView} decrypt={props.decrypt} />
            }
        </>
    )
}

const styles = StyleSheet.create({
    avatar: {
        width: width * 150 / width,
        height: height * 150 / height,
        borderRadius: 75,
        borderWidth: 0,
        marginTop: height * 0.11,
        marginLeft: width * 0.31
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
    })
)(Profile)
