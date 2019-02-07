'use strict';
import React, { Component } from 'react';

import particle from '../helpers/particle';
import anims from '../helpers/animate';
import TextTester from '../tester/TextTester';

import {
    Image,
    ScrollView,
    Text,
    TouchableHighlight,
    StyleSheet
} from 'react-native';

import {
    ViroARScene,
    ViroConstants,
    ViroARImageMarker,
    ViroBox,
    ViroARTrackingTargets,
    ViroMaterials,
    ViroVideo,
    ViroParticleEmitter,
    ViroAnimations,
    ViroImage,
    ViroQuad,
    ViroText,
    ViroButton,
    ViroFlexView,
    ViroNode
} from 'react-viro';

import { runTestEmitter, renderables } from '../helpers/tester';

class VisionAR extends Component {
    constructor() {
        super();
            // Set initial state here
            this.state = {
                text: "Initializing AR...",
                testText: "Click the pink circle after initializing tracking",
                canplayAnims: false,
                canRenderARComponents: false,
                targets: []
            };

            // Bind 'this' to functions
            this._onInitialized = this._onInitialized.bind(this);
            this._onBufferStart = this._onBufferStart.bind(this);
            this._onStart = this._onStart.bind(this);
            this.changeTitle = this.changeTitle.bind(this);

            // Set media to display after image recognition
            ViroMaterials.createMaterials({
                apple: {
                    diffuseTexture: require('../res/apple.jpg'),
                },
                power: {
                    diffuseTexture: require('../res/powerade.png'),
                },
                shop: {
                    diffuseTexture: require('../res/kohls.jpg'),
                }
            });

            // Set materials for image tracking
            //needs to be remove, see Landing.js
    }

    _onInitialized(state, reason) {
        if (state === ViroConstants.TRACKING_NORMAL) {
            /* this.setState({
                text: "Hello World!"
            }); */
        } else if (state === ViroConstants.TRACKING_NONE) {
            // Handle loss of tracking
        }
    }

    _onBufferStart(func) {
        func;
    }

    _onStart() {
        particle.Firework([0, 0, 0], 4200, "fxparttinyglowy.png", false, 1800);
    }

    changeTitle = () => {
        let newState = { ...this.state };
        newState.testText = "Yare Yare Daze";
        this.setState(newState);
    };

    bake = () => {
        let newState = { ...this.state };

        if (renderables.hasBeenFilled && this.state.targets.length < 1) {
            for (let i = 0; i < renderables.data.length; i++) {

                newState.targets.push(renderables.data[i]);

            }
            newState.canRenderARComponents = true;
        } else {
            newState.targets = [];
        }

        this.setState(newState);
    };

    //set this in the render function
    checkifRenderablesFilled = () => {

        setInterval(() => {
            if (renderables.hasBeenFilled) {
                if (renderables.hasBeenFilled && this.state.targets.length < 1) {
                    let newState = { ...this.state };
                    for (let i = 0; i < renderables.data.length; i++) {

                        newState.targets.push(renderables.data[i]);

                    }
                    newState.canRenderARComponents = true;
                    this.setState(newState);
                }


            } else {
                return;
            }


        }, 500)

    };

    checkIfRenderablesEmpty = () => {
        setInterval(() => {
            if (!renderables.hasBeenFilled && this.state.targets.length > 0) {

                let newState = { ...this.state };
                newState.targets = [];
                newState.canRenderARComponents = false;
                newState.canplayAnims = false;
                this.setState(newState);
                //alert('Scene will now refresh');
            } else {
                return;
            }
        }, 300);
    };

    grabRenderables = () => {
        let ARtargets = this.state.targets.map(target =>

            //testing drag plane
            <ViroNode key={this.dummyKeyGen}
                dragPlane={{
                    planePoint: [0, 0, 0],
                    planeNormal: [0, 0, 0],
                    maxDistance: 10
                }}

            >
                <ViroARImageMarker target={target} key={this.dummyKeyGen} onAnchorFound={
                    () => this.setState({
                        canplayAnims: true
                    })}  >

                    <ViroNode key={target + "1"} position={[0, 0, 0]}>
                        {this.state.canplayAnims ? particle.Firework([0, 0, 0], 4200, "fxparttinyglowy.png", false) : null}
                        <ViroBox position={[0, 0, 0]}
                            opacity={0.2}
                            scale={[0.0, 0.0, 0.0]}
                            materials={["apple"]}
                            animation={{
                                name: 'animateBlock', delay: 820, run: this.state.canplayAnims
                            }}
                        />
                    </ViroNode>
                </ViroARImageMarker>
            </ViroNode>


        );
        return ARtargets;
    };

    dummyKeyGen = () => {
        return Math.floor(Math.random() * 900000) + 100000;
    };

    render() {

        return (
            <ViroARScene onTrackingUpdated={this._onInitialized} >
                {this.checkIfRenderablesEmpty()}
                {this.checkifRenderablesFilled()}

                {anims.registerAll()}
                {this.state.canRenderARComponents ? this.grabRenderables() : null}
                <TextTester
                    onClick={this.bake}
                />
            </ViroARScene>
        );
    }
}

module.exports = VisionAR;