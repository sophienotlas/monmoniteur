import React from 'react';
import { Text, View, ScrollView, Image, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import {auth, db, fb } from '../../Firebase/Firebase';

import styles from '../../Styles/Style';
import profile from '../../Styles/ProfileStyle'

import Siret from '../../Components/Profile/Siret'
import ImportPictures from '../../Components/Profile/ImportPictures'

class EditProfileAE extends React.Component {
  constructor(props) {
    super(props);
    this.autoecole = db.ref('autoecoles/'+auth.currentUser.uid);
    this.state = {
      userName: auth.currentUser.displayName,
      photo:'profilePicture',
      name:'', 
      firstname:'', 
      nbMoniteurs:'', 
      tel:'',
      mail:auth.currentUser.mail,
      address:'', 
      localisation:'', 
      siret:'', 
      errorMail:''
    };
    this.siretNumber = this.siretNumber.bind(this);
  }

  siretNumber(siret){
    console.log(siret);
    this.setState({ siret: siret });
  }

  getDataUser(){
    this.setState({
      userName: auth.currentUser.displayName,
      mail: auth.currentUser.email
    })
    this.autoecole.on('value', (snap) => {
      this.setState({
        name: snap.val().name,
        firstname: snap.val().firstname,
        address: snap.val().address,
        localisation: snap.val().localisation,
        siret: snap.val().siret,
        tel : snap.val().tel,
        nbMoniteurs: snap.val().nbMoniteurs
      });
    })
  }

  // Recuperation value in Storage
  componentDidMount() {
    this.getDataUser()
  }
  _onSavePress() {
    auth.currentUser.updateEmail(this.state.mail).then(function() {
      console.log('Email récupéré ')
    }).catch(function(error) {
      this.setState({errorSiret:"Email incorrecte", loading:false})
    });
    
    auth.currentUser.updateProfile({
        displayName: this.state.userName
    }).then(function() {
      console.log('Nom récupéré ')
    }).catch(function() {
      console.log('Nom non récupéré ')
    });    
      db.ref('autoecoles/' + auth.currentUser.uid).update({   
        name: this.state.name,
        firstname: this.state.firstname,
        siret: this.state.siret,
        tel: this.state.tel,
        address: this.state.address,
        localisation: this.state.localisation,
        nbMoniteurs: this.state.nbMoniteurs
      }).then((data)=>{
        this.props.navigation.navigate('Accueil')
        console.log('data ' , data);
     }).catch((error)=>{
        console.log('error ' , error)
      })
  }

  getProfilePicture(){
    console.log(auth.currentUser.photoURL)
    if(auth.currentUser.photoURL){
      return { uri: auth.currentUser.photoURL }
    } else {
      return require('../../Images/noProfilePicture.png')
    }
  }


  _renderButtonOrLoading(){
    if(this.state.loading){
      return <Text> Loading </Text>
    }
    return <View>
    <TouchableOpacity onPress={this._onSavePress.bind(this)} style={styles.button}>
      <Text style={styles.buttonText}>Enregistrer</Text>
    </TouchableOpacity>
    </View>
  }

  render(){    
    return(      
      <ScrollView>        
      <ImageBackground source={require('../../Images/accueil.jpg')} style={styles.container}>
          <Image
            style={profile.picture}
            source={this.getProfilePicture()}
          />
          <ImportPictures file="profilePicture"  fileFunction={this.uploadFile}/>
          
          <Text style={{fontWeight:'bold'}}>Nom de l'auto-école</Text>   
          <TextInput style={styles.inputBox}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      value = {this.state.userName}
                      placeholder="Nom de l'auto-école"
                      onChangeText={userName => this.setState({userName})}
                      />
        <Text style={{fontWeight:'bold'}}>Gérant</Text> 
          <TextInput style={styles.inputBox}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      value = {this.state.name}
                      placeholder="Nom"
                      onChangeText={name => this.setState({name})}
                      /> 
        <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    value = {this.state.firstname}
                    placeholder="Prénom"
                    onChangeText={firstname => this.setState({firstname})}
                    />
            
          <Text style={{fontWeight:'bold'}}>Nombre de moniteurs</Text>   
              <TextInput style={styles.inputBox}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  value = {this.state.nbMoniteurs}
                  maxLength={3}
                  keyboardType = 'numeric'
                  placeholder="1"
                  onChangeText={nbMoniteurs => this.setState({nbMoniteurs})}
              />
            <Text style={{fontWeight:'bold'}}>E-mail</Text>   
                <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    value = {this.state.mail}
                    placeholder="nom@email.fr"
                    onChangeText={mail => this.setState({mail})}
                />
           <Text style={{color: 'red'}}>{this.state.errorMail}</Text>   
        <Text style={{fontWeight:'bold'}}>Téléphone</Text>   
            <TextInput style={styles.inputBox}
                underlineColorAndroid='rgba(0,0,0,0)'
                value = {this.state.tel}
                maxLength={15}
                keyboardType = 'numeric'
                placeholder="06 XX XX XX XX"
                onChangeText={tel => this.setState({tel})}
            />
          <Text style={{fontWeight:'bold'}}>Localisation</Text> 
          <TextInput style={styles.inputBox}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      value = {this.state.address}
                      placeholder="7 rue de la République"
                      onChangeText={address => this.setState({address})}
                      /> 
        <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    value = {this.state.localisation}
                    placeholder="Paris"
                    onChangeText={localisation => this.setState({localisation})}
                    />
          <Siret siretNmb={this.state.siret} siretFunction={this.siretNumber}/>
          <Text style={{fontWeight:'bold'}}>Kbis de - de 3 mois</Text> 
          <ImportPictures file="/Kbis"  fileFunction={this.uploadFile}/>
          {this._renderButtonOrLoading()}     
        </ImageBackground> 
      </ScrollView>
    )
  }
}

export default EditProfileAE;

