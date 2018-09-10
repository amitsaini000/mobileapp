/*
        Mr Nguyen Duc Hoang
        https://www.youtube.com/c/nguyenduchoang
        Email: sunlight4d@gmail.com
        HomeComponent 


        */
import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  Picker
} from "react-native";
import { getUserInfo, getReceiverInfo, saveSendMsg, sendMsg } from "./data";
import { Home, Login } from "../screens/screen";
import HeaderComponent from "./HeaderComponent";
import { db } from "../db/config";
import { getUserStatus } from "../db/dbutil";
import { Expo, Notifications } from "expo";
import t from "tcomb-form-native"; // 0.6.11
import DropdownAlert from "react-native-dropdownalert";

//  const db = firebase.firestore();
const Form = t.form.Form;
const backgroundColor = "#0067a7";

const ChatForm = t.struct({
  vehicleField: t.String
  //msg: t.String
});
const formStyles = {
  ...Form.stylesheet,
  formGroup: {
    normal: {
      marginBottom: 10,
      //underlineColorAndroid: 'white',
    }
  },
  controlLabel: {
    normal: {
      color: "blue",
      fontSize: 18,
      marginBottom: 7,
      fontWeight: "600"
    },
    // the style applied when a validation error occours
    error: {
      color: "red",
      fontSize: 18,
      marginBottom: 7,
      fontWeight: "600"
    }
  },
  textbox: {
    // the style applied wihtout errors
    normal: {
      color: "white",
      fontSize: 17,
      height: 40,
      //padding: 15,
      // borderRadius: 4,
      borderColor: "white", // <= relevant style here
      //borderWidth: 1,
      marginBottom: 8,
      width: 300,
      borderBottomWidth: 1,
      fontWeight: "bold",
      borderColor:'transparent'
      //underlineColorAndroid: 'white',
      
    },

    // the style applied when a validation error occours
    error: {
      color: "white",
      fontSize: 17,
      height: 40,
      //padding: 10,
      // borderRadius: 4,
      borderColor: "#a94442", // <= relevant style here
      //borderWidth: 1,
      marginBottom: 8,
      width: 300,
      borderBottomWidth: 1,
      fontWeight: "bold"
    }
  }
};

const options = {
  stylesheet: formStyles,
  order: ["vehicleField"],
  //auto: "placeholders",
  auto: 'none',
  fields: {
    vehicleField: {
      placeholder: "Mobile",
      auto: "none",
      
      returnKeyType: "send",
      //onSubmit : () => {this.temp},
      autoCorrect: false,
      underlineColorAndroid: 'transparent',
    }
  }
};

