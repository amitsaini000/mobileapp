import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ScrollView,
  Image,
  Button,
  Animated,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableHighlight
} from "react-native";

import styles, { IMAGE_HEIGHT, IMAGE_HEIGHT_SMALL } from "./style";
import logo from "../../assets/logo.png";
import HeaderComponent from "./HeaderComponent";
import UserInput from "./UserInput";
import valid from "./validation";
import usernameImg from "../../assets/username.png";
import passwordImg from "../../assets/password.png";
import eyeImg from "../../assets/eye_black.png";
import Expo from "expo";
import { sendRequest } from "../utils/util";
import t from "tcomb-form-native"; // 0.6.11
import { db, fire } from "../db/config";
import { Home } from "../screens/screen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DropdownAlert from "react-native-dropdownalert";
import { getReceiverInfo } from "./data";

const Form = t.form.Form;
// const db = firebase.firestore();
// const settings = { timestampsInSnapshots: true };
// db.settings(settings);

const Mobile = t.refinement(t.Number, function(n) {
  return n == 10;
});
Mobile.getValidationErrorMessage = function() {
  return "Invalid Number";
};

t.Number.getValidationErrorMessage = function(value) {
  if (!value) return "empty number";
  else if (!Number.isInteger(value)) return "Invalid Number";
};

const User = t.struct({
  mobile: t.Number,
  name: t.String,
  otp: t.Number,
  vechile: t.String,
  password: t.String
});

