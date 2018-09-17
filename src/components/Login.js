/*
Mr Nguyen Duc Hoang
https://www.youtube.com/c/nguyenduchoang
Email: sunlight4d@gmail.com
LoginCompenent 
*/
import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  StyleSheet,ScrollView,KeyboardAvoidingView,ActivityIndicator,
  
} from "react-native";
import { Register, Home } from "../screens/screen";
import HeaderComponent from "./HeaderComponent";
import UserInput from "./UserInput";
import styles, { IMAGE_HEIGHT, IMAGE_HEIGHT_SMALL } from "./style";
import usernameImg from "../../assets/username.png";
import passwordImg from "../../assets/password.png";
import eyeImg from "../../assets/eye_black.png";
import Logo from "./Logo";
import t from "tcomb-form-native"; // 0.6.11
import {fire} from "../db/config";
import DropdownAlert from 'react-native-dropdownalert';
import {signOut,signIn} from "../db/dbutil";
//import { createDrawerNavigator,DrawerItems,createStackNavigator } from 'react-navigation';
import {  drawerIcon } 
  from 'native-base'
const backgroundColor = "#0067a7";
const Form = t.form.Form;
const User = t.struct({
  email: t.Number,
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


export default class LoginCompenent extends Component {
    options = {
    stylesheet: formStyles,
    order: ["email", "password"],
    fields: {
      email: {
        placeholder: "Mobile No.",
        error: "email is empty?",
        auto: "none",
        returnKeyType: "next"
      },
  
      password: {
        placeholder: "Password",
        auto: "none",
        //returnKeyType: "send",
        autoCorrect: false,
        //secureTextEntry:true
        returnKeyType: "go",
        onSubmitEditing : () => { 
          console.log('collapse changed');
          this.login(); 
         },
         //onSubmitEditing:{(event) => this.onSubmitHandler(event)}
      }
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
      formValue: null ,
      loading:false
    };
    this.showPass = this.showPass.bind(this);
    this.login = this.login.bind(this);
  }
  onError = error => {
    if (error) {
      this.dropdown.alertWithType('error', 'Error', error);
    }
  };
  // ...
  onClose(data) {
    // data = {type, title, message, action}
    // action means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
}
  
  login () {
    if(this.state.loading){
      return;
    }
    const value = this._form.getValue();
    console.log('value: ', value);
    if(value){
     this.setState({loading:true}) 
     const email = value.email+"mom@mom.com";
     var getUser = function(user){
         if(user){
          this.setState({loading:false,formValue:null})  
          const { navigate } = this.props.navigation;
          navigate("Profile");  

         } else{
          this.onError(" Please Checkh Mobile No. or  Password is Wrong.There is no user record corresponding to this identifier.")
          this.setState({loading:false}) 
         }
     }.bind(this)
     signIn(email,value.password,getUser)
   }
  };
  showPass() {
    this.state.press === false
      ? this.setState({ showPass: false, press: true })
      : this.setState({ showPass: true, press: false });
  }

  
  showLoader =()=> {
  return (<TouchableHighlight
        style={styles1.buttonStyle}
        onPress={this.state.loading  ? {} : this.login.bind(this)}
        //underlayColor="#99d9f4"
      >
      
      {
        this.state.loading ?  <ActivityIndicator size="large" color="#0000ff" /> 
                           :  <Text style={styles.buttonText}>Login</Text>
      }
      </TouchableHighlight>)

  }
  // static navigationOptions = ({ navigation }) => {
  //   let drawerLabel = "Login";
  //   let drawerIcon = () => (
  //     <Image
  //               source={require("../../assets/home-icon.png")}
  //               style={{ width: 26, height: 26, tintColor: backgroundColor }}
  //           />
  //   );
  //   return { drawerLabel, drawerIcon };
  // };

  static navigationOptions =  {
    headerTitle:"Login",
    headerStyle: {
      backgroundColor: backgroundColor,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    drawer: () => ({
      label: 'Login',
      icon: () =><Image  source={require("../../assets/home-icon.png")}
                    style={{ width: 26, height: 26, }}
                />
    })
  }
  
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor:backgroundColor
        }}
      >
        
        <ScrollView style={{ flex: 1 }}>
          <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Form
              ref={c => (this._form = c)}
              type={User}
              options={this.options}
              value={this.state.formValue}
              padding={35}
              onChange={formValue => this.setState({ formValue })}
              //onSubmit= {(event) => this.login(event)}
              //onSubmitEditing={(event) => this.login(event)}
            />
            <View  style={{flex: 1, flexDirection: 'row'}} >
            {this.showLoader()} 
             
           
            <TouchableHighlight
              style={styles1.buttonStyle}
              onPress={() => {
                const { navigate } = this.props.navigation;
                navigate("Signup");                                             
            }}

              //underlayColor="#99d9f4"
            >
             <Text style={styles.buttonText}>Signup</Text>
            </TouchableHighlight>
            
            </View>
            <TouchableHighlight
                    style={{
                    margin: 2,
                    //width: 200,
                    //height: 45,
                    //backgroundColor: "#ffffff",
                    padding: 10,
                    alignItems: "center"
                    

                    }}
                   
                >
                 <Text style={{color:"#ffffff"}}> Forgot Password</Text>
            </TouchableHighlight>
            
          </KeyboardAvoidingView>
        </ScrollView>
        <DropdownAlert ref={ref => this.dropdown = ref} onClose={data => this.onClose(data)} closeInterval ={10000}/>  
      </View>
    );
  }
}
const styles1 = StyleSheet.create({
  buttonStyle:{
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    backgroundColor: "#ffae",
    //marginTop: 20,
    //marginBottom: 40,
    margin: 20,
  },
  loginContainer: {
    flex: 1,
    backgroundColor: backgroundColor,
    alignItems: "center",
    justifyContent: "center"
  },
  TouchableHighlightContainer: {
    margin: 20,
    width: 150,
    height: 45,
    backgroundColor: "red",
    padding: 10,
    alignItems: "center"
  },
  inputContainer: {
    flex: 1,
    alignSelf: "stretch",
    // backgroundColor: "pink",
    alignItems: "center",
    //justifyContent: 'center',
    borderRadius: 6,
    marginTop: 20,
    marginLeft: 10,
    //paddingLeft:50,
    // paddingRigth:10
    marginRight: 10
    //marginBottom:20
  },
  userInput: {
    flex: 1,
    //  flexDirection:'row',
    // alignSelf:"stretch",
    marginTop: 10,
    marginBottom: 10,
    alignItems: "flex-start"
    // justifyContent: 'space-around',
    //backgroundColor: "black",
  },
  userInputComp: {
    flex: 1,
    //flexDirection:'row',
    // alignSelf:"stretch",
    marginTop: 10,
    marginBottom: 10,
    alignItems: "flex-start"
    // justifyContent: 'space-around',
    //backgroundColor: "blue",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-around",
    padding: 30
  }
});
