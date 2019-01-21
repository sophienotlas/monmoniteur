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

class ProfileMI extends React.Component {
  constructor() {
    super();
    this.moniteur = db.ref('moniteurs/'+auth.currentUser.uid)
    this.state = {siret:'', tarif:'', tel:'', address:'', localisation:'', experience:'', validatedAutorisation:'', validatedCarteGrise:'', validatedRCPro:'', validatedAssurance:'', validatedAccount:'', imageURL: '', uploading: false}
  }

  getDataUser(){
    this.moniteur.on('value', (snap) => {
      this.setState({
         validatedAccount: snap.val().validatedAccount,
         address: snap.val().address,
         localisation: snap.val().localisation,
         tel : snap.val().tel,
         siret: snap.val().siret,
         tarif: snap.val().tarif,
         experience: snap.val().experience,
         typePermisSelect: snap.val().typePermisSelect,
         validatedAutorisation: snap.val().validatedAutorisation,
         validatedCarteGrise: snap.val().validatedCarteGrise,
         validatedAssurance: snap.val().validatedAssurance,
         validatedRCPro: snap.val().validatedRCPro
      });
    })
    console.log(this.state.validatedAssurance)
    console.log(this.state.validatedAutorisation)
  }

  // Recuperation value in Storage
  componentDidMount() {
    this.getDataUser()
  }

  // Check if Profile is complete
  _completeProfile(){
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

  _deleteAccount(){
    Alert.alert(
      'Voulez-vous vraiment supprimer votre compte ?',
      'Cette action est irréversible',
      [
        {text: 'Annuler', onPress: () => console.log('Ask me later pressed')},
        {text: 'Supprimer mon compte', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
      ],
      { cancelable: false }
    )
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
            <Text style={{fontSize:16, fontWeight:'bold'}}>Années d'expérience</Text>
            <Text>{this.state.experience}</Text>
          </View>
          <View style={{marginVertical: 5, alignItems:'center',justifyContent : 'center'}}>
            <Text style={{fontSize:16, fontWeight:'bold'}}>Titulaire des permis</Text>
            <Text>{this.state.typePermisSelect}</Text>
          </View>
          <View style={{marginVertical: 5, alignItems:'center',justifyContent : 'center'}}>
            <Text style={{fontSize:16, fontWeight:'bold'}}>Tarifs</Text>
            <Text>{this.state.tarif} €/heure</Text>
          </View>
          <View style={{marginVertical: 5, alignItems:'center',justifyContent : 'center'}}>
            <Text style={{fontSize:16, fontWeight:'bold'}}>Siret</Text>
            <Text>{this.state.siret}</Text>
          </View>
          <View  style={{marginVertical: 10, alignItems:'center',justifyContent : 'center'}}>
            <Text style={{fontSize:20, fontWeight:'bold'}}>Vos documents</Text>
            {this._getDocument(this.state.validatedAutorisation, "autorisation d'enseignement")}
            {this._getDocument(this.state.validatedCarteGrise, "carte grise")}
            {this._getDocument(this.state.validatedAssurance,"assurance")}
            {this._getDocument(this.state.validatedRCPro, "RC Pro")}
          <TouchableOpacity onPress={this._deleteAccount} style={styles.buttonDelete}>
            <Text style={styles.buttonText}>Supprimer mon compte</Text>
          </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScrollView>
    )
  }
}

export default ProfileMI;


const customs = StyleSheet.create({
  picture:{
    marginTop: 50,
    marginBottom: 15,
    width: 128,
    height: 128,
    borderRadius: 64,
    overflow: 'hidden',
    resizeMode: 'contain',
  },
})