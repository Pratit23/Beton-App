import React, { useState, useEffect } from 'react'
import { Text, View, Dimensions } from 'react-native'
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import { flowRight as compose } from 'lodash';
import { graphql } from 'react-apollo'
import { addBaseReport, addReport, decrypt, existingBaseCoordinate } from '../queries/query'
import { useLazyQuery } from 'react-apollo';
import { Spinner } from 'native-base'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;

const Nearby = (props) => {

    const [chartLabels, setChartLabels] = useState()
    const [chartData, setChartData] = useState()
    const [load, setLoad] = useState(true)

    const [getChartData, { called, loading, data }] = useLazyQuery(
        decrypt,
        {
            variables: {
                token: global.tempo
            }
        }
    );

    useEffect(() => {

        var temp = {}

        getChartData()

        if (data) {
            if (!loading) {
                data.decrypt.reports.map((report, key) => {
                    // *Sort according to month
                    // var t = (report.reportedAt).split(" ")
                    // console.log("t: ", t)
                    // if (!(t[3] in temp)) {
                    //     temp[t[3]] = {}
                    //     if (!(t[1] in temp[t[3]])) {
                    //         temp[t[3]][t[1]] = 0
                    //     } else {
                    //         temp[t[3]][t[1]] = temp[t[3]][t[1]] + 1
                    //     }
                    // } else {
                    //     if (!(t[1] in temp[t[3]])) {
                    //         temp[t[3]][t[1]] = 0
                    //     } else {
                    //         temp[t[3]][t[1]] = temp[t[3]][t[1]] + 1
                    //     }
                    // }

                    // *Sort according to day
                    var t = (report.reportedAt).split(" ")
                    var combined = t[1] + t[2] + t[3]
                    if (!(combined in temp)) {
                        temp[combined] = 1
                    } else {
                        temp[combined] = temp[combined] + 1
                    }
                })
                var te = Object.keys(temp)

                var tee = Object.values(temp)

                if (te.length === 0 || tee.length === 0) {
                    setChartLabels([])
                    setChartData([])
                } else {
                    const c = te.map((t, key) => {
                        let v = t.substr(0, 5)
                        return v
                    })
                    var b = c.slice(c.length - 5, c.length)
                    var x = tee.slice(tee.length - 5, tee.length)
                    setChartLabels(b)
                    setChartData(x)
                    setLoad(false)
                }
            }
        }

    }, [data])

    return (
        <>
            {
                !load ?
                    <LineChart
                        data={{
                            labels: chartLabels,
                            datasets: [
                                {
                                    data: chartData
                                }
                            ]
                        }}
                        width={width * 0.66} // from react-native
                        height={height * 0.25}
                        yAxisLabel=""
                        yAxisSuffix=""
                        // withHorizontalLabels={false}
                        // withVerticalLabels={false}
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                            backgroundColor: "#e26a00",
                            backgroundGradientFrom: props.backgroundGradientFrom,
                            backgroundGradientTo: props.backgroundGradientTo,
                            decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#ffa726"
                            }
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                        onDataPointClick={() => {
                            console.log("Clicked")
                        }}
                    /> :
                    <SkeletonPlaceholder highlightColor={'#ffffff'}>
                        <View style={{ height: height * 0.25, width: width * 0.67, borderRadius: 16 }}>

                        </View>
                    </SkeletonPlaceholder>
            }
        </>
    )
}

export default Nearby