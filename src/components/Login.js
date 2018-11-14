
import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableHighlight,TouchableOpacity,
  StyleSheet,ScrollView,KeyboardAvoidingView,ActivityIndicator,
  
} from "react-native";
import styles, { IMAGE_HEIGHT, IMAGE_HEIGHT_SMALL } from "./style";
import DropdownAlert from 'react-native-dropdownalert';
import {signOut,signIn} from "../db/dbutil";
 
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
//import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import Hideo  from './Hideo';

import Register from "./Register";
import { backgroundColor } from "./data";


export default class LoginCompenent extends Component {
   
  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
      formValue: null ,
      loading:false,
      userMobileInput:"",
      userPasswordInput:"",
      isLoginUi : true
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
    let isError = false;
    if(!this.state.userMobileInput ){
      this.setState({userMobileInput: true});
      isError = true;
    }
    if(!this.state.userPasswordInput){
       this.setState({userPasswordInput: true});
       isError = true;
    }
    //console.log('isError exist: ', isError);
    if(! isError && this.state.userMobileInput !== true && this.state.userPasswordInput !== true){
     this.setState({loading:true}) 
     const email = this.state.userMobileInput+"mom@mom.com";
     var getUser = function(user){
         if(user){
          this.setState({loading:false,userMobileInput:"",userPasswordInput:""})  
          const { navigate } = this.props.navigation;
          navigate("Profile");  

         } else{
          this.onError(" Please Checkh Mobile No. or  Password is Wrong.There is no user record corresponding to this identifier.")
          this.setState({loading:false}) 
         }
     }.bind(this)
     signIn(email,this.state.userPasswordInput,getUser)
   }
  };
  showPass() {
    this.state.press === false
      ? this.setState({ showPass: false, press: true })
      : this.setState({ showPass: true, press: false });
  }

  
  showLoader =()=> {
  return (<TouchableOpacity
        style={styles1.buttonStyle}
        onPress={this.state.loading  ? null : this.login.bind(this)}
        //underlayColor="#99d9f4"
      >
      
      {
        this.state.loading ?  <ActivityIndicator size="large" color="#0000ff" /> 
                           :  <Text style={styles.buttonText}>Login</Text>
      }
      </TouchableOpacity>)

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
  loginUI = ()=>{
    return(<View
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor:backgroundColor
        }}
      >
        
        <ScrollView style={{ flex: 1,marginTop:40 }}>
          <KeyboardAvoidingView style={[{alignItems:"center"}]} behavior="padding">
            
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
            onChangeText={(text) => this.setState({userMobileInput: text})}             
            vehicleInputError =  {this.state.userMobileInput} 
            value = {this.state.userMobileInput}     
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
            onChangeText={(text) => this.setState({userPasswordInput: text})}             
            vehicleInputError =  {this.state.userPasswordInput} 
            value ={this.state.userPasswordInput}      
          />
            <View  style={{flex: 1, flexDirection: 'row'}} >
            {this.showLoader()} 
             
           
            <TouchableHighlight
              style={styles1.buttonStyle}
              onPress={() => {
              this.setState({isLoginUi:false})
                // const { navigate } = this.props.navigation;
                //navigate("Signup");                                             
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
      </View>)
  }
  render() {
    //console.log("login.js ",this.state.isLoginUi);
    if(this.state.isLoginUi){
      
      return this.loginUI();
    }
    if(!this.state.isLoginUi){
      return (<Register/>)
    }
    
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
