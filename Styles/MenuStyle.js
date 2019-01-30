import { StyleSheet } from "react-native"

export default StyleSheet.create({ 
    containImage: {
        marginVertical:20, 
        alignItems:'center', 
        justifyContent : 'center'
    },
    picture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        resizeMode: 'cover',
    },
    disconnect: {
        flexDirection:'row',
        borderTopColor: 'rgba(0,0,0,0.3)', 
        borderTopWidth:1, 
        justifyContent: 'flex-end',
        padding: 10
    },
    textDisconnect: {
        width: 250, 
        textAlign: 'center', 
        fontWeight: 'bold'
    }
})

