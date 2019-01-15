import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation'

import React from 'react'
import { Image, StyleSheet } from 'react-native'
import Login from '../Components/Auth/Login';
import Signup from '../Components/Auth/Signup';
import SignupAE from '../Components/Auth/SignupAE';
import SignupMI from '../Components/Auth/SignupMI';
import ForgotPassword from '../Components/Auth/ForgotPassword';
import ProfileMI from '../Components/Profile/ProfileMI';
import ProfileAE from '../Components/Profile/ProfileAE';
import EditProfileMI from '../Components/Profile/EditProfileMI';
import EditProfileAE from '../Components/Profile/EditProfileAE';
import Home from '../Components/Home'

const SignOut = createStackNavigator({
  Login: {
    screen: Login
  },
  Signup: {
    screen: Signup
  },
  SignupMI: {
    screen: SignupMI
  },
  SignupAE: {
    screen: SignupAE
  },
  ForgotPassword: {
    screen: ForgotPassword
  }
})
const SignInMI = createStackNavigator({
  ProfileMI: {
    screen: ProfileMI
  },
  EditProfileMI:{
    screen: EditProfileMI
  }
})
const SignInAE = createStackNavigator({
  ProfileAE: {
    screen: ProfileAE
  },
  EditProfileAE: {
    screen: EditProfileAE
  }
})

export default createAppContainer( createSwitchNavigator(
  { 
    Login: SignOut,
    ProfileMI: SignInMI,
    ProfileAE:SignInAE,
    Loading: Home
  },
  {
    initialRouteName: 'Loading'
  }
))
