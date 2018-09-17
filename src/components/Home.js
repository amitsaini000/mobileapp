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
      borderColor: 'white', // <= relevant style here
      //marginBottom: 8,
      width: 300,
      //borderBottomWidth: 0,
      fontWeight: "bold",
      
      borderWidth: 0,
      
      
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
      fontWeight: "bold",
      borderBottomColor: 'red'
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
      underlineColorAndroid:'rgba(0,0,0,0)',
      auto: "none",      
      returnKeyType: "send",
      //onSubmit : () => {this.temp},
      autoCorrect: false,
      borderColor: 'transparent',
      config: { icon: 'info' }
     // underlineColorAndroid: 'transparent',
      
      //underlayColor:"white"
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    height: 500,
    paddingVertical: 100,
    paddingLeft: 20,
  },
  textButton: {
    color: 'deepskyblue',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'deepskyblue',
    margin: 2,
  },

  
  dropdown_2: {
    width: 300,
    marginTop: 7,
    borderBottomWidth:1,
    borderColor:"white"
  },
  dropdown_2_text: {
    //marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 18,
    color: 'white',
    textAlign: 'left',
    //textAlignVertical: 'center',
  },
  dropdown_2_dropdown: {
    width: "90%",
    height: "70%",
    borderColor: 'cornflowerblue',
    borderWidth: 2,
    borderRadius: 3,
  },
  dropdown_2_row: {
    flexDirection: 'row',
    height: 40,
    //alignItems: 'center',
  },
  dropdown_2_image: {
    marginLeft: 4,
    width: 30,
    height: 30,
  },
  dropdown_2_row_text: {
    marginHorizontal: 4,
    fontSize: 16,
    color: 'navy',
    textAlignVertical: 'center',
  },
  dropdown_2_separator: {
    height: 1,
    backgroundColor: 'cornflowerblue',
  },
 
});

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
        <View style={[styles.dropdown_2_row, {backgroundColor: evenRow ? 'lemonchiffon' : 'white'}]}>
          <Image style={styles.dropdown_2_image}
                 mode='stretch'
                 source={icon}
          />
          <Text style={[styles.dropdown_2_row_text, highlighted && {color: 'mediumaquamarine'}]}>
            {`${rowData.name}`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
  
  _dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    if (rowID == sendMessageTemplate.length - 1) return;
    let key = `spr_${rowID}`;
    return (<View style={styles.dropdown_2_separator}
                  key={key}
    />);
  }
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
        //console.log("vehicle:::::::", vehicleData);

        let getBlockUser = await getUserInfo(vehicleData.uid);
        //console.log("getBlockUser:::::::", getBlockUser);
        if(getBlockUser.blockuser && getBlockUser.blockuser.length >0){

          isUserBlock = findFromArray(getBlockUser.blockuser,uid);
          //console.log("isUserBlock:::::::", isUserBlock);
        
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
         <ModalDropdown ref="dropdown_2"
                style={styles.dropdown_2}
                textStyle={styles.dropdown_2_text}
                dropdownStyle={styles.dropdown_2_dropdown}
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

