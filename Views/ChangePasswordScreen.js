import React from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground
  } from 'react-native'

import { fb} from '../Firebase/Firebase'

import styles from '../Styles/Style'

class ChangePassword extends React.Component {
    constructor(props){
        super(props)
        this.state = {currentPassword:'', newPassword:'', confirmPassword:'', error:'', success:'', loading:false}
    }

    onChangePasswordPress = () => {
      var user = fb.auth().currentUser;
      this.setState({error: 'Loading'});
      var user = fb.auth().currentUser;
      if(this.state.newPassword == this.state.confirmPassword){
        fb.auth().currentUser.updatePassword(this.state.newPassword).then(() => {
          console.log("changé")
          var credential = fb.auth.EmailAuthProvider.credential(user.email, this.currentPassword);
          user.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
            this.setState({error: 'Le mot de passe a été modifié'})
          }).catch(function() {
            this.setState({error: 'Erreur authentification'})
          });          
        }).catch((error) => { console.log('blabla') });
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
      <ImageBackground source={require('../Images/accueil.jpg')} style={styles.container}>
        <View style={styles.container}>
          <TextInput 
           style={styles.inputBox}
           underlineColorAndroid='rgba(0,0,0,0)'
           placeholder='Ancien le mot de passe'
           secureTextEntry={true}
           onChangeText={currentPassword => this.setState({currentPassword})}
          />
          <TextInput 
           style={styles.inputBox}
           underlineColorAndroid='rgba(0,0,0,0)'
           placeholder='Nouveau le mot de passe'
           secureTextEntry={true}
           onChangeText={newPassword => this.setState({newPassword})}
          />
          <TextInput 
           style={styles.inputBox}
           underlineColorAndroid='rgba(0,0,0,0)'
           placeholder='Confirmer le mot de passe'
           secureTextEntry={true}
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

