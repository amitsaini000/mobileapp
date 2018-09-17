import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
//import {StyleSheet, View, TextInput, Image} from 'react-native';
import { StyleSheet,View, TextInput,Text, ScrollView,Image,Button, 
        Animated,TouchableOpacity, Keyboard, 
        KeyboardAvoidingView,Platform } from 'react-native';
//import styles, { IMAGE_HEIGHT, IMAGE_HEIGHT_SMALL } from './style';
export default class UserInput extends Component {
  
  constructor(props) {
    super(props);  
    
  }
  
handleClick(){

  console.log("useinput handleClick")
}

  addImage(){
    
    if(this.props.source){
      return(<Image source={this.props.source} style={styles.inlineImg} />);
      }
      return "";
      
  }
  render() {
    return (
      <ScrollView style={{flex:1}}>      
         <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
      <View style={styles.inputWrapper}>
       
        <TextInput
          style={styles.input}
          placeholder={this.props.placeholder}
          secureTextEntry={this.props.secureTextEntry}
         
          autoCorrect={this.props.autoCorrect}
          isRequired = {this.props.isRequired} 
          autoCapitalize={this.props.autoCapitalize}
          returnKeyType={this.props.returnKeyType}
          placeholderTextColor="white"
         // underlineColorAndroid="transparent"
          keyboardType = {this.props.keyboardType} 
          
          onChangeText ={this.props.validate}
        />
      </View></KeyboardAvoidingView></ScrollView>
    );
  }
}

UserInput.propTypes = {
  source: PropTypes.number.isRequired,
  placeholder: PropTypes.string.isRequired,
  secureTextEntry: PropTypes.bool,
  autoCorrect: PropTypes.bool,
  autoCapitalize: PropTypes.string,
  returnKeyType: PropTypes.string,
  keyboardType: PropTypes.string,
  validate: PropTypes.func,
  isRequired: PropTypes.bool,

};

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  input: {
   // backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: DEVICE_WIDTH - 40,
    paddingLeft: 45,
    //borderRadius: 20,
    color: '#ffffff',
    borderBottomColor:"#f8f8f8",
    borderBottomWidth:1,
    height: 50,
    //backgroundColor: '#fff', 
   // marginHorizontal: 10,
   // marginVertical: 5,
   // paddingVertical: 5,
    // paddingHorizontal: 15,
    //width: window.width - 30,

    
  },
  marginBottom:
  {
      marginBottom: 20,
  },
  marginTop:{
    marginTop:20

  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'space-between'  
  },
  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 22,
    height: 22,
    left: 1,
    top: 9,
  },
});