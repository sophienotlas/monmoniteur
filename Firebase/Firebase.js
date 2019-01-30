import firebase from 'firebase' 

const config = { 
}; 

firebase.initializeApp(config); 

export const db = firebase.database() 
export const auth = firebase.auth() 
export const fb = firebase