/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Button, StatusBar} from 'react-native';

import { StackNavigator} from 'react-navigation'
import Navigation from './Navigation/Navigation'
import ProfileMI from './Components/Profile/ProfileMI'
import ProfileAE from './Components/Profile/ProfileAE'
import Login from './Components/Auth/Login'

import {auth, db, fb } from './Firebase/Firebase';
export default class App extends React.Component {

        
    render() {
     return <Navigation/>
    }  

}