import { createStackNavigator, createSwitchNavigator, createAppContainer, createDrawerNavigator, DrawerItems } from 'react-navigation'
import React from 'react'
import { ScrollView, Text, View, SafeAreaView, TouchableOpacity, Dimensions, StyleSheet, Image} from 'react-native'
import { Icon } from 'react-native-elements'
import Login from '../Components/Auth/Login';
import Signup from '../Components/Auth/Signup';
import SignupAE from '../Components/Auth/SignupAE';
import SignupMI from '../Components/Auth/SignupMI';
import ForgotPassword from '../Components/Auth/ForgotPassword';
import ProfileMI from '../Components/Profile/ProfileMI';
import ProfileAE from '../Components/Profile/ProfileAE';
import EditProfileMI from '../Components/Profile/EditProfileMI';
import EditProfileAE from '../Components/Profile/EditProfileAE';
import Home from '../Components/Home';
import ChangePassword from '../Components/Params/ChangePassword';
import { Font } from 'expo';


import {auth, db, fb } from '../Firebase/Firebase';

logOut = () => { 
  auth.signOut()
            .then(function() {
                this.props.navigation.navigate('Login');
            })
            .catch(function(error) {
             console.log("nope")
            })
}

const CustomDrawerContentComponent = (props) => (
  <SafeAreaView style={{flex:1}}>
      <View style={{marginVertical:20, alignItems:'center', justifyContent : 'center'}}>
        <TouchableOpacity onPress={() => this.props.navigator.push({ component: EditProfileAE })} >
          <Image
              style={customs.picture}
              source={auth.currentUser.photoURL ? {uri: auth.currentUser.photoURL} : require('../Images/noProfilePicture.png')}
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={{flex:1}}>
          <DrawerItems {...props} />
          <View style={customs.disconnect}>
            <Icon  name='exit-to-app' style={{width: 50}} />
            <Text onPress={this.logOut} style={{width: 250, textAlign: 'center', fontWeight: 'bold'}}>Se déconnecter</Text>
          </View>
      </ScrollView>
  </SafeAreaView>
);

const SignOut = createStackNavigator({
  Login: {
    screen: Login,    navigationOptions: {header: null}
  },
  Signup: {
    screen: Signup,   navigationOptions: {header: null}
  },
  SignupMI: {
    screen: SignupMI,    navigationOptions: { header: null}
  },
  SignupAE: {
    screen: SignupAE,    navigationOptions: {header: null}
  },
  ForgotPassword: {
    screen: ForgotPassword,    navigationOptions: {header: null}
  }
});

const SignInMI = createDrawerNavigator({
  'Mon profil': {
    screen: ProfileMI,
  },
  'Modifier mon profil':{
    screen: EditProfileMI
  },
  'Changer de mot de passe':{
    screen: ChangePassword
  }
},{
  contentComponent: CustomDrawerContentComponent,
  drawerWidth: 300,
      contentOptions: {
      activeTintColor: '#09239c',
      itemsContainerStyle: {
        marginVertical: 0,
      },
      iconContainerStyle: {
        opacity: 1
      }
    }
});

const SignInAE = createDrawerNavigator({
  'Mon Profil': {
    screen: ProfileAE
  },
  'Modifier mon profil': {
    screen: EditProfileAE
  },
  'Changer de mot de passe':{
    screen: ChangePassword
  }
},{
  contentComponent: CustomDrawerContentComponent,
  drawerWidth: 300,
  contentOptions: {
    activeTintColor: '#09239c',
    itemsContainerStyle: {
      marginVertical: 0,
    },
    iconContainerStyle: {
      opacity: 1
    }
  }
});

export default createAppContainer( 
  createSwitchNavigator(
  { 
    Login: SignOut,
    MI: SignInMI,
    AE:SignInAE,
    Loading: Home
  },
  {
    initialRouteName: 'Loading',

  }
))


const customs = StyleSheet.create({
  picture:{
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    resizeMode: 'cover',
  },
  disconnect:{
    flexDirection:'row',
    borderTopColor: 'rgba(0,0,0,0.3)', 
    borderTopWidth:1, 
    justifyContent: 'flex-end',
    padding: 10
  },
})