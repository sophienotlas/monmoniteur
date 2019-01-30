import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { ImagePicker, Permissions } from 'expo';

import {auth, db, fb } from '../../Firebase/Firebase';

import styles from '../../Styles/Style'
import profile from '../../Styles/ProfileStyle'


class ImportPictures extends React.Component {
  constructor(props) {
    super(props);
    this.state = {file:props.file, message:''};
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
      switch(imageObjectif){
        case '/Autorisation':
          this.setState({ message: 'Autorisation envoyée' });
          db.ref('files/'+auth.currentUser.uid).update({ 
            Autorisation: 1
          })
          break;
        case '/Carte-grise':
          this.setState({ message: 'Carte grise envoyée' });
          db.ref('files/'+auth.currentUser.uid).update({ 
            CarteGrise: 1
          })
          break;
        case '/Assurance':
          this.setState({ message: 'Assurance envoyée' });
          db.ref('files/'+auth.currentUser.uid).update({ 
            Assurance: 1
          })
          break;
        case '/RC-Pro':
          this.setState({ message: 'RC Pro envoyé' });
          db.ref('files/'+auth.currentUser.uid).update({ 
            RCPro: 1
          })
          break;
        case '/Kbis':
          this.setState({ message: 'Kbis envoyé' });
          db.ref('files/'+auth.currentUser.uid).update({ 
            Kbis: 1
          })
          break;
      }
      const snapshot = await ref.put(blob);
      blob.close();
      return await snapshot.ref.getDownloadURL();
    }
  }
    
  render(){  
    return( 
      <View>
      <View style={profile.twoButtons}>
        <TouchableOpacity style={profile.shortButton} onPress={() => this._onChooseImagePress(this.state.file)}>
          <Text style={styles.buttonText}>Aller dans la galerie</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={profile.shortButton} onPress={() => this._takeAPicture(this.state.file)}>
          <Text style={styles.buttonText}>Prendre une photo</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text>{this.state.message}</Text>
      </View> 
      </View>
    )
  }
}

export default ImportPictures
