import React from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity, ImageBackground, Alert} from 'react-native';
import {auth, db, fb } from '../../Firebase/Firebase';

import styles from '../../Styles/Style';
import profile from '../../Styles/ProfileStyle';

import DeleteAccount from '../../Components/Profile/DeleteAccount'

class ProfileAE extends React.Component {
  constructor() {
    super();
    this.autoecole = db.ref('autoecoles/'+auth.currentUser.uid)
    this.state = {
      validatedAccount:'', 
      name:'', 
      firstname:'', 
      imageURL: '', 
      tel:'', 
      siret:'', 
      address:'', 
      localisation:'', 
      nbMoniteurs:'', 
      Kbis:'', 
      uploading: false}
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
         nbMoniteurs: snap.val().nbMoniteurs
      });
    })
    db.ref('files/'+auth.currentUser.uid).on('value', (snap) => {
      this.setState({
         Kbis: snap.val().Kbis
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
  /*getProfilePicture(){
      if(auth.currentUser.photoURL){
        return { uri: auth.currentUser.photoURL }
      } else {
        return require('../../Images/noProfilePicture.png')
      }
  }*/
  
  _getDocument(validated, name){
    if(validated === 2){
      return <View style={styles.blockFiles}>
        <Text style={styles.accepted}>Votre {name} a été validé</Text>
        <Image style={styles.icon} source={require('../../Images/accepted.png')}/>
      </View>     
    }
    else if (validated === 1){
      return <View style={styles.blockFiles}>
      <Text style={styles.notSend}>Votre {name} est en cours de validation</Text>
    </View> 
    }
    else if (validated === 0){
      return <View style={styles.blockFiles}>
      <Text style={styles.notSend}>Vous n'avez pas envoyé la photo de votre {name}</Text>
    </View>  
    }
    else if (validated === -1){
      return <View style={styles.blockFiles}>
      <Text style={styles.refused}>Votre {name} a été refusé</Text>
      <Image style={styles.icon} source={require('../../Images/refused.png')}/>
    </View> 
    }
  }

  render(){
    console.log(this.props.navigation)
    return(
      <ScrollView>
        <ImageBackground source={require('../../Images/accueil.jpg')} style={styles.container}>
          <Image
            style={profile.picture}
            source={!auth.currentUser ? require('../../Images/noProfilePicture.png') : auth.currentUser.photoURL ? {uri: auth.currentUser.photoURL} : require('../../Images/noProfilePicture.png')}
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
          <View style={{marginVertical: 5, alignItems:'center',justifyContent : 'center'}}>
            <Text style={{fontSize:16, fontWeight:'bold'}}>E-mail</Text>
            <Text>{auth.currentUser.mail}</Text>
          </View>
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
            {this._getDocument(this.state.Kbis, "Kbis de - 3 mois")}
          </View>
          <DeleteAccount/>
        </ImageBackground>
      </ScrollView>
    )
  }
}

export default ProfileAE;

