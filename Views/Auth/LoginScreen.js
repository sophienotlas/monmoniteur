import React from 'react'
import { Text, View, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView } from 'react-native'

import Logo from '../../Components/Logo';

import {auth, db} from '../../Firebase/Firebase'

import styles from '../../Styles/Style'
import login from '../../Styles/LoginStyle'

class Login extends React.Component {
  constructor(props){
    super(props)
    this.state = {email:'', password:'', error:'', loading:false}
  }

  _onLoginPress() {
    this.setState({error:'', loading:true})
    const {email, password} = this.state;
    auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      this.setState({error:'', loading:false})
      if(db.ref('autoecoles/'+auth.currentUser.uid)){
        this.props.navigation.navigate('ProfileAE')
      } else {
        this.props.navigation.navigate('ProfileMI')
      }
    })
    .catch(() => {
      this.setState({error:'Prob authentification', loading:false})
    })
  }

  _renderButtonOrLoading(){
    if(this.state.loading){
      return <Text> Loading </Text>
    }
    return <View>
    <TouchableOpacity onPress={this._onLoginPress.bind(this)} style={styles.button}>
      <Text style={styles.buttonText}>Se Connecter</Text>
    </TouchableOpacity>
    </View>
  }
    
  render(){
    return(
      <ImageBackground source={require('../../Images/accueil.jpg')} style={styles.container}>
        <View style={login.containerLogin}>
        <KeyboardAvoidingView behavior='position'>
          <Logo/>
          <TextInput style={styles.inputBox}
                      autoCapitalize = 'none'
                      underlineColorAndroid='rgba(0,0,0,0)'
                      value = {this.state.email}
                      placeholder='Identifiant'
                      onChangeText={email => this.setState({email})}/>

          <TextInput style={styles.inputBox}
                     underlineColorAndroid='rgba(0,0,0,0)'
                     value = {this.state.password}
                     placeholder='Mot de passe'
                     secureTextEntry={true}
                     onChangeText={password => this.setState({password})}/>
          </KeyboardAvoidingView>
          <Text>{this.state.error}</Text>         
          {this._renderButtonOrLoading()}
          <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
            <Text style={login.signupButton}> Mot de passe oublié ?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={login.inscription} onPress={() => this.props.navigation.navigate('Signup')}>
            <Text style={login.signupButton}> S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

    )
  }

}export default Login

