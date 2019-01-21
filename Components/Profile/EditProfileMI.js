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



class EditProfileMI extends React.Component {
  constructor(props) {
    super(props);
    this.moniteur = db.ref('moniteurs/'+auth.currentUser.uid);
    this.permis = db.ref('moniteurs/'+auth.currentUser.uid+ '/typePermisSelect');
    this.state = {userName:'', tel:'', address:'', localisation:'', siret:'', tarifBrute:'', experience:'', permis:[], image: null, uploading: false};
    this.state = {validatedAutorisation:null, validatedCarteGrise:null, validatedAssurance:null, validatedRCPro:null};
    this.state = {messageAssurance:'', messageAutorisation:'', messageCarteGrise:'', messageRCPro:'', errorSiret:''}
    this.state.userName = auth.currentUser.displayName;
    this.state = {typePermisSelect: []};
  }

 

  renderPermis(id){  
    var index;
    console.log(this.state.typePermisSelect)
    if(this.state.typePermisSelect !== 'undefined'){
      index = this.state.typePermisSelect.indexOf(id);
    } else {
      index= -1
    }
    return <View>
      <TouchableOpacity 
      onPress={() => {if (index !== -1) {
        this.setState({typePermisSelect: this.state.typePermisSelect.filter((_, i) => i !== index)});
      } else {
        this.setState(prevState => ({typePermisSelect: [...prevState.typePermisSelect, id]})); 
      }console.log(this.state.typePermisSelect)}} 
      style={(index !== -1) ? styles.buttonPermisSelected : styles.buttonPermis}>
        <Text style={(index !== -1) ? styles.buttonPermisTextSelected : styles.buttonTextPermis}>{id}</Text>
      </TouchableOpacity>
    </View>
  }


  getDataUser(){
    this.setState({
      userName: auth.currentUser.displayName
    })
    this.moniteur.on('value', (snap) => {
      this.setState({
         tel: snap.val().tel,
         siret: snap.val().siret,
         address: snap.val().address,
         localisation: snap.val().localisation,
         tarifBrute: snap.val().tarif,
         experience: snap.val().experience,
         validatedAutorisation: snap.val().validatedAutorisation,
         validatedCarteGrise: snap.val().validatedCarteGrise,
         validatedAssurance: snap.val().validatedAssurance,
         validatedRCPro: snap.val().validatedRCPro
      });
    })
    this.permis.once('value', (snap) => {
      if(snap.exists()){
        this.setState({
           typePermisSelect: snap.val().typePermisSelect
        });
      }
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
 
  convertTarif(tarif) {
    return parseFloat(tarif)-((tarif*20)/100);
  }

  setSelectedOption(experience){
    this.setState({
      experience
    });
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
        siret: this.state.siret,
        tarif: this.state.tarifBrute,
        tel: this.state.tel,
        address: this.state.address,
        localisation: this.state.localisation,
        experience: this.state.experience,
        typePermisSelect: this.state.typePermisSelect,
        validatedAutorisation: this.state.validatedAutorisation,
        validatedCarteGrise: this.state.validatedCarteGrise,
        validatedAssurance: this.state.validatedAssurance,
        validatedRCPro: this.state.validatedRCPro
      }).then((data)=>{
        console.log('data ' , data);
        this.props.navigator.push({ component: ProfileMI });
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
      switch(imageObjectif){
        case '/Autorisation':
          this.setState({
            validatedAutorisation: 0,
            messageAutorisation: 'Autorisation envoyée'});
          break;
        case '/Carte-grise':
          this.setState({
            validatedCarteGrise: 0,
            messageCarteGrise: 'Carte grise envoyée'});
          break;
        case '/Assurance':
          this.setState({
            validatedAssurance: 0,
            messageAssurance: 'Assurance envoyée'});
          break;
        case '/RC-Pro':
          this.setState({
            alidatedRCPro: 0,
            messageRCPro: 'RC Pro envoyé'
          });
          break;
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
    
    const options = [
      "0-3 ans",
      "4-8 ans",
      "9+ ans"
    ];
    
    
    return(      
      <ScrollView>        
      <ImageBackground source={require('../../Images/accueil.jpg')} style={styles.container}>
          <Image
            style={customs.picture}
            source={this.getProfilePicture()}
          />
          {this._renderTakePictureOrUpload('profilePicture')}   
          
          <Text style={{fontWeight:'bold'}}>Nom/Prénom</Text>   
          <TextInput style={styles.inputBox}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      value = {this.state.userName}
                      placeholder="Nom/Prénom"
                      onChangeText={userName => this.setState({userName})}
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
          <Text style={{fontWeight:'bold'}}>Titulaire des permis</Text> 
          <View style={{flex:1, flexWrap: 'wrap', flexDirection:'row', width:300}}>
            {this.renderPermis('A1')}         
            {this.renderPermis('AD')} 
            {this.renderPermis('AP')}  
            {this.renderPermis('B')} 
            {this.renderPermis('B1')} 
            {this.renderPermis('C')} 
            {this.renderPermis('D')} 
            {this.renderPermis('E(B)')} 
            {this.renderPermis('E(C)')} 
            {this.renderPermis('E(D)')} 
            {this.renderPermis('Bateau')} 
          </View>
          <Text style={{fontWeight:'bold'}}>Années d'expérience dans les auto-écoles</Text>
          <SegmentedControls        
            tint={'#0e2baa'}
            selectedTint= {'white'}
            options={ options }  
            allowFontScaling={ false } // default: true
            onSelection={ this.setSelectedOption.bind(this) }
            selectedOption={this.state.experience }
            optionStyle={{paddingVertical:5}} 
            containerStyle={{width: 300}}
          />
          <Text  style={{fontWeight:'bold'}}>Tarifs à l'heure</Text>
          {console.log(this.state.tarifBrute)}
          <TextInput style={styles.inputBox}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      value = {this.state.tarifBrute}
                      placeholder= "Tarifs à l'heure"
                      maxLength={5}
                      keyboardType = 'numeric'
                      onChangeText={tarifBrute => this.setState({tarifBrute})}/>
          <Text>Ce que je gagne : {this.convertTarif(this.state.tarifBrute)} €/h </Text>       
          <Text style={{width:300}}>Lorsque vous acceptez une mission, le taux de droit est de 20% hors taxes.</Text>
          <Text style={{fontWeight:'bold'}}>Siret</Text>
          <TextInput style={styles.inputBox}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      value = {this.state.siret}
                      placeholder= "Numéro de SIRET"
                      maxLength={14}
                      keyboardType = 'numeric'
                      onChangeText={siret => this.setState({siret})}/>
          <Text style={{color: 'red'}}>{this.state.errorSiret}</Text>   
          <Text style={{fontWeight:'bold'}}>Autorisation d'enseignement</Text>          
          {this._renderTakePictureOrUpload('/Autorisation')}
          <Text>{this.state.messageAutorisation}</Text>
          <Text style={{fontWeight:'bold'}}>Carte grise</Text>
          {this._renderTakePictureOrUpload('/Carte-grise')} 
          <Text>{this.state.messageCarteGrise}</Text>
          <Text style={{fontWeight:'bold'}}>Assurance</Text>
          {this._renderTakePictureOrUpload('/Assurance')}  
          <Text>{this.state.messageAssurance}</Text>
          <Text style={{fontWeight:'bold'}}>RC Pro</Text>
          {this._renderTakePictureOrUpload('/RC-Pro')}  
          <Text>{this.state.messageRCPro}</Text>
          {this._renderButtonOrLoading()}     
        </ImageBackground> 
      </ScrollView>
    )
  }
}

export default EditProfileMI;


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