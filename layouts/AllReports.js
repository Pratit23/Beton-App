import React, { useState, useEffect, useCallback } from 'react'
import { addBaseReport, addReport, decrypt, existingBaseCoordinate } from '../queries/query'
import { flowRight as compose } from 'lodash';
import { graphql } from 'react-apollo'
import { List, ListItem, Button, Text } from 'native-base';
import { ScrollView, Dimensions, View } from 'react-native'
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'
import Individual from './Individual'
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get("screen");

export default function AllReports(props) {

    const [indData, setIndData] = useState(null)
    const [showInd, setShowInd] = useState(false)

    const getDeets = (loco, id, reportAt, reportOn, address) => {
        setIndData({
            loco: loco,
            id: id,
            reportAt: reportAt,
            reportOn: reportOn,
            address: address
        })
        setShowInd(true)
    }

    useFocusEffect(
        useCallback(() => {
            // Do something when the screen is focused
            return () => {
                props.changeView(false)
            };
        }, [])
    );

    const goBack = (check) => {
        props.changeView(check)
    }

    return (
        <>
            {
                !showInd ?
                    <View style={{ flex: 1, backgroundColor: 'black' }}>
                        <ScrollView style={{ height: height, width: width, marginTop: height * 0.05, borderTopLeftRadius: 24, borderTopRightRadius: 24 }} itemDivider={false}>
                            {
                                props.decrypt && props.decrypt.decrypt && props.decrypt.decrypt.reports ?
                                    <List style={{ backgroundColor: '#cfd8dc', borderRadius: 24 }}>
                                        {
                                            props.decrypt.decrypt.reports.map((report, key) => {
                                                console.log("Check Report: ", report)
                                                var title = report.address.split(',')
                                                return (
                                                    <View style={{ flex: 1 }} key={key}>
                                                        <Card style={{ borderRadius: 24, backgroundColor: '#fff'}}>
                                                            <CardTitle
                                                                title={(title[title.length - 4] + ', ' + title[title.length - 3]).trim()}
                                                                subtitle={report.reportedAt}
                                                            />
                                                            <CardContent text={report.address} />
                                                            <CardAction
                                                                separator={true}
                                                                inColumn={false}>
                                                                <CardButton
                                                                    onPress={() => getDeets(report.location, report.id, report.reportedAt, report.reportedOn, report.address)}
                                                                    title="View Details"
                                                                    color="#129EAF"
                                                                />
                                                            </CardAction>
                                                        </Card>
                                                    </View>
                                                )
                                            })
                                        }
                                    </List> : null
                            }
                        </ScrollView>
                        <Button iconLeft onPress={() => goBack(false)} style={{ width: width, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 20, color: 'black' }}>Back</Text></Button>
                    </View> :
                    <Individual indData={indData} back={goBack}/>

            }
        </>
    )
}

