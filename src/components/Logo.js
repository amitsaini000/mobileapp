import React, {Component} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';

import logoImg from '../../assets/logo.png';

export default class Logo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={logoImg} style={styles.image} 
          
        />
        <Text style={styles.text}>Powred by ABC</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 10,
  },
  image: {
    width: 40,
    height: 40,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    fontSize: 10,
    top:30,
    marginLeft:-50,
    paddingLeft: -50,
    
    
  },
});