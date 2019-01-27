import React, { Component } from 'react';
import {
    Image,
    ScrollView,
    Text,
    View,
    TouchableHighlight,
} from 'react-native';

import Customize from './js/scenes/Customize';
import styles from './assets/styles/styles';
import { ViroARSceneNavigator } from 'react-viro';
import * as Animatable from 'react-native-animatable';

/*
 TODO: Insert your API key below
 */
const sharedProps = {
    apiKey:"2491314B-56CD-4153-9187-17C7A7CDB6FD",
};

// Sets the default scene you want for AR and VR
const ARScene = require('./js/scenes/VisionAR');
const UNSET = "UNSET";
const AR_NAVIGATOR_TYPE = "AR";
const LOGIN_NAVIGATOR_TYPE ="LOGIN";

// This determines which type of experience to launch in, or UNSET, if the user should
// be presented with a choice of AR or VR. By default, we offer the user a choice.
let defaultNavigatorType = UNSET;

export default class ViroSample extends Component {
    constructor() {
        super();
        this.state = {
            navigator : defaultNavigatorType,
            sharedProps : sharedProps,
            noneChecked: false,
            homeIsChecked: false,
            artIsChecked: false,
            techIsChecked: false,
            educationIsChecked: false
        };

        this._getExperienceSelector = this._getExperienceSelector.bind(this);
        this._getARNavigator = this._getARNavigator.bind(this);
        this._getExperienceButtonOnPress = this._getExperienceButtonOnPress.bind(this);
        this._exitViro = this._exitViro.bind(this);
        this._checkBoxText =this._checkBoxText.bind(this);
    }

    // Replace this function with the contents of _getVRNavigator() or _getARNavigator()
    // if you are building a specific type of experience.
    render() {
        if (this.state.navigator === UNSET) {
            return this._getExperienceSelector();
        }  else if (this.state.navigator === LOGIN_NAVIGATOR_TYPE) {
            return this._getCustomizeScreen();
        }else if (this.state.navigator === AR_NAVIGATOR_TYPE) {
            return this._getARNavigator();
        }
    }

    // Presents the user with a choice of an AR or VR experience
    _getExperienceSelector() {
        return (
            <View style={styles.viroContainer} >
                <ScrollView style={styles.viroContainer} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.welcomeContainer} >
                        <Image
                            source={require('./js/res/vision.png')}
                            style={styles.welcomeImage}
                            fadeDuration={10}
                        />
                    </View>
                    <View style={styles.outer} >
                        <View style={styles.inner} >
                            <Animatable.Text animation="slideInDown"
                                             iterationCount="infinite"
                                             direction="alternate"
                                             style={styles.titleText}>
                                            Ad~Vision</Animatable.Text>

                            <TouchableHighlight style={styles.buttons}
                                                onPress={this._getExperienceButtonOnPress(LOGIN_NAVIGATOR_TYPE)}
                                                underlayColor={'#68a0ff'} >
                                <Animatable.Text animation="pulse"
                                                 easing="ease-out"
                                                 iterationCount="infinite"
                                                 style={styles.buttonText}>Login</Animatable.Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.buttons}
                                                onPress={this._getExperienceButtonOnPress(AR_NAVIGATOR_TYPE)}
                                                underlayColor={'#68a0ff'} >
                                <Animatable.Text animation="pulse"
                                                 easing="ease-out"
                                                 iterationCount="infinite"
                                                 style={styles.buttonText}>Demo</Animatable.Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Returns the ViroARSceneNavigator which will start the AR experience
    _getARNavigator() {
        return (
            <View style={{flex: 1}}>
                <ViroARSceneNavigator {...this.state.sharedProps}
                                      initialScene={{scene: ARScene}}/>
                <View style={{position: 'absolute', backgroundColor:"#ffffff22", left: 30, right: 30, top: 30, alignItems: 'center'}}>
                    <Text style={{fontSize:12, color:"#ffffff"}}>Tracking initialized.</Text>
                </View>
                <View style={{position: 'absolute',  left: 5, right: 0, bottom: 15}}>
                    <TouchableHighlight style={styles.back}
                                        onPress={this._getExperienceButtonOnPress(LOGIN_NAVIGATOR_TYPE)}
                                        underlayColor={'#00000000'} >
                        <Image source={require ('./js/res/icon_left_w.png')} style={{height: 30, width: 40}}/>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    // Returns the Customize Screen
    _getCustomizeScreen = () => (
            <Customize _getExperienceButtonOnPress={this._getExperienceButtonOnPress}
                       _checkBoxText={this._checkBoxText}
                       homeIsChecked={this.state.homeIsChecked}
                       artIsChecked={this.state.artIsChecked}
                       techIsChecked={this.state.techIsChecked}
                       educationIsChecked={this.state.educationIsChecked}
            />
    );


    // This function returns an anonymous/lambda function to be used
    // by the experience selector buttons
    _getExperienceButtonOnPress(navigatorType) {
        return () => {
            this.setState({
                navigator : navigatorType
            });
            if(navigatorType === 'UNSET') {
                this.setState({
                    noneChecked: false,
                    homeIsChecked: false,
                    artIsChecked: false,
                    techIsChecked: false,
                    educationIsChecked: false});
            }
        }
    }

    // This function "exits" Viro by setting the navigatorType to UNSET.
    _exitViro() {
        this.setState({
            navigator : UNSET
        })
    }

    // Checkbox Function
    _checkBoxText = (topic) => {
        topic === 'Home'?
            this.setState({
                homeIsChecked:!this.state.homeIsChecked
            })
            : topic === 'Technology'?
            this.setState({
                techIsChecked:!this.state.techIsChecked
            })
            : topic === 'Art'?
                this.setState({
                    artIsChecked:!this.state.artIsChecked
                })
                : topic === 'Education'?
                    this.setState({
                        educationIsChecked:!this.state.educationIsChecked
                    })
                    : this.setState({
                        noneChecked:!this.state.noneChecked
                    });
        alert(topic);
    };
}

module.exports = ViroSample;
