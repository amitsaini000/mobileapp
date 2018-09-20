
import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  Picker,
  TextInput
} from "react-native";
import {  Icon }   from 'native-base'
import { getUserInfo, getReceiverInfo, saveSendMsg, sendMsg,sendMessageTemplate,findFromArray } from "./data";
import { Home, Login } from "../screens/screen";
import HeaderComponent from "./HeaderComponent";

import { db } from "../db/config";
import { getUserStatus } from "../db/dbutil";
import { Expo, Notifications } from "expo";
import t from "tcomb-form-native"; // 0.6.11
import DropdownAlert from "react-native-dropdownalert";
import ModalDropdown from 'react-native-modal-dropdown';
import commonStyle from './style';
import bootstrap from 'tcomb-form-native/lib/stylesheets/bootstrap.js';
import { Body ,Content,Card } from 'native-base';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Hideo  from './Hideo';

const Form = t.form.Form;
const backgroundColor = "#0067a7";

const ChatForm = t.struct({
  vehicleField: t.String
  //msg: t.String
});




const options = {
  stylesheet: bootstrap,
  order: ["vehicleField"],
  //auto: "placeholders",
  auto: 'none',
  fields: {
    vehicleField: {
      placeholder: "Enter Mobile Number",
      auto: "none",      
      returnKeyType: "send",
      //onSubmit : () => {this.temp},
      autoCorrect: false,
      borderColor: 'rgba(255,255,255,0.3)',
      config: { icon: 'info' },
      underlineColorAndroid: 'rgba(255,255,255,0.3)',      
      //underlayColor:"white"
    }
  }
};
options.stylesheet.textbox.normal = {
  color: "white",
  //fontSize: 17,
  //height: 40,
  borderColor: 'white', // <= relevant style here
  marginBottom: 8,
  marginVertical: 10,
  width: 300,
 // borderBottomWidth: 1,
  fontWeight: "bold",      
  //borderWidth: 0,
  backgroundColor:'rgba(255,255,255,0.3)'
};



export default class HomeComponent extends Component {
  _dropdown_2_renderButtonText(rowData) {
    console.log("rowdata:" ,rowData)
    const {name} = rowData;
    this.setState({ language: name });
    return `${name}`;
  }
  
  _dropdown_2_renderRow(rowData, rowID, highlighted) {
    let icon =require('../../assets/avatar.png');
    let evenRow = rowID % 2;
    return (
      <TouchableHighlight underlayColor='cornflowerblue'>
        <View style={[commonStyle.dropdown_2_row, {backgroundColor: evenRow ? 'lemonchiffon' : 'white'}]}>
          <Image style={commonStyle.dropdown_2_image}
                 mode='stretch'
                 source={icon}
          />
          <Text style={[commonStyle.dropdown_2_row_text, highlighted && {color: 'mediumaquamarine'}]}>
            {`${rowData.name}`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
  
  _dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    if (rowID == sendMessageTemplate.length - 1) return;
    let key = `spr_${rowID}`;
    return (<View style={commonStyle.dropdown_2_separator}
                  key={key}
    />);
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
    //console.log("Push notification Home.js", data.senderInfo);
    const { navigate } = this.props.navigation;
    const sendData = {
      senderId:data.senderInfo.senderId,
      receverId:data.senderInfo.receverId,
      name:data.senderInfo.name
    }
    console.log("handleNotification notification Home.js", sendData);
    navigate("UserNotification", { senderInfo: sendData });
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
        let getBlockUser = await getUserInfo(vehicleData.uid);
        if(getBlockUser.blockuser && getBlockUser.blockuser.length >0){

          isUserBlock = findFromArray(getBlockUser.blockuser,uid);
        
          if(isUserBlock && isUserBlock.length >0){
            this.onError(`You are blocked by ${parseVehicleField} User You can't send the message`);
            return;
          }
        }
        
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
    let drawerLabel = "Chat";
    let drawerIcon = () => (
      <Image
      style={{width:30,height:30}}
      source={require('../../assets/newmsg.png')} />
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
            justifyContent: "flex-start",
             marginTop: 50
            //flexDirection: 'row'
          }}
        >
         
          <Hideo
            iconClass={FontAwesomeIcon}
            iconName={'envelope'}
            iconColor={'white'}
            // this is used as backgroundColor of icon container view.
            iconBackgroundColor={'#f2a59d'}
            inputStyle={{ color: '#464949',borderWidth:2}}
            placeholder = "Enter Mobile Number"
            
            onChangeText={(text) => this.setState({input: text})}
            
          />
          <Text>{'user input: ' + this.state.input}</Text>
          <Hideo
            iconClass={FontAwesomeIcon}
            iconName={'envelope'}
            iconColor={'white'}
            // this is used as backgroundColor of icon container view.
            iconBackgroundColor={'#f2a59d'}
            inputStyle={{ color: '#464949',borderWidth:2}}
            placeholder = "Enter Mobile Number werw"
            errorStyle={(true) ? {borderColor:"red"} : "null"}
            errorMessage={(true) ? "Please asdasd  d" : "sssdf sf"}
            
          />
          <Hideo
            iconClass={FontAwesomeIcon}
            iconName={'envelope'}
            iconColor={'white'}
            // this is used as backgroundColor of icon container view.
            iconBackgroundColor={'#f2a59d'}
            inputStyle={{ color: '#464949',borderWidth:2}}
            placeholder = "Enter Mobile Number asda"
            errorStyle={(true) ? {borderColor:"red"} : "null"}
            errorMessage={(true) ? "Please asdasd  d" : "sssdf sf"}
            
          />
         
         <ModalDropdown ref="dropdown_2"
                style={commonStyle.dropdown_2}
                textStyle={commonStyle.dropdown_2_text}
                dropdownStyle={commonStyle.dropdown_2_dropdown}
                options={sendMessageTemplate}
                defaultValue={"Please Select The Message"}
                renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
                renderRow={this._dropdown_2_renderRow.bind(this)}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                
          />
          <TouchableHighlight
            style={{
              marginTop: 10,
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

