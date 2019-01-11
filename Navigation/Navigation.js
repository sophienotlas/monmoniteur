import { createStackNavigator,createAppContainer } from 'react-navigation'

import React from 'react'
import { Image, StyleSheet } from 'react-native'
import Login from '../Components/Auth/Login';
import Signup from '../Components/Auth/Signup';
import SignupAE from '../Components/Auth/SignupAE';
import SignupMI from '../Components/Auth/SignupMI';
import ForgotPassword from '../Components/Auth/ForgotPassword';
import Home from '../Components/Home';
import ProfileMI from '../Components/Profile/ProfileMI';
import EditProfileMI from '../Components/Profile/EditProfileMI';


  const MenuNavigation = createStackNavigator ({
  	Login: {
      screen: Login,
      navigationOptions: {
        header: null,
     }
    },
    Signup:{
      screen: Signup,
      navigationOptions: {
        header: null,
     }
    },
    SignupAE:{
      screen: SignupAE,
      navigationOptions: {
        header: null,
     }
    },
    SignupMI:{
      screen: SignupMI,
      navigationOptions: {
        header: null,
     }
    },
    Home:{
      screen: Home,
      navigationOptions: {
        header: null,
     }
    },
    ForgotPassword:{
      screen: ForgotPassword,
      navigationOptions: {
        header: null,
     }
    },
    ProfileMI:{
      screen: ProfileMI,
      navigationOptions: {
        header: null,
     }
    },
    EditProfileMI:{
      screen: EditProfileMI,
      navigationOptions: {
        header: null,
     }
    }
  })

const App = createAppContainer(MenuNavigation);

export default App
