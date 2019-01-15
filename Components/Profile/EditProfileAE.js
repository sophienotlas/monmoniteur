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
  TouchableWithoutFeedback,
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
import { SegmentedControls } from 'react-native-radio-buttons'
import {auth, db, fb } from '../../Firebase/Firebase';
import styles from '../../Styles/Style'



class EditProfileAE extends React.Component {
  constructor(props) {
    super(props);
    this.autoecole = db.ref('autoecoles/'+auth.currentUser.uid);
    this.state = {userName:'', name:'', firstname:'', nbMoniteurs:'', tel:'', address:'', localisation:'', siret:'', image: null, uploading: false};
    this.state = {validatedKbis:null, messageKbis:''};
    this.state.userName = auth.currentUser.displayName;
  }


  getDataUser(){
    this.setState({
      userName: auth.currentUser.displayName
    })
    this.autoecole.on('value', (snap) => {
      this.setState({
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
    auth.currentUser.updateProfile({
        displayName: this.state.userName
    }).then(function() {
      console.log('Nom récupéré ')
    }).catch(function() {
      console.log('Nom non récupéré ')
    });    
    if(this.validedSiret(this.state.siret)){
      db.ref('moniteurs/' + auth.currentUser.uid).update({   
        name: this.state.name,
        firstname: this.state.firstname,
        siret: this.state.siret,
        tarif: this.state.tarifBrute,
        tel: this.state.tel,
        address: this.state.address,
        localisation: this.state.localisation,
        nbMoniteurs: this.state.nbMoniteurs,
        validatedKbis: this.state.validatedKbis
      }).then((data)=>{
        console.log('data ' , data)
        this.props.navigation.navigate('ProfileAE')
     }).catch((error)=>{
        console.log('error ' , error)
      })
    } else {
        console.log("Mauvais siret")
        this.setState({errorSiret:"Siret incorrecte", loading:false})
    }
  }

  // Access to camera roll and select a picture
  _onChooseImagePress = async (imageObjectif) => {  
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    console.log(status);
    if(status === 'granted'){
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1,1]
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
      if(imageObjectif === '/Kbis'){
          this.setState({
            validatedKbis: 0,
            messageKbis: 'Kbis envoyé'});
      }
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
          <Text style={{fontWeight:'bold'}}>Siret</Text>
          <TextInput style={styles.inputBox}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      value = {this.state.siret}
                      placeholder= "Numéro de SIRET"
                      maxLength={14}
                      keyboardType = 'numeric'
                      onChangeText={siret => this.setState({siret})}/>
          <Text style={{color: 'red'}}>{this.state.errorSiret}</Text>   
          <Text style={{fontWeight:'bold'}}>Kbis de - de 3 mois</Text>          
          {this._renderTakePictureOrUpload('/Kbis')} 
          <Text>{this.state.messageRCPro}</Text>
          {this._renderButtonOrLoading()}     
        </ImageBackground> 
      </ScrollView>
    )
  }
}

export default EditProfileAE;


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