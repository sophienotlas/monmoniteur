import React, {Component} from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ImageBackground
  } from 'react-native'
import {
  FormLabel, 
  FormInput,
  CheckBox
} from 'react-native-elements'

import {auth} from '../../Firebase/Firebase'
import {db} from '../../Firebase/Firebase'

import styles from '../../Styles/Style'

class ChangePassword extends React.Component {
    constructor(props){
        super(props)
        this.state = {currentPassword:'', newPassword:'', confirmPassword:'', error:'', success:'', loading:false}
    }

    reauthenticate = (currentPassword) => {
        var cred = auth.currentUser.EmailAuthProvider.credential(user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    }

    onChangePasswordPress = () => {
        if(this.state.newPassword == this.state.confirmPassword){
            this.reauthenticate(this.state.currentPassword).then(() => {
                auth.currentUser.updatePassword(this.state.newPassword).then(() => {
                    this.setState({success: 'Le mot de passe a été modifié'})
                }).catch((error) => { console.log(error.message); });
            }).catch((error) => { console.log(error.message) });
        } else {
            this.setState({error: 'Les mots de passe ne sont pas identiques'})
        }
    }



  _renderButtonOrLoading(){
    if(this.state.loading){
      return <Text> Chargement </Text>
    }
    return <View>
    <TouchableOpacity onPress={this.onChangePasswordPress} style={styles.button}>
      <Text style={styles.buttonText}>Valider</Text>
    </TouchableOpacity>
    </View>
  }
    
  render(){
    return(
      <ImageBackground source={require('../../Images/accueil.jpg')} style={styles.container}>
        <View style={styles.container}>
          <TextInput 
           style={styles.inputBox}
           underlineColorAndroid='rgba(0,0,0,0)'
           placeholder='Ancien le mot de passe'
           onChangeText={currentPassword => this.setState({currentPassword})}
          />
          <TextInput 
           style={styles.inputBox}
           underlineColorAndroid='rgba(0,0,0,0)'
           placeholder='Nouveau le mot de passe'
           onChangeText={newPassword => this.setState({newPassword})}
          />
          <TextInput 
           style={styles.inputBox}
           underlineColorAndroid='rgba(0,0,0,0)'
           placeholder='Confirmer le mot de passe'
           onChangeText={confirmPassword => this.setState({confirmPassword})}
          />
          <Text>{this.state.error}</Text>  
          <Text>{this.state.success}</Text>   
          {this._renderButtonOrLoading()}
        </View>
      </ImageBackground>
    )
  }

}

export default ChangePassword

