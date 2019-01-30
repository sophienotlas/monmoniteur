import React from 'react';
import { Text, View, ScrollView, Image, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { SegmentedControls } from 'react-native-radio-buttons';
import {auth, db, fb } from '../../Firebase/Firebase';

import styles from '../../Styles/Style';
import profile from '../../Styles/ProfileStyle';

import Siret from '../../Components/Profile/Siret'
import ImportPictures from '../../Components/Profile/ImportPictures'
import GetLocalisation from '../../Components/Profile/GetLocalisation'

class EditProfileMI extends React.Component {
  constructor(props) {
    super(props);
    this.moniteur = db.ref('moniteurs/'+auth.currentUser.uid);
    this.permis = db.ref('moniteurs/'+auth.currentUser.uid+ '/typePermisSelect');
    this.state = {
      userName: auth.currentUser.displayName,
      tel:'', 
      address:'', 
      mail: auth.currentUser.email,
      city:'', 
      siret:'', 
      tarifBrute:'', 
      experience:'', 
      permis:[], 
      uploading: false,
      errorSiret:'', 
      errorMail:'',
      typePermisSelect: []
    }
    this._siretNumber = this._siretNumber.bind(this);
    this._localisation = this._localisation.bind(this);
  }

  _siretNumber(siret){
    console.log(siret);
    this.setState({ siret: siret });
  }

  _localisation(city, lat, lng){
    this.setState({ 
      city: city,
      lat: lat,
      lng: lng 
    });
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
      style={(index !== -1) ? profile.buttonPermisSelected : profile.buttonPermis}>
        <Text style={(index !== -1) ? profile.buttonPermisTextSelected : profile.buttonTextPermis}>{id}</Text>
      </TouchableOpacity>
    </View>
  }


  getDataUser(){
    this.setState({
      userName: auth.currentUser.displayName,
      mail: auth.currentUser.email
    })
    this.moniteur.on('value', (snap) => {
      this.setState({
         tel: snap.val().tel,
         address: snap.val().address,
         city: snap.val().city,
         lat: snap.val().lat,
         lng: snap.val().lng,
         tarifBrute: snap.val().tarif,
         experience: snap.val().experience,
         siret: snap.val().siret,
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
 
  convertTarif(tarif) {
    return parseFloat(tarif)-((tarif*20)/100);
  }

  setSelectedOption(experience){
    this.setState({
      experience
    });
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
    db.ref('moniteurs/' + auth.currentUser.uid).update({
      siret: this.state.siret,
      tarif: this.state.tarifBrute,
      tel: this.state.tel,
      address: this.state.address,
      localisation: this.state.localisation,
      experience: this.state.experience,
      typePermisSelect: this.state.typePermisSelect
    }).then((data)=>{
      console.log('data ' , data);
      this.props.navigation.navigate('Accueil')
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
    
    const options = [
      "0-3 ans",
      "4-8 ans",
      "9+ ans"
    ];

    return(      
      <ScrollView>        
      <ImageBackground source={require('../../Images/accueil.jpg')} style={styles.container}>
          <Image
            style={profile.picture}
            source={this.getProfilePicture()}
          />
          <ImportPictures file="profilePicture"  fileFunction={this.uploadFile}/>
          
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
            <Text style={{fontWeight:'bold'}}>E-mail</Text>   
                <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    value = {this.state.mail}
                    placeholder="nom@email.fr"
                    onChangeText={mail => this.setState({mail})}
                />
           <Text style={{color: 'red'}}>{this.state.errorMail}</Text>  
          <Text style={{fontWeight:'bold'}}>Localisation</Text> 
          <TextInput style={styles.inputBox}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      value = {this.state.address}
                      placeholder="7 rue de la République"
                      onChangeText={address => this.setState({address})}
                      /> 
          <GetLocalisation  
            city={this.state.city}  
            lat={this.state.lat}  
            lng={this.state.lng} 
            localisationFunction={this._localisation}/>
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
          <Siret siretNmb={this.state.siret} siretFunction={this._siretNumber}/>   

          <Text style={{fontWeight:'bold'}}>Autorisation d'enseignement</Text> 
          <ImportPictures file="/Autorisation"  fileFunction={this.uploadFile}/>  

          <Text style={{fontWeight:'bold'}}>Carte grise</Text>
          <ImportPictures file="/Carte-grise"  fileFunction={this.uploadFile}/>

          <Text style={{fontWeight:'bold'}}>Assurance</Text>
          <ImportPictures file="/Assurance"  fileFunction={this.uploadFile}/>

          <Text style={{fontWeight:'bold'}}>RC Pro</Text>
          <ImportPictures file="/RC-Pro"  fileFunction={this.uploadFile}/>

          {this._renderButtonOrLoading()}     
        </ImageBackground> 
      </ScrollView>
    )
  }
}

export default EditProfileMI;