export default class HomeComponent extends Component {
  temp = ()=>{
    console.log("temp")
  }
  constructor(props) {
    super(props);
  
    this.state = {
      token: null,
      notification: null,
      body: "",
      title: "init",
      formValue: {},
      uid: null,
      isSpinner: false,
      sentMsg: false,
      language: "" 
    };
    console.log("Home init", this.state);
  }
  getTitle(){
    if( this.state.title == "init" ){
      return this.state.title;
      //return <View>  <ActivityIndicator size="large" color="#0000ff" /> </View>;
    }
    else{
        return this.state.title;
    }
  }
  onError = error => {
    if (error) {
      this.dropdown.alertWithType("error", "Error", error);
    }
  };
  // ...
  onClose(data) {
    // data = {type, title, message, action}
    // action means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
  }
  showLoader() {
    if (this.state.sentMsg) {
      return (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    else{
        return (<View><Text style={{ color: "white", fontSize: 18 }}>Send Msg </Text></View>)
    }

    
  }
  
  getUser(){
      if(this._isMounted ){
          getUserStatus(this.checkLogin);
      }
      
  }  
  componentDidMount() {
      this._isMounted = true;
      this.getUser();
  }
  componentWillUnmount(){
      this._isMounted = false;
    
  }
  handleNotification = ({ origin, data }) => {
    console.log(
      `Push notification ${origin} with data: ${JSON.stringify(
        data.senderInfo
      )}`
    );
    console.log("Push notification", data.senderInfo);
    const { navigate } = this.props.navigation;
    navigate("UserNotification", { senderInfo: data.senderInfo });
  };
  componentWillUnmount() {
    this.subscription && this.subscription.remove();
  }
  componentWillMount() {
    this.subscription = Notifications.addListener(this.handleNotification);
  }

  checkLogin = async user => {
    console.log(" home checkLogin:::");
    if (user) {
      this.setState({ uid: user.uid });
      const useerInfo = await getUserInfo(user.uid);
      this.setState({ title: useerInfo.name });
    } else {
      const { navigate } = this.props.navigation;
      navigate(Login);
    }
  };

  sendPushNotification = async () => {
    try {
      const value = this._form.getValue();
      if (value &&  this.state.language != "" ) { 
        const parseVehicleField  = value.vehicleField.replace(/[\. ,:-]+/g, "").toUpperCase();  
        const vehicleData = await getReceiverInfo(parseVehicleField);
        if (vehicleData.error) {
          this.onError(vehicleData.error);
          this.setState({ formValue: {} });
          return;
        }
        const uid = this.state.uid;
        console.log("vehicle:::::::", vehicleData);
        
        saveSendMsg({
          senderUid: uid,
          receverId: vehicleData.uid,
          text: this.state.language,
          token: vehicleData.token,
          name: vehicleData.name
        });
        sendMsg(vehicleData.token, vehicleData.name, this.state.language, {
          senderId: vehicleData.uid,
          receverId: uid
        });
      }
    } catch (e) {
      console.log(e);
      this.onError(e);
    }
  };

  static navigationOptions = ({ navigation }) => {
    let drawerLabel = "Send Message";
    let drawerIcon = () => (
      <Image
        source={require("../../assets/home-icon.png")}
        style={{ width: 26, height: 26, tintColor: backgroundColor }}
      />
    );
    return { drawerLabel, drawerIcon };
  };
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: backgroundColor
        }}
      >
        <HeaderComponent {...this.props} title={this.getTitle()} />
        <View
          style={{
            flex: 1,
            //backgroundColor: backgroundColor,
            alignItems: "center",
            justifyContent: "center",
            marginTop: -200
            //flexDirection: 'row'
          }}
        >
          <Form
            ref={c => (this._form = c)}
            type={ChatForm}
            options={options}
            value={this.state.formValue}
            padding={35}
            onChange={formValue => this.setState({ formValue })}
            
            
          />
          <Picker
           selectedValue={this.state.language}
            style={{
              height: 50,
              //color: "#ffffff",
              width: 300,
              //borderBottomWidth: 1,
              borderStyle:"solid",
              color:"red",
              borderBottomColor:"green",
              borderColor:"white",
              borderRightColor:"grey"
            }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ language: itemValue })
            }
            
          >
            <Picker.Item label="Please Select The Message" value="" />
            <Picker.Item label="JavaScript" value="js" />
            <Picker.Item label="C" value="c" />
            <Picker.Item label="C++" value="c++" />
            <Picker.Item label="Java" value="Java" />
          </Picker>
          <TouchableHighlight
            style={{
              margin: 2,
              width: 200,
              height: 45,
              backgroundColor: "darkviolet",
              padding: 10,
              alignItems: "center"
            }}
            //onPress={this.signOut}
            onPress={this.sendPushNotification}
          >
            {this.showLoader()}
          </TouchableHighlight>

          <KeyboardAvoidingView
            behavior={"padding"}
            keyboardVerticalOffset={50}
          />
        </View>
        <DropdownAlert
          ref={ref => (this.dropdown = ref)}
          onClose={data => this.onClose(data)}
          closeInterval ={10000}
        />
      </View>
    );
  }
}

