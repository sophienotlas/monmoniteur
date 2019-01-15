/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, StatusBar} from 'react-native';

import { StackNavigator} from 'react-navigation'
import Navigation from './Navigation/Navigation'
import { auth } from 'firebase';


export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {moniteurOuAutoEcole:''}
  };

  getDataUser(){
    if(auth.currentUser){
      moniteur = db.ref('users/'+auth.currentUser.uid);
      moniteur.on('value', (snap) => {
        this.setState({
          moniteurOuAutoEcole: snap.val().moniteurOuAutoEcole
        });
      })
    }
  }

  // Recuperation value in Storage
  componentDidMount() {
    this.getDataUser()
  }

  render() {
    return(
      <Navigation/>
    )
    }      

}
