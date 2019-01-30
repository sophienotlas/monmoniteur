import { StyleSheet } from "react-native"

export default StyleSheet.create({
  containerLogin: {
    marginTop: 75, 
    alignItems:'center', 
    justifyContent : 'center'
  },
  signupButton:{
      color:'black',
      fontSize:15,
      fontWeight:'400'
  },
  inscription: {
      flex: 1, 
      marginBottom:10, 
      justifyContent: 'flex-end'
  },
  icon: {
    width:25,
    height:25
  },
  containerForm: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent : 'center'
  },
  terms: {
    width: 150,
    fontWeight: 'bold',
    color: 'blue'
  },
  termsMoniteur: {
    width: 150
  },
  switchTerms : {
    width: 120
  }
})

