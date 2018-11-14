import React, { Component } from 'react'

import {   Text, View, Image, TouchableHighlight } from "react-native";
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import {watchPersonData,updatePerson} from "../reducers/person";
import LoginComponent from './Login';
import LogoutComponent from './LogoutComponent';
import Register from "./Register";
import {signOutReducer} from "../reducers/person";
import DropdownAlert from "react-native-dropdownalert";
import { backgroundColor } from "./data";
class AuthComponent extends Component {
    
    state ={
        isLogout:false,
    }
    signOut = ()=>{
        this.props.signOut();
        this.onError("Logout Successfully")
        //signOut();
    }
    onError = error => {
        if (error) {
          this.dropdown.alertWithType("success", "Success", error);
          this.setState({isLogout:true});
        }
      };
    logoutView = ()=>{
        return (<View style={{
            flex: 1,
            flexDirection: 'column',
        }}>  
            <View style={{
                flex: 1,
                backgroundColor: backgroundColor,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
               
                <TouchableHighlight style={[{ 
                                            margin: 20, 
                                            width: 200, 
                                            height: 45,
                                            backgroundColor: 'darkviolet',
                                            padding: 10,
                                            alignItems: 'center',
                                            
                                         },{position: this.state.isLogout ?"absolute":"relative",top: this.state.isLogout ? -15000: null}]}
                    onPress={() => {
                        this.signOut();                                                                    
                    }}
                >
                <Text style={{color: 'white', fontSize: 18}}>LogOut</Text>
                </TouchableHighlight>
                <TouchableHighlight style={[{ 
                                            margin: 20, 
                                            width: 200, 
                                            height: 45,
                                            backgroundColor: 'darkviolet',
                                            padding: 10,
                                            alignItems: 'center',
                                            
                                         },{position: this.state.isLogout ?"relative":"absolute",top: this.state.isLogout ? null: -15000}]}
                    onPress={() => {
                        const { navigate } = this.props.navigation;
                        navigate("Login");                                             
                    }}>
                    <Text style={{color: 'white', fontSize: 18}}>Login</Text>
                </TouchableHighlight>
            </View>
            <DropdownAlert
                ref={ref => (this.dropdown = ref)}
                //onClose={data => this.onClose(data)}
                closeInterval ={10000}
            />
        </View>)
    }
    static getDerivedStateFromProps(nextProps, state){
        console.log("getDerivedStateFromProps AuthComponent.js---");
        if(nextProps.person && nextProps.person.uid){
          console.log("getDerivedStateFromProps--AuthComponent.js-<><><>><>><><>>>><><>",nextProps.person);
          return state;     
         }
         return null;
    
      }
      
      
    render() {  
        
        if(this.props.person.name){
            return this.logoutView()
        }
        else{
            return <LoginComponent/>
        }    
  }
}

const mapStateToProps = (state) => {
    console.log("mapStateToProps-AuthComponent.js--",state)
    return {
        person: state.person
    }
  }
  const mapDispatchToProps = (dispatch) => {
    return {       
       //watchPersonData: () => { dispatch(watchPersonData()) },
       //updatePerson: () => { dispatch(updatePerson()) }, 
       signOut: () => { dispatch(signOutReducer()) },     
    };
  }
  
  
  export default connect(mapStateToProps,mapDispatchToProps)(withNavigation(AuthComponent));
  