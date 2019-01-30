import React, {Component} from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  ImageBackground,
  Alert,
  StatusBar
  } from 'react-native'

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {auth, db, fb } from '../../Firebase/Firebase';

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};

class GetLocalisation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        image: null,
        uploading: false,
        address:null,
        lat:props.lat,
        lng:props.lng,
        city:props.city
    }
    this.ajoutLocalisation = this.ajoutLocalisation.bind(this);
}

     getAdd(data){
        console.log("add",data);
        this.setState(
            {
              lat: data.geometry.location.lat,//  selected coordinates latitude
              lng: data.geometry.location.lng, //  selected coordinates longitute
             city: data.formatted_address
            }
          );
       console.log("this.state.coordinates",this.state.lat,this.state.lng,'city',this.state.city); ///

     }

     ajoutLocalisation = () => {  
        this.props.localisationFunction(this.state.lat);
        this.props.localisationFunction(this.state.lng);
        this.props.localisationFunction(this.state.city);
    }



    render(){
        return(
        <View  style={{ flex: 1 }}>
                <GooglePlacesAutocomplete
                    placeholder="Votre ville"
                    minLength={2} // minimum length of text to search
                    /*ng-model-options="{ debounce: 15000 }"*/
                    autoFocus={false}
                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    listViewDisplayed="false" // true/false/undefined
                    fetchDetails={true}
                    renderDescription={row => row.description} // custom description render
                    onPress={(data,details = null) => {
                    var data = details;
                    this.getAdd(data);
                    this.ajoutLocalisation();
                    }}
                    getDefaultValue={() => {
                    return ''; // text input default value
                    }}
                    query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: 'AIzaSyC58rA63FNv5SEDnjzFhJdawpb45AlhzfA',
                    language: 'fr', // language of the results
                    types: '(cities)', // default: 'geocode'
                    }}

                    debounce={1500}
                />
        </View>
        )
    }
}

export default GetLocalisation