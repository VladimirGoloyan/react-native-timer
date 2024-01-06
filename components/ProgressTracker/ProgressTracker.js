import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';
import Colors from '../../shared/colors';
import {texts} from "../../shared/constants";


const ProgressTracker = (props) => {
    const reduxWaterGoal = useSelector(state => state.water.waterGoal)
    const dailyProgress = useSelector(state => state.water.waterProgress)

    const progressCalculator = (current, goal) => {
        const progressCalculation = current / goal * 100;
        return Math.floor(+progressCalculation)
    }

    const currentProgress = progressCalculator(dailyProgress, reduxWaterGoal)

    const progressInt = parseInt(currentProgress);

    const progressText = (currentProgress < 20) ? texts.progressTracker.bad :
        (currentProgress < 40) ? texts.progressTracker.disregard :
            (currentProgress < 60) ? texts.progressTracker.selfish :
                (currentProgress < 80) ? texts.progressTracker.effort :
                    (currentProgress < 100) ? texts.progressTracker.almost : texts.progressTracker.champ

    const progressStyles = {
        alignContent: 'flex-start',
        height: 30,
        backgroundColor: Colors.accentColorBlue,
        width: `${progressInt}%`,
        maxWidth: '100%',
        minWidth: '0%',
    }

    return (
        <View style={styles.progressComponent}>
            <Text style={styles.progressText}>{currentProgress}%</Text>
            <Text style={styles.statusText}>{progressText}</Text>

            {
                progressInt > 0 && <View style={progressStyles}></View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    progressComponent: {
        justifyContent: 'center',
    },
    progressText: {
        // fontFamily: 'inconsolata-regular',
        textAlign: 'center',
        marginTop: 15,
        fontSize: 35,
        color: 'white',
    },
    statusText: {
        // fontFamily: 'inconsolata-regular',
        textAlign: 'center',
        marginTop: 15,
        fontSize: 18,
        color: 'white',
        paddingBottom: '5%'
    }
})

export default ProgressTracker;
