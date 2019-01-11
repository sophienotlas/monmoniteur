import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Picker,
  View,
  ScrollView,
  StatusBar,
  Image,
  TextInput,
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
    this.moniteur = db.ref('users/'+auth.currentUser.uid);
    this.state = {userName:'', siret:'', tarif:'', moniteurOuAutoEcole: '', experience:'', error:'', image: null, uploading: false};
    this.state.userName = auth.currentUser.displayName;
  }

  getDataUser(moniteur){
    this.moniteur.on('value', (snap) => {
      console.log("snap" + snap.val().siretNumber)
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

  validedSiret(siret){
    var estValide;
    if ( (siret.length != 14) || (isNaN(siret)) )
      estValide = false;
    else {
      var somme = 0;
      var tmp;
      for (var cpt = 0; cpt<siret.length; cpt++) {
        if ((cpt % 2) == 0) { 
          tmp = siret.charAt(cpt) * 2;
          if (tmp > 9) 
            tmp -= 9;	
        }
       else
         tmp = siret.charAt(cpt);
         somme += parseInt(tmp);
      }
      if ((somme % 10) == 0)
        estValide = true;  
      else
        estValide = false;
    }
    return estValide;
  }
 
  _onSavePress() {
    const {userName, siret, tarif} = this.state;
    auth.currentUser.updateProfile({
        displayName: userName
    }).then(function() {
      console.log('Nom récupéré ')
    }).catch(function() {
      console.log('Nom non récupéré ')
    });    
    if(this.validedSiret(siret)){
      console.log('ok1');
      db.ref('users/' + auth.currentUser.uid).update({
        moniteurOuAutoEcole: 'moniteur',
        siretNumber: siret,
        tarifHeure : tarif
      }).then((data)=>{
        console.log('data ' , data)
        this.props.navigation.navigate('ProfileMI')
     }).catch((error)=>{
        console.log('error ' , error)
      })
    } else {
      
      console.log(this.validedSiret(siret));
      (error) => {
        this.setState({error:"Siret incorrecte", loading:false})
      }
    }
  }

  // Check if Profile is complete
  _completeProfile(){
    if(this.state.validatedAccount === '1'){
      return 'Votre profil est complet';
    }
    else if (this.state.validatedAccount === '0'){
      return 'Votre profil est en cours de validation par notre équipe';
    }
    else {
      return 'Votre profil est incomplet';
    }
  }

  // Access to camera roll and select a picture
  _onChooseImagePress = async (imageObjectif) => {  
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    console.log(status);
    if(status === 'granted'){
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true
      });
      console.log(result);
      this._handleImagePicked(result,imageObjectif);
    }
  }

  // Access to camera and take a picture
  _takeAPicture = async (imageObjectif) => {  
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
          exif: true,
          allowsEditing: false,
          quality: 0.7,
          base64: true
        });
      this._handleImagePicked(result,imageObjectif);
    }
  }

  // Recuperation picture
  _handleImagePicked = async (pickerResult,imageObjectif) => {
    try {
      this.setState({ uploading: true });
      if (!pickerResult.cancelled) {
        uploadUrl = await this.uploadImageAsync(pickerResult.uri,imageObjectif);
        this.setState({ image: uploadUrl });
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry 😞');
    } finally {
      this.setState({ uploading: false });
    }
  }

  // Storage picture
  uploadImageAsync = async (uri,imageObjectif) => {    
    console.log("ok");
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    if(imageObjectif == 'profilePicture'){
      auth.currentUser.updateProfile({
        photoURL: uri
     })
    } else {
      ref = fb.storage().ref().child(auth.currentUser.uid + imageObjectif);
      const snapshot = await ref.put(blob);
      blob.close();
      return await snapshot.ref.getDownloadURL();
    }
  }

  getProfilePicture(){
    console.log(auth.currentUser.photoURL)
    if(auth.currentUser.photoURL){
      return { uri: auth.currentUser.photoURL }
    } else {
      return require('../../Images/noProfilePicture.png')
    }
  }

  _renderTakePictureOrUpload(imageObjectif){
    return <View style={customs.twoButtons}>
      <TouchableOpacity style={customs.shortButton} onPress={() => this._onChooseImagePress(imageObjectif)}>
        <Text style={customs.buttonText}>Aller dans la galerie</Text>
      </TouchableOpacity>
      <TouchableOpacity  style={customs.shortButton} onPress={() => this._takeAPicture(imageObjectif)}>
        <Text style={customs.buttonText}>Prendre une photo</Text>
      </TouchableOpacity>
    </View>
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
    let { image } = this.state;
    return(
      <ScrollView>        
        <ImageBackground source={require('../../Images/accueil.jpg')} style={styles.container}>
          <Image
            style={customs.picture}
            source={this.getProfilePicture()}
          />
          {this._renderTakePictureOrUpload('profilePicture')}      
          <TextInput style={styles.inputBox}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      value = {this.state.userName}
                      placeholder="Nom/Prénom"
                      onChangeText={userName => this.setState({userName})}
                      />
          <Text>Localisation : </Text>
          <Text>Années d'expérience dans les auto-écoles : </Text>
          <Picker
            selectedValue={this.state.experience}
            style={{ height: 50, width: 200, backgroundColor:'white' }}
            onValueChange={(itemValue, itemIndex) => this.setState({experience: itemValue})}>
            <Picker.Item label="0-2 ans" value="0-2" />
            <Picker.Item label="6-9 ans" value="3-5" />
          </Picker>
          <TextInput style={styles.inputBox}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      value = {this.state.tarif}
                      placeholder= "Tarifs à l'heure"
                      maxLength={5}
                      keyboardType = 'numeric'
                      onChangeText={tarif => this.setState({tarif})}/>
          <TextInput style={styles.inputBox}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      value = {this.state.siret}
                      placeholder= "Numéro de SIRET"
                      maxLength={14}
                      keyboardType = 'numeric'
                      onChangeText={siret => this.setState({siret})}/>
          <Text>{this.state.error}</Text>   
          <Text>Autorisation d'enseignement</Text>          
          {this._renderTakePictureOrUpload('/Autorisation')}  
          <Text>Carte grise</Text>
          {this._renderTakePictureOrUpload('/Carte-grise')}  
          <Text>Assurance</Text>
          {this._renderTakePictureOrUpload('/Assurance')}  
          <Text>Assurance</Text>
          {this._renderTakePictureOrUpload('/RC-Pro')}  

          {this._renderButtonOrLoading()}          
        </ImageBackground>
      </ScrollView>
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
  shortButton:{
    backgroundColor:'rgba(14,43,170,1)',
    marginVertical:5,
    paddingVertical:5,
    width: 150
  },
  twoButtons:{
    flexDirection:'row',
    justifyContent:'space-around'
  },
  buttonText: {
    fontSize:14,
    fontWeight:'500',
    color:'white',
    textAlign:'center'
  }
})