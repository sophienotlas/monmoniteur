import React from 'react';
import { Text, View, ImageBackground } from 'react-native';


import Logo from '../Components/Logo';


import {auth, db} from '../Firebase/Firebase';
import styles from '../Styles/Style';


class Home extends React.Component {
  
  constructor(props) {
    super(props);
    this._bootstrapAsync();
}

moniteurAutoEcole(){
  if(auth.currentUser){
    console.log(auth.currentUser)
    db.ref('moniteurs/').on('value', (snap) => {
      if(snap.child(auth.currentUser.uid).exists()){
        this.props.navigation.navigate('MoniteurScreen');
      }
    });
    db.ref('autoecoles/').on('value', (snap) => {
        if(snap.child(auth.currentUser.uid).exists()){
          this.props.navigation.navigate('AutoEcoleScreen');
        }
    })
  } else {
    this.props.navigation.navigate('Home');
  }
}

// Fetch the token from storage then navigate to our appropriate place
_bootstrapAsync = async () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      this.moniteurAutoEcole()
    } else {
      this.props.navigation.navigate('Home');
    }
  })
};

render(){
  return (
    <ImageBackground source={require('../Images/accueil.jpg')} style={styles.container}>
      <View style={styles.container}>
        <Logo/>
        <Text>Chargement</Text>
      </View>
    </ImageBackground>
  )
}
}

export default Home