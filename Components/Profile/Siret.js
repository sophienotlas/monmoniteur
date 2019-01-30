import React from 'react';
import { Text, View, TextInput } from 'react-native';

import styles from '../../Styles/Style'

import {auth, db} from '../../Firebase/Firebase';

class Siret extends React.Component {
  constructor(props) {
      super(props);
      this.state = {siretNmb:props.siretNmb,  errorSiret:''};
      this.updateSiret = this.updateSiret.bind(this);
  }

  validedSiret(siret){
      var estValide;
      if ( (siret.length != 14) || (isNaN(siret)) )
        estValide = false;
      else {
        var somme = 0;
        var tmp;
        for (var cpt = 0; cpt<siret.length; cpt++) {
          if ((cpt % 2) == 0) { 
            tmp = siret.charAt(cpt) * 2;
            if (tmp > 9) 
              tmp -= 9;	
          }
          else
            tmp = siret.charAt(cpt);
            somme += parseInt(tmp);
        }
        if ((somme % 10) == 0)
          estValide = true;  
        else
          estValide = false;
      }
      return estValide;
  }

  updateSiret(input){
    const isValid = this.validedSiret(input);
    if(isValid){
      this.setState({errorSiret: 'SIRET valide'});
      this.props.siretFunction(input);
    }
    else{
      this.setState({errorSiret: 'SIRET invalide'});
    }
  }

  render(){  
    return(  
        <View style={styles.container}>
          <Text style={{fontWeight:'bold'}}>Siret</Text>
          <TextInput style={styles.inputBox}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      value = {this.state.siret}
                      placeholder= "Numéro de SIRET"
                      maxLength={14}
                      keyboardType = 'numeric'
                      onChangeText={(siret) => this.updateSiret(siret)}/>
          <Text style={{color: 'red'}}>{this.state.errorSiret}</Text> 
      </View>
    )
  }
}

export default Siret
