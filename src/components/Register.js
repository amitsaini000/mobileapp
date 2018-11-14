import React, { Component } from "react";

import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableHighlight
} from "react-native";

import Expo from "expo";
import { db, fire } from "../db/config";
import DropdownAlert from "react-native-dropdownalert";
import { getReceiverInfo } from "./data";

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import Hideo  from './Hideo';
import { backgroundColor } from "./data";
import {watchPersonData} from "../reducers/person";
import {connect} from "react-redux";
import { withNavigation } from 'react-navigation';

class RegisterComponent extends Component {
  constructor(props) {
    super(props);
    //this.imageHeight = new Animated.Value(IMAGE_HEIGHT);
    this.state = {
      formValue: "",
      
      token: "",
      uid: null,
      loading:false,
      name: "",
      mobile: 0,
      vehicle: "",
      otp: 0,
      password: ""
    };

    //this.showPass = this.showPass.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.setToken();
    console.log("init regerter");
  }
  onSuccess = success => {
    if (success) {
      this.dropdown.alertWithType("success", "Success", success);
    }
  };
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
  static navigationOptions = {
    headerTitle: "Register",
    headerStyle: {
      backgroundColor: backgroundColor
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };
  async setToken(cb) {
    if (this.state.token) {
      return;
    }
    if (!Expo.Constants.isDevice) {
      return;
    }
    let { status } = await Expo.Permissions.askAsync(
      Expo.Permissions.NOTIFICATIONS
    );
    if (status !== "granted") {
      this.onError("Please Enable The Notification on your device");
      return;
    }
    let value = await Expo.Notifications.getExpoPushTokenAsync();
    console.log("Our token Register", value);
    this.setState({ token: value });
    if(cb){
      cb();
    }
    //firebase.database().ref("users").update({token:value });
  }
  showPass() {
    console.log(this.state.showPass);
    this.state.press === false
      ? this.setState({ showPass: false, press: true })
      : this.setState({ showPass: true, press: false });
  }

  authListner() {
    fire.auth.onAuthStateChange(email => {
      if (email) {
        this.setState({ email });
      } else {
        this.setState({ email: null });
      }
    });
  }
  signup = async (e, data) => {
    let status = await fire
      .auth()
      .createUserWithEmailAndPassword(
        data.mobile + "mom@mom.com",
        data.password
      )
      .then(u => {
        this.setState({ uid: u.user.uid });
        return { success: "User created" };
      })
      .catch(u => {
        console.log("Error", u);
        return { error: u };
      });
    return status;
  };

  async addDataIfNotExist(doc, data) {
    let status = await doc
      .set(data)
      .then(function(snapshot) {
        console.log("saveInfo  added successfully ");
        return { success: "added successfully" };
      })
      .catch(function(error) {
        console.error("saveInfo Error adding document: ", error);
        return { error: error };
      });
    return status;
  }
  saveInfo = async (doc, data) => {
    let waitforStatus = await doc
      .get()
      .then(
        function(snapshot) {
          if (snapshot.exists) {
            console.log("Document already exist:", snapshot.data());
            return { error: "Vehicle already exist" };
          } else {
            return this.addDataIfNotExist(doc, data);
          }
        }.bind(this)
      )
      .catch(function(error) {
        console.log("Error getting document:", error);
        return { error: error };
      });
    return waitforStatus;
  };
  async saveUser( uid) {
    let user = this.state;
    let vehicle = user.vehicle.replace(/[\. ,:-]+/g, "").toUpperCase();
    console.log("Save user uid::", uid);
    console.log("Save user vehicle::", vehicle);
    var userDetails = {},      
      vechileDetails = {};
    userDetails = {
      name: user.name,
      mobile: user.mobile,
      // vehicle: user.vechile, // +",up125590,up174330",
      token: this.state.token,
      uid: uid,
      vehicle: vehicle
    };
    vechileDetails = {
      vehicle: vehicle,
      name: user.name,
      token: this.state.token,
      uid: uid
    };

    let isVehicleAdded = await this.saveInfo(
      db.collection("vehicle").doc(vehicle),
      vechileDetails
    );
    console.log("isVehicleAdded :", isVehicleAdded);
    if (isVehicleAdded.success) {
      let isUserAdded = await this.saveInfo(
        db.collection("users").doc(uid),
        userDetails
      );
      this.onSuccess(isVehicleAdded.success);
      this.props.watchPersonData();
      const { navigate } = this.props.navigation;
      //console.log("navigation register",this.props.navigation);
      navigate("Profile");  
    }
    if (isVehicleAdded.error) {
      //fire.auth().deleteUser(uid);
      this.onError(status.error);
    }
  }
  handleSubmit = async e => { 
    let status = {};
    let isError =false;
    const {
      name,
      mobile,
      vehicle,
      otp,
      password
    } = this.state;
    if(!name ){
      this.setState({name: true});
      isError = true;
    }
    if(!mobile){
       this.setState({mobile: true});
       isError = true;
    }
    
    if(!vehicle){
      this.setState({vehicle: true});
      isError = true;
    }
   if(!otp){
    this.setState({otp: true});
    isError = true;
   }
   if(!password){
    this.setState({password: true});
    isError = true;
   }
   if(!this.state.token){
    this.onError("Please Enable The Notification on your device");
    return;
   }

    if (!isError 
         && name !== true
         && mobile !== true
         && vehicle !== true
         && otp !== true
         && password !== true 
        ) {
    
      this.setState({loading:true});
      let vechileParse = vehicle.replace(/[\. ,:-]+/g, "").toUpperCase();
      let isVheicleAlreadyAdded = await getReceiverInfo(vechileParse);
      if (isVheicleAlreadyAdded.name) {
        this.onError(`Sorry User ${vechileParse} is  Registered with us`);
        return;
      }
      status = await this.signup(e, {mobile:mobile,password:password});
      console.log("user created status", status);
      if (status.success) {
        this.saveUser(this.state.uid);        
      }

      if (status.error) {
        this.onError(status.error);
      }
      this.setState({loading:false});
    }

    //var user =  sendRequest('http://10.170.10.45:5000/login/login/');
    //console.log("user,::",user);
  };

  componentDidMount() {
    // give focus to the name textbox
    //this._form.getComponent('mobile').refs.input.focus();
  }
  setFocus(name) {
    this._form.getComponent(name).refs.input.focus();
  }
  

  //<Animated.Image source={logo} style={[styles.logo, { height: this.imageHeight }]} />
  render() {
    return (
      
        <View
          style={{
            flex: 1,
            backgroundColor: backgroundColor,
            //alignItems: "center",
           // justifyContent:"center"
            //marginTop:15
          }}
        >
        
       <ScrollView>
       <View
          style={{
            flex: 1,
            backgroundColor: backgroundColor,
            alignItems: "center",
            justifyContent:"center"
            //marginTop:15
          }}
        >
        <Hideo
            style = {{width:"94%"}}
            iconClass={FontAwesomeIcon}
            //iconClass={MaterialsIcon}
            //iconName={'directions-bus'} //class not need 
            iconName={'user-o'}
            iconColor={'white'}
            // this is used as backgroundColor of icon container view.
            iconBackgroundColor={'#f2a59d'}           
            placeholder = "Enter Name"            
            onChangeText={(text) => this.setState({name: text})}             
            vehicleInputError =  {this.state.name} 
            value = {this.state.name}     
          />
         <Hideo
            style = {{width:"94%"}}
            iconClass={FontAwesomeIcon}
            //iconClass={MaterialsIcon}
            //iconName={'directions-bus'} //class not need 
            iconName={'phone'}
            iconColor={'white'}
            // this is used as backgroundColor of icon container view.
            iconBackgroundColor={'#f2a59d'}           
            keyboardType="numeric"
            placeholder = "Enter Mobile Number"            
            onChangeText={(text) => this.setState({mobile: text})}             
            vehicleInputError =  {this.state.mobile} 
            //value = {Number(this.state.mobile)}     
          />
          <Hideo
            style = {{width:"94%"}}
            //iconClass={FontAwesomeIcon}
            iconClass={MaterialsIcon}
            //iconName={'directions-bus'} //class not need 
            iconName={'directions-bus'}
            iconColor={'white'}
            // this is used as backgroundColor of icon container view.
            iconBackgroundColor={'#f2a59d'} 
            placeholder = "Vehicle Number"            
            onChangeText={(text) => this.setState({vehicle: text})}             
            vehicleInputError =  {this.state.vehicle} 
            value ={this.state.vehicle}      
          />
          <Hideo
            style = {{width:"94%"}}
            iconClass={FontAwesomeIcon} 
            //iconClass={MaterialsIcon}
            //iconName={'directions-bus'} //class not need 
            iconName={'envelope-o'}
            iconColor={'white'}
            // this is used as backgroundColor of icon container view.
            iconBackgroundColor={'#f2a59d'}           
            keyboardType="numeric"
            
            placeholder = "OTP"            
            onChangeText={(text) => this.setState({otp: text})}             
            vehicleInputError =  {this.state.otp} 
            //value ={Number(this.state.otp)}      
          /> 
          <Hideo
            style = {{width:"94%"}}
            iconClass={FontAwesomeIcon}
            //iconClass={MaterialsIcon}
            //iconName={'directions-bus'} //class not need 
            iconName={'unlock'}
            iconColor={'white'}
            // this is used as backgroundColor of icon container view.
            iconBackgroundColor={'#f2a59d'}           
            placeholder = "Enter Password"            
            onChangeText={(text) => this.setState({password: text})}             
            vehicleInputError =  {this.state.password} 
            value = {this.state.password}     
          />
          
          <TouchableHighlight
            style={{
              width: 250,
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              backgroundColor: "darkviolet",
              marginTop: 20,
              marginBottom: 40,             
              flex:1
            }}
            onPress={this.handleSubmit}
            // onPress={signInWithGoogleAsync.bind(this)}

            //underlayColor="#99d9f4"
          >
          {this.state.loading ? <ActivityIndicator  animating={true} size="large" color="#0000ff" />
                              :<Text style={{color: 'white', fontSize: 18}}>Signup  </Text>}
           
          </TouchableHighlight>

          <TouchableHighlight
            style={{
              width: 250,
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              backgroundColor: "darkviolet",
              marginTop: 20,
              marginBottom: 40,             
              flex:1
            }}
            //onPress={this.setState({isLoginUi:true})}
            onPress={() => {

              const { navigate } = this.props.navigation;
              console.log("navigation register",this.props.navigation);
              navigate("Login");                                             
          }}
            // onPress={signInWithGoogleAsync.bind(this)}

            //underlayColor="#99d9f4"
          >
         <Text style={{color: 'white', fontSize: 18}}>Login  </Text>
           
          </TouchableHighlight>
          </View>
          </ScrollView>

          <KeyboardAvoidingView
            behavior={"padding"}
            keyboardVerticalOffset={80}
          />
          <DropdownAlert
            ref={ref => (this.dropdown = ref)}
            onClose={data => this.onClose(data)}
            closeInterval={10000}
          />
        </View>
       
    );
  }
}


var styles2 = StyleSheet.create({});
const mapStateToProps = (state) => {
  console.log("mapStateToProps-register.js.js--",state)
  return {
      person: state.person
  }
}
const mapDispatchToProps = (dispatch) => {
  return { 
    watchPersonData: () => { dispatch(watchPersonData()) },
  };
}


export default connect(mapStateToProps,mapDispatchToProps)(withNavigation(RegisterComponent));

