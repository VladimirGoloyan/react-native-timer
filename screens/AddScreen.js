import React, {useState, useEffect} from "react";
import {
    Text,
    StyleSheet,
    View,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useDispatch, useSelector} from "react-redux";
import {Slider, Button} from "react-native-elements";

import CustomButton from "../components/Custom Button/CutsomButton";
import ProgressTracker from "../components/ProgressTracker/ProgressTracker";
import {
    updateDailyConsumption,
    setNewGoal,
    resetDailyConsumption,
    setAppReady,
} from "../store/water-actions";
import {Ionicons} from "@expo/vector-icons";
import {SLIDER_VALUES, STORAGE_KEYS, texts, UPDATE_DIRECTIONS, VIEW_OS} from "../shared/constants";
import Colors from "../shared/colors";

const AddScreen = () => {
    const [quantitySelected, setQuantitySelected] = useState(1);
    const [cupsSelected, setCupsSelected] = useState(1);
    const dailyProgress = useSelector((state) => state.water.waterProgress);
    const isAppReady = useSelector((state) => state.water.isAppReady);

    const dispatch = useDispatch();

    useEffect(() => {
        getWaterGoal();
        getWaterProgress();
        dispatch(setAppReady());
    }, []);

    const addWaterProgress = async () => {
        const litersSelected = +(quantitySelected / SLIDER_VALUES.DIVISION * cupsSelected);
        const updatedDailyConsumption = dailyProgress + litersSelected;
        if (litersSelected < 0 && dailyProgress < Math.abs(litersSelected)) {
            await dispatch(resetDailyConsumption());
        } else {
            await dispatch(updateDailyConsumption(updatedDailyConsumption));
        }
        await setCupsSelected(SLIDER_VALUES.MIN);
    };

    const updateMultiplier = async (direction) => {
        if (direction === UPDATE_DIRECTIONS.MORE) {
            await setCupsSelected(cupsSelected + 1);
        }
        if (direction === UPDATE_DIRECTIONS.LESS) {
            if (cupsSelected !== 1) {
                await setCupsSelected(cupsSelected - 1);
            }
        }
    };


    const getWaterGoal = async () => {
        try {
            let reduxGoal;
            const waterGoal = await AsyncStorage.getItem(STORAGE_KEYS.WATER_GOAL);
            const currentGoal = JSON.parse(waterGoal);

            if (currentGoal) {
                reduxGoal = currentGoal;
                dispatch(setNewGoal(reduxGoal));
            } else {
                reduxGoal = 8;
                dispatch(setNewGoal(reduxGoal));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getWaterProgress = async () => {
        try {
            let reduxProgress;
            const waterProgress = await AsyncStorage.getItem(STORAGE_KEYS.WATER_PROGRESS);
            const currentProgress = JSON.parse(waterProgress);

            if (currentProgress) {
                reduxProgress = currentProgress;
                dispatch(updateDailyConsumption(reduxProgress));
            } else {
                dispatch(resetDailyConsumption());
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (!isAppReady) {
        <ActivityIndicator size="large" color={Colors.primary}/>;
    }

    return (
        <View style={styles.screen}>
            <View style={styles.pickerSection}>
                <Text style={styles.title}>{texts.addScreen.size}</Text>
                <View style={styles.sliderStyle}>
                    <Slider
                        value={quantitySelected}
                        minimumValue={SLIDER_VALUES.MIN}
                        maximumValue={SLIDER_VALUES.MAX}
                        step={SLIDER_VALUES.STEP}
                        thumbTintColor={Colors.accentColorBlue}
                        onValueChange={(value) => setQuantitySelected(value)}
                    />
                    <Text
                        style={styles.sliderText}>{quantitySelected / SLIDER_VALUES.DIVISION}{texts.addScreen.liters}</Text>
                </View>
            </View>
            <View style={styles.quantitySection}>
                <Text style={styles.title}>{texts.addScreen.count}</Text>
                <View style={styles.buttonContainer}>
                    <CustomButton
                        onPress={() => {
                            updateMultiplier(UPDATE_DIRECTIONS.LESS);
                        }}
                    >
                        <Ionicons
                            name="ios-remove-circle-outline"
                            size={50}
                            color={Colors.accentColorBlue}
                        />
                    </CustomButton>
                    <Text style={styles.quantityText}>{cupsSelected}</Text>
                    <CustomButton
                        onPress={() => {
                            updateMultiplier(UPDATE_DIRECTIONS.MORE);
                        }}
                    >
                        <Ionicons
                            name="ios-add-circle-outline"
                            size={50}
                            color={Colors.accentColorBlue}
                        />
                    </CustomButton>
                </View>
            </View>
            <View style={Platform.OS === VIEW_OS.ANDROID ? styles.androidFocusButtons : ""}>
                <View>
                    <Button
                        title={texts.addScreen.addButton}
                        style={styles.focusButton}
                        color={Colors.accentColorBlue}
                        onPress={addWaterProgress}
                    />

                </View>
                <View>
                    <Button
                        title={texts.addScreen.resetButton}
                        style={styles.focusButton}
                        color={Colors.accentColorBlue}
                        buttonStyle={{backgroundColor: "red"}}
                        onPress={() => dispatch(resetDailyConsumption())}
                    />
                </View>
            </View>
            <ProgressTracker/>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.primaryColor,
        padding: 10,
    },
    title: {
        fontSize: 20,
        color: "white",
    },
    androidFocusButtons: {
        margin: 0,
        paddingLeft: "20%",
        paddingRight: "20%",
        padding: "1%",
        paddingBottom: "5%",
        paddingVertical: "5%",
    },
    focusButton: {
        width: "100%",
        margin: 0,
        paddingLeft: "20%",
        paddingRight: "20%",
        color: Colors.accentColorBlue,
        padding: "1%",
        paddingBottom: "5%",
    },
    pickerSection: {
        marginTop: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    quantitySection: {
        justifyContent: "center",
        alignItems: "center",
    },
    quantityText: {
        // fontFamily: 'inconsolata-regular',
        fontSize: 50,
        color: "white",
    },
    sliderStyle: {
        width: "70%",
        height: 132,
        margin: 15,
        maxWidth: "60%",
    },
    sliderText: {
        // fontFamily: 'inconsolata-regular',
        textAlign: "center",
        fontSize: 35,
        color: "white",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: Dimensions.get("window").height > 600 ? 20 : 10,
        width: 300,
        maxWidth: "80%",
    },
    submitContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        width: "40%",
    },
});

export default AddScreen;
