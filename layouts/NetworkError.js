import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Alert, Image, Dimensions, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';
import GradientButton from 'react-native-gradient-buttons';

const { width, height } = Dimensions.get("screen");

export default function NetworkError(props) {

    const animation = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            animation.current.play();
        }, 200);
    }, [])

    return (
        <View style={{ height: height, width: width, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>

            <StatusBar
                animated={true}
                barStyle='dark-content' />
            <View style={{ height: height * 0.5, width: width }}>
                <LottieView ref={animation} source={require('../assets/Lottie/error.json')} loop={true} />
            </View>
            <Text style={{ color: 'black' }}>Oops! Something went wrong!</Text>
            <Text style={{ color: 'black' }}>Please check your internet connection</Text>
            <View style={{ height: height * 0.2, width: width * 0.3 }}>
                <GradientButton
                    text="Reload"
                    gradientBegin="#F21B3F"
                    gradientEnd="#D9594C"
                    gradientDirection="diagonal"
                    width={'100%'}
                    height={'40%'}
                    impact
                    impactStyle='Heavy'
                    onPressAction={() => props.reset()}
                    style={{ marginTop: 20 }}
                />
            </View>
        </View>
    )
}
