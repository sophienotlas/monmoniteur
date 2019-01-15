
import React from 'react'
import { StyleSheet } from "react-native"

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems:'center',
    justifyContent : 'center'
  },
  signupTextCont:{
    flexGrow:1,
    alignItems:'center'
  },
  signupButton:{
    color:'black',
    fontSize:15,
    fontWeight:'400'
  },
  inputBox:{
    width:300,
    borderColor:'rgba(0,0,0,0.3)',
    borderRadius:5,
    borderWidth:1,
    paddingHorizontal:16,
    fontSize:16,
    marginVertical:5,
    paddingVertical:5
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'white',
    textAlign:'center'
  },
  button:{
    backgroundColor:'rgba(14,43,170,1)',
    borderRadius:5,
    marginVertical:10,
    width:300,
    paddingVertical:10
  },
  buttonPermis:{
    borderColor:'rgba(0,0,0,0.3)',
    borderWidth:1,
    marginVertical:5,
    marginHorizontal:5,
    paddingVertical:5,
    paddingHorizontal: 10
  },
  buttonPermisSelected:{
    borderColor:'rgba(0,0,0,0.3)',
    borderWidth:1,
    color:'white',
    backgroundColor:'rgba(14,43,170,1)',
    marginVertical:5,
    marginHorizontal:5,
    paddingVertical:5,
    paddingHorizontal: 10
  },
  buttonPermisText:{
    color:'black'
  },
  buttonPermisTextSelected:{
    color:'white'
  },
  blockFiles: { 
    flexDirection:'row'
  },
  accepted:{
    width:250,
    color:'green'
  },
  notSend:{
    width: 275,
    color:'grey'
  },
  refused:{
    width:250,
    color:'red'
  },
  icon: {
    width:25,
    height:25
  }
})

