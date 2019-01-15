import React, {Component} from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Button,
  TouchableOpacity,
  ImageBackground
  } from 'react-native'
import {
  FormLabel, 
  FormInput
} from 'react-native-elements'

import {auth} from '../Firebase/Firebase'
import {db} from '../Firebase/Firebase'
import styles from '../Styles/Style'

class Home extends React.Component {
  
  constructor(props) {
    super(props);
    this._bootstrapAsync();
}

moniteurAutoEcole(){
  if(auth.currentUser){
    db.ref('moniteurs/').on('value', (snap) => {
      if(snap.child(auth.currentUser.uid).exists()){
        this.props.navigation.navigate('ProfileMI');
      }

    });
    db.ref('autoecoles/').on('value', (snap) => {
        if(snap.child(auth.currentUser.uid).exists()){
          this.props.navigation.navigate('ProfileAE');
        }
    })
  }
}

// Fetch the token from storage then navigate to our appropriate place
_bootstrapAsync = async () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      this.setState({ signedIn: true });
      this.moniteurAutoEcole()
    } else {
      this.props.navigation.navigate('Login');
    }
  })
};

render(){
  return (
    <View><Text>Chargement</Text></View>
  )
}
}

export default Home

