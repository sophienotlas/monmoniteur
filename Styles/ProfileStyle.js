import { StyleSheet } from "react-native"

export default StyleSheet.create({ 
    picture:{
        marginTop: 50,
        width: 128,
        height: 128,
        marginBottom: 15,
        borderRadius: 64,
        overflow: 'hidden',
        resizeMode: 'cover'
    },
    buttonDelete:{
        backgroundColor:'#9c0909',
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
    shortButton:{
        backgroundColor:'rgba(14,43,170,1)',
        marginVertical:5,
        paddingVertical:5,
        width: 150
    },
    twoButtons:{
        flexDirection:'row',
        justifyContent:'space-around'
    }
})

