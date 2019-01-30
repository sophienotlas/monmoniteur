import React from 'react';
import { Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';

import {auth, db} from '../../Firebase/Firebase'

import styles from '../../Styles/Style'

class ForgotPassword extends React.Component {
  constructor(props){
    super(props)
    this.state = {email:'', error:'', success:'', loading:false}
  }

  _forgotPasswordPress() {
    const email = this.state.email;
    auth.sendPasswordResetEmail(email)
    .then(() => {
       this.setState({success:"Un email vient de vous être envoyé", loading:false})
    }).catch(() => {
       this.setState({error:"Email non existant", loading:false})
    });
  }

  _renderButtonOrLoading(){
    if(this.state.loading){
      return <Text> Chargement </Text>
    }
    return <View>
    <TouchableOpacity onPress={this._forgotPasswordPress.bind(this)} style={styles.button}>
      <Text style={styles.buttonText}>Envoyer</Text>
    </TouchableOpacity>
    </View>
  }
    
  render(){
    return(
      <ImageBackground source={require('../../Images/accueil.jpg')} style={styles.container}>
        <View style={styles.container}>
          <Text>Réinitialiser le mot de passe</Text>
          <TextInput 
           style={styles.inputBox}
           value = {this.state.email}
           underlineColorAndroid='rgba(0,0,0,0)'
           placeholder='Email'
           onChangeText={email => this.setState({email})}
          />
          <Text>{this.state.error}</Text>  
          <Text>{this.state.success}</Text>   
          {this._renderButtonOrLoading()}
        </View>
      </ImageBackground>
    )
  }

}

export default ForgotPassword

