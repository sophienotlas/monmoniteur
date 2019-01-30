import React from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';

import styles from '../../Styles/Style'
import profile from '../../Styles/ProfileStyle'

import {auth, db} from '../../Firebase/Firebase';

class DeleteAccount extends React.Component {
  
  deleteAccount = async () => {
    console.log(auth.currentUser)
    auth.currentUser.delete().then(() => {
      console.log("supprimer")
    }).catch((error) => {
      console.log("non")
    });
  }

  deleteAccountPopUp = () => {
    Alert.alert(
      'Voulez-vous vraiment supprimer votre compte ?',
      'Cette action est irréversible',
      [
        {text: 'Annuler', onPress: () => console.log('Ask me later pressed')},
        {text: 'Supprimer mon compte', onPress: this.deleteAccount}
      ],
      { cancelable: false }
    )
  }

  render(){  
    return(  
        <View>
          <TouchableOpacity onPress={this.deleteAccountPopUp} style={profile.buttonDelete}>
            <Text style={styles.buttonText}>Supprimer mon compte</Text>
          </TouchableOpacity>
      </View>
    )
  }
}

export default DeleteAccount
