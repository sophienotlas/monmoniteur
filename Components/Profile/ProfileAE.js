import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Button,
  ScrollView,
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

class ProfileAE extends React.Component {
  constructor() {
    super();
    this.autoecole = db.ref('autoecoles/'+auth.currentUser.uid)
    this.state = {siret:'', name:'', firstname:'', tel:'', address:'', validatedAccount:'', localisation:'', nbMoniteurs:'', validatedKbis:'', imageURL: '', uploading: false}
  }

  getDataUser(){
    this.autoecole.on('value', (snap) => {
      this.setState({
         validatedAccount: snap.val().validatedAccount,
         name: snap.val().name,
         firstname: snap.val().firstname,
         address: snap.val().address,
         localisation: snap.val().localisation,
         tel : snap.val().tel,
         siret: snap.val().siret,
         nbMoniteurs: snap.val().nbMoniteurs,
         validatedKbis: snap.val().validatedKbis
      });
    })
  }

  // Recuperation value in Storage
  componentDidMount() {
    this.getDataUser()
  }

  // Check if Profile is complete
  _completeProfile(){
    console.log(this.state.validatedAccount)
    if(this.state.validatedAccount === 1){
      return <Text>Votre profil est complet</Text>
    }
    else if (this.state.validatedAccount === 0){
      return <Text>Votre profil est en cours de validation par notre équipe</Text>
    }
    else if (this.state.validatedAccount === -1) {
      return <Text>Votre profil est incomplet</Text>
    }
  }
  getProfilePicture(){
      if(auth.currentUser.photoURL){
        return { uri: auth.currentUser.photoURL }
      } else {
        return require('../../Images/noProfilePicture.png')
      }
  }
  
  _getDocument(validated, name){
    if(validated === 1){
      return <View style={styles.blockFiles}>
        <Text style={styles.accepted}>Votre {name} a été validé</Text>
        <Image style={styles.icon} source={require('../../Images/accepted.png')}/>
      </View>     
    }
    else if (validated === 0){
      return <View style={styles.blockFiles}>
      <Text style={styles.notSend}>Votre {name} est en cours de validation</Text>
    </View>  
    }
    else if (validated === -1){
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
      <ScrollView>
        <ImageBackground source={require('../../Images/accueil.jpg')} style={styles.container}>
          <Image
            style={customs.picture}
            source={this.getProfilePicture()}
          />
          {this._completeProfile()}
          <Text style={{fontSize:20, fontWeight:'bold'}}>{auth.currentUser.displayName}</Text>
          <View style={{marginVertical: 5, alignItems:'center',justifyContent : 'center'}}>
            <Text style={{fontSize:16, fontWeight:'bold'}}>Gérant</Text>
            <Text>{this.state.firstname}</Text>
            <Text>{this.state.name}</Text>
          </View>
          <View style={{marginVertical: 5, alignItems:'center',justifyContent : 'center'}}>
            <Text style={{fontSize:16, fontWeight:'bold'}}>Téléphone</Text>
            <Text>{this.state.tel}</Text>
          </View>
          <Text style={{fontSize:20, fontWeight:'bold'}}>{auth.currentUser.displayName}</Text>
          <View style={{marginVertical: 5, alignItems:'center',justifyContent : 'center'}}>
            <Text style={{fontSize:16, fontWeight:'bold'}}>Adresse</Text>
            <Text>{this.state.address}</Text>
            <Text>{this.state.localisation}</Text>
          </View>
          <View style={{marginVertical: 5, alignItems:'center',justifyContent : 'center'}}>
            <Text style={{fontSize:16, fontWeight:'bold'}}>Siret</Text>
            <Text>{this.state.siret}</Text>
          </View>
          <View style={{marginVertical: 5, alignItems:'center',justifyContent : 'center'}}>
            <Text style={{fontSize:16, fontWeight:'bold'}}>Nombre de moniteurs</Text>
            <Text>{this.state.nbMoniteurs}</Text>
          </View>
          <View  style={{marginVertical: 10, alignItems:'center',justifyContent : 'center'}}>
            <Text style={{fontSize:20, fontWeight:'bold'}}>Vos documents</Text>
            {this._getDocument(this.state.validatedKbis, "Kbis de - 3 mois")}
          </View>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProfileAE')} style={styles.button}>
          <Text style={styles.buttonText}>Modifier le profil</Text>
        </TouchableOpacity>
        </ImageBackground>
      </ScrollView>
    )
  }
}

export default ProfileAE;


const customs = StyleSheet.create({
  picture:{
    width: 128,
    height: 128,
    marginVertical: 15,
    borderRadius: 64,
    overflow: 'hidden',
    resizeMode: 'contain',
  },
})