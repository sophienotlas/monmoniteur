import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Button,
  TouchableOpacity,
  ImageBackground,
  Alert
  } from 'react-native';
import {
  FormLabel, 
  FormInput
} from 'react-native-elements';
import {
  ImagePicker,
  Permissions
} from 'expo';

import {auth, db, fb } from '../../Firebase/Firebase';
import styles from '../../Styles/Style'

class ProfileMI extends React.Component {
  constructor() {
    super();
    this.moniteur = db.ref('users/'+auth.currentUser.uid)
    this.state = {siret:'', tarif:'', moniteurOuAutoEcole: '', imageURL: '', uploading: false}
  }

  getDataUser(moniteur){
    this.moniteur.on('value', (snap) => {
      this.setState({
         siret: snap.val().siretNumber,
         tarif: snap.val().tarifHeure,
      });
    })
    console.log(this.state.siret)
  }

  // Recuperation value in Storage
  componentDidMount() {
    this.getDataUser(this.moniteur)
  }

  // Check if Profile is complete
  _completeProfile(){
    if(this.state.validatedAccount === 1){
      return 'Votre profil est complet';
    }
    else if (this.state.validatedAccount === 0){
      return 'Votre profil est en cours de validation par notre équipe';
    }
    else if (this.state.validatedAccount === -1) {
      return 'Votre profil est incomplet';
    }
  }
  getProfilePicture(){
      if(auth.currentUser.photoURL){
        return { uri: auth.currentUser.photoURL }
      } else {
        return require('../../Images/noProfilePicture.png')
      }
  }
  
  _getDocument(name){
    if(this.state.validatedAccount === 1){
      return <View style={styles.blockFiles}>
        <Text style={styles.accepted}>Votre {name} a été validé</Text>
        <Image style={styles.icon} source={require('../../Images/accepted.png')}/>
      </View>     
    }
    else if (this.state.validatedAccount === 0){
      return <View style={styles.blockFiles}>
      <Text style={styles.notSend}>Votre {name} est en cours de validation</Text>
    </View>  
    }
    else if (this.state.validatedAccount === -1){
      return <View style={styles.blockFiles}>
      <Text style={styles.refused}>Votre {name} a été refusé</Text>
      <Image style={styles.icon} source={require('../../Images/refused.png')}/>
    </View>   
    } else {
      return <View style={styles.blockFiles}>
      <Text style={styles.notSend}>Vous n'avez pas envoyé la photo de votre {name}</Text>
    </View> 
    }
  }

  render(){
    return(
      <View>        
        <ImageBackground  source={require('../../Images/accueil.jpg')} style={styles.container}>
          <Image
            style={customs.picture}
            source={this.getProfilePicture()}
          />
          <Text>{this._completeProfile()}</Text>
          <Text>{auth.currentUser.displayName}</Text>
          <Text>Années d'expérience dans les auto-écoles : </Text>
          <Text>Tarifs : {this.state.tarif} €/heure</Text>
          <Text>Siret : {this.state.siret}</Text>
          <View style={styles.blockFiles}></View>
          {this._getDocument("autorisation d'enseignement")}
          {this._getDocument("carte grise")}
          {this._getDocument("assurance")}
          {this._getDocument("RC Pro")}
          
        <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProfileMI')} style={styles.button}>
          <Text style={styles.buttonText}>Modifier le profil</Text>
        </TouchableOpacity>
        
        </ImageBackground>
      </View>
    )
  }
}

export default ProfileMI;


const customs = StyleSheet.create({
  picture:{
    width: 128,
    height: 128,
    borderRadius: 64,
    overflow: 'hidden',
    resizeMode: 'contain',
  },
})