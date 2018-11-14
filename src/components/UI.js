import React, { Component } from "react";
import { Text, View,  TouchableHighlight} from "react-native";
export const   LoginUI = function(props) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        height: 100
      }}
    >
      <TouchableHighlight
        style={{
          width: 250,
          alignItems: "center",
          justifyContent: "center",
          height: 50,
          backgroundColor: "darkviolet",
          marginTop: 20,
          marginBottom: 40
          //flex:1
        }}
        //onPress={this.setState({isLoginUi:true})}
        onPress={() => {
          const { navigate } = props.navigation;
          console.log("navigation register", props.navigation);
          navigate("Login");
        }}
        // onPress={signInWithGoogleAsync.bind(this)}

        //underlayColor="#99d9f4"
      >
        <Text style={{ color: "white", fontSize: 18 }}>Login </Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={{
          width: 250,
          alignItems: "center",
          justifyContent: "center",
          height: 50,
          backgroundColor: "darkviolet",
          marginTop: 20,
          marginBottom: 40
          //flex:1
        }}
        //onPress={this.setState({isLoginUi:true})}
        onPress={() => {
          const { navigate } = props.navigation;
          console.log("navigation register", props.navigation);
          navigate("Signup");
        }}
        // onPress={signInWithGoogleAsync.bind(this)}

        //underlayColor="#99d9f4"
      >
        <Text style={{ color: "white", fontSize: 18 }}>Signup </Text>
      </TouchableHighlight>
    </View>
  );
};
