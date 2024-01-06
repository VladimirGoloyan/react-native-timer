import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, View, Dimensions, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import CutsomButton from '../components/Custom Button/CutsomButton';
import {Ionicons} from '@expo/vector-icons';
import {setNewGoal} from '../store/water-actions';
import Colors from '../shared/colors';
import {texts, UPDATE_DIRECTIONS} from "../shared/constants";

const GoalScreen = () => {
    const [waterGoal, setWaterGoal] = useState(2);
    const reduxWaterGoal = useSelector(state => state.water.waterGoal)

    const dispatch = useDispatch()

    useEffect(() => {
        setWaterGoal((reduxWaterGoal))
    }, []);

    const adjustWaterHandler = async (direction) => {
        if (direction === UPDATE_DIRECTIONS.MORE) {
            await dispatch(setNewGoal(waterGoal + 1))
            await setWaterGoal(waterGoal + 1)
        }
        if (direction === UPDATE_DIRECTIONS.LESS) {
            if (waterGoal <= 2) {
                Alert.alert(texts.goalScreen.cantGoLower, texts.goalScreen.notChamp, [
                    {text: texts.goalScreen.alright}
                ]);
                return;
            }
            await dispatch(setNewGoal(waterGoal - 1))
            await setWaterGoal(waterGoal - 1)
        }
    }


    return (
        <View style={styles.screen}>
            <Text style={styles.goalPrompt}>{texts.goalScreen.heading}</Text>
            <View style={styles.buttonContainer}>
                <CutsomButton onPress={() => adjustWaterHandler(UPDATE_DIRECTIONS.LESS)}>
                    <Ionicons name="ios-remove-circle-outline" size={50} color={Colors.accentColorBlue}/>
                </CutsomButton>
                <Text style={styles.goalNumber}>{waterGoal}</Text>
                <CutsomButton onPress={() => adjustWaterHandler(UPDATE_DIRECTIONS.MORE)}>
                    <Ionicons name="ios-add-circle-outline" size={50} color={Colors.accentColorBlue}/>
                </CutsomButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: Dimensions.get('window').height > 600 ? 20 : 10,
        width: 300,
        maxWidth: '80%'
    },
    goalNumber: {
        fontSize: 50,
        color: 'white'
    },
    goalPrompt: {
        margin: 10,
        textAlign: 'center',
        color: 'white'
    }
})

export default GoalScreen;
