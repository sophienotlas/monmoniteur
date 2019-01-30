import React from 'react'
import { Text, View, Switch, TextInput, TouchableOpacity, ImageBackground } from 'react-native'

import {auth, db} from '../../Firebase/Firebase'

import styles from '../../Styles/Style'
import login from '../../Styles/LoginStyle'

import CGV from '../../Components/Auth/CGV'

class SignupMI extends React.Component {
  constructor(props){ 
    super(props)
    this.state = {userName:'', email:'', password:'', passwordConfirm:'', checked:false, checkedMoniteur: false, error:'', loading:false}
    this._checkedCGV = this._checkedCGV.bind(this)
    };

    _checkedCGV(){
      return this.setState({
        checked: !this.state.checked
     });
    }

  _onSignupPress() {
    const {userName, email, password, passwordConfirm, checked, checkedMoniteur} = this.state;
    if(password === passwordConfirm){
      console.log(checked)
      if(checked && checkedMoniteur){
        auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
          auth.currentUser.updateProfile({
             displayName: userName
          });
          db.ref('files/'+auth.currentUser.uid).set({
            Autorisation: 0,
            CarteGrise: 0,
            Assurance: 0,
            RCPro: 0,
          })
          db.ref('moniteurs/' + auth.currentUser.uid).set(
            {
              siret: '',
              tarif: '',
              tel: '',
              address: '',
              localisation: '',
              experience: '',
              typePermisSelect: [],
              validatedAccount: -1
          })
          this.props.navigation.navigate('ProfileMI')
        })
        .catch(() => {
          this.setState({error:"Problème d'authentification", loading:false})
        })
      } else {
        this.setState({error:"Vous devez accepter les termes d'utilisation", loading:false})
      }
    } else {
        this.setState({error:'Les mots de passe ne sont pas identiques', loading:false})
    }
  }

  _renderButtonOrLoading(){
    if(this.state.loading){
      return <Text> Loading </Text>
    }
    return <View>
    <TouchableOpacity onPress={this._onSignupPress.bind(this)} style={styles.button}>
      <Text style={styles.buttonText}>Se Connecter</Text>
    </TouchableOpacity>
    </View>
  }
    
  render(){
    return(
      <ImageBackground source={require('../../Images/accueil.jpg')} style={styles.container}>
        <View style={styles.container}>
          <TextInput 
           style={styles.inputBox}
           value = {this.state.userName}
           underlineColorAndroid='rgba(0,0,0,0)'
           placeholder='Nom et prénom'
           onChangeText={userName => this.setState({userName})}
          />
          <TextInput 
           style={styles.inputBox}
           value = {this.state.email}
           autoCapitalize = 'none'
           underlineColorAndroid='rgba(0,0,0,0)'
           placeholder='Email'
           onChangeText={email => this.setState({email})}
          />
          <TextInput  
           style={styles.inputBox}      
           value = {this.state.password}
           underlineColorAndroid='rgba(0,0,0,0)'
           secureTextEntry
           placeholder='Mot de passe'
           onChangeText={password => this.setState({password})}
          />
          <TextInput  
           style={styles.inputBox}      
           value = {this.state.passwordConfirm}
           underlineColorAndroid='rgba(0,0,0,0)'
           secureTextEntry
           placeholder='Confirmer mot de passe'
           onChangeText={passwordConfirm => this.setState({passwordConfirm})}
          />    
        <CGV checkedFunction={this._checkedCGV}/>
         <View  style={login.containerForm}> 
          <Text  style={login.termsMoniteur}>Je ne travaille pas en direct avec une auto-école</Text>
            <Switch
              trackColor='rgba(14,43,170,1)'
              ios_backgroundColor='rgba(14,43,170,1)'
              style={login.switchTerms}
              value={this.state.checkedMoniteur}
              onValueChange={() => this.setState({ checkedMoniteur: !this.state.checkedMoniteur })}
            />
        </View>
          <Text>{this.state.error}</Text>   
          {this._renderButtonOrLoading()}
        </View>
      </ImageBackground>
    )
  }

}

export default SignupMI