const formStyles = {
  ...Form.stylesheet,
  formGroup: {
    normal: {
      marginBottom: 10
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
      borderColor: "#cccccc", // <= relevant style here
      //borderWidth: 1,
      marginBottom: 8,
      width: 300,
      borderBottomWidth: 1,
      fontWeight: "bold"
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
const backgroundColor = "#0067a7";
const options = {
  stylesheet: formStyles,
  order: ["mobile", "name", "otp", "vechile", "password"],
  fields: {
    // email: {
    //   placeholder: 'email@mail.com',
    //   error: 'email is empty?',
    //   auto: "none",
    // },
    mobile: {
      placeholder: "Mobile",
      auto: "none",
      returnKeyType: "next",
      autoCorrect: false,
      maxLength: 10
      //onSubmitEditing: () => this.setFocus("name"),
      // onSubmitEditing: this.setFocus,
    },

    name: {
      placeholder: "Name",
      auto: "none",
      returnKeyType: "next",
      autoCorrect: false,
      error: "Empty"
      // onSubmitEditing: {this.setFocus("otp")},
    },

    otp: {
      placeholder: "OTP",
      auto: "none",
      returnKeyType: "next",
      autoCorrect: false,
      maxLength: 6
    },
    vechile: {
      placeholder: "VECHILE",
      auto: "none",
      returnKeyType: "next",
      autoCorrect: false
    },
    password: {
      placeholder: "Password",
      auto: "none",
      returnKeyType: "send",
      autoCorrect: false
      //secureTextEntry:true
    }
  }
};
const value = {
  name: "user1",
  mobile: 9350268283,
  vechile: "up16bd7729",
  otp: 123456,
  password: 123456
};
// optional rendering options (see documentation)

class RegisterComponent extends Component {
  constructor(props) {
    super(props);
    //this.imageHeight = new Animated.Value(IMAGE_HEIGHT);
    this.state = {
      formValue: value,
      mobile: {},
      token: "",
      uid: null,
      loading:false
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
  async setToken() {
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
      return;
    }
    let value = await Expo.Notifications.getExpoPushTokenAsync();
    console.log("Our token Register", value);
    this.setState({ token: value });
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
  async saveUser(user, uid) {
    let vechile = user.vechile.replace(/[\. ,:-]+/g, "").toUpperCase();
    console.log("Save user uid::", uid);
    console.log("Save user vehicle::", vechile);
    var userDetails = {},
      jsonVariable = {},
      vechileDetails = {};
    userDetails = {
      name: user.name,
      mobile: user.mobile,
      // vehicle: user.vechile, // +",up125590,up174330",
      token: this.state.token,
      uid: uid,
      vehicle: vechile
    };
    vechileDetails[vechile + ""] = {
      vehicle: vechile,
      name: user.name,
      token: this.state.token,
      uid: uid
    };

    let isVehicleAdded = await this.saveInfo(
      db.collection("vehicle").doc(vechile),
      vechileDetails
    );
    console.log("isVehicleAdded :", isVehicleAdded);
    if (isVehicleAdded.success) {
      let isUserAdded = await this.saveInfo(
        db.collection("users").doc(uid),
        userDetails
      );
      this.onSuccess(isVehicleAdded.success);
    }
    if (isVehicleAdded.error) {
      //fire.auth().deleteUser(uid);
      this.onError(status.error);
    }
  }
  handleSubmit = async e => {
    let status = {};
    const value = this._form.getValue();
    // console.log("value: ", value);
    if (value) {
      this.setState({loading:true});
      let vechile = value.vechile.replace(/[\. ,:-]+/g, "").toUpperCase();
      let isVheicleAlreadyAdded = await getReceiverInfo(vechile);
      if (isVheicleAlreadyAdded.vehicle) {
        this.onError(`Sorry User ${vechile} is  Registered with us`);
        return;
      }
      this.setState({ mobile: value.mobile });
      status = await this.signup(e, value);
      console.log("user created status", status);
      if (status.success) {
        this.saveUser(value, this.state.uid);
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
  componentWillMount() {
    //this.setToken();
  }

  componentWillUnmount() {}

  keyboardWillShow = event => {
    Animated.timing(this.imageHeight, {
      duration: event.duration,
      toValue: IMAGE_HEIGHT_SMALL
    }).start();
  };

  keyboardWillHide = event => {
    Animated.timing(this.imageHeight, {
      duration: event.duration,
      toValue: IMAGE_HEIGHT
    }).start();
  };

  keyboardDidShow = event => {
    Animated.timing(this.imageHeight, {
      toValue: IMAGE_HEIGHT_SMALL
    }).start();
  };

  keyboardDidHide = event => {
    Animated.timing(this.imageHeight, {
      toValue: IMAGE_HEIGHT
    }).start();
  };

  //<Animated.Image source={logo} style={[styles.logo, { height: this.imageHeight }]} />
  render() {
    return (
      <KeyboardAwareScrollView
        style={{ backgroundColor: "#4c69a5" }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={{ flex: 1 }}
        scrollEnabled={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#4c69a5",
            alignItems: "center"
          }}
        >
          <Form
            ref={c => (this._form = c)}
            type={User}
            options={options}
            value={this.state.formValue}
            padding={35}
            onChange={formValue => this.setState({ formValue })}
          />
          <TouchableHighlight
            style={{
              width: 200,
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              backgroundColor: "#ffae",
              marginTop: 20,
              marginBottom: 40
            }}
            onPress={this.handleSubmit}
            // onPress={signInWithGoogleAsync.bind(this)}

            //underlayColor="#99d9f4"
          >
          {this.state.loading ? <ActivityIndicator  animating={true} size="large" color="#0000ff" />
                              :<Text style={{color: 'white', fontSize: 18}}>Signup  </Text>}
           
          </TouchableHighlight>

          <DropdownAlert
            ref={ref => (this.dropdown = ref)}
            onClose={data => this.onClose(data)}
            closeInterval={10000}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

// async function signInWithGoogleAsync() {
//   try {
//     const result = await Expo.Google.logInAsync({
//       androidClientId: "6358744912-9fl3abppce880pumvcmgsc2rq9fn57jk.apps.googleusercontent.com",
//       iosClientId: "6358744912-9fl3abppce880pumvcmgsc2rq9fn57jk.apps.googleusercontent.com",
//       scopes: ['profile', 'email'],
//     });

//     if (result.type === 'success') {
//       console.log("--------------->" + result.accessToken);
//       return result.accessToken;
//     } else {
//       console.log("--------------cancled->");
//       return { cancelled: true };
//     }
//   } catch (e) {
//     console.log("---------------Error>" + e);
//     return { error: true };
//   }
// }
var styles2 = StyleSheet.create({});
export default RegisterComponent;
