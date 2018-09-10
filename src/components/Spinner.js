import React, { Component } from "react";
import ReactNative, { Component } from "react-native";

var {
  StyleSheet,
  View,
  TouchableOpacity,
  Text
} = ReactNative;

var Spinner = require('react-native-spinkit');
var   types = ['CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 'ChasingDots', 
               'ThreeBounce', 'Circle', '9CubeGrid', 'WordPress', 'FadingCircle', 'FadingCircleAlt', 'Arc', 'ArcAlt'];
    
function render(index) {
    var type = types[index];

    return (
      <View style={styles.container}>
        <Spinner style={styles.spinner} isVisible={this.state.isVisible} size={this.state.size} type={type} color={this.state.color}/>

        <Text style={styles.text}>Type: {type}</Text>

        <TouchableOpacity style={styles.btn} onPress={this.next}>
          <Text style={styles.text}>Next</Text>
        </TouchableOpacity>
         
      </View>
    );
  }



var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d35400',
  },

  spinner: {
    marginBottom: 50
  },

  btn: {
    marginTop: 20
  },

  text: {
    color: "white"
  }
});