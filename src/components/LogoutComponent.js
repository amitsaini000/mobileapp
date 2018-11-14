
import React, { Component } from 'react';
import {
    Text, View, Image, TouchableHighlight
} from 'react-native';
import HeaderComponent from './HeaderComponent';
//import {signOut} from '../db/dbutil';
import DropdownAlert from "react-native-dropdownalert";
import { backgroundColor } from "./data";


import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import {signOutReducer} from "../reducers/person";

class LogoutComponent extends Component {

    constructor(){
        super();
        this.state={
            isLogout:false,
        }
        
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
    static navigationOptions = ({ navigation }) => {
        let drawerLabel = 'Logout';
        let drawerIcon = () => (
            <Image
                source={require('../../assets/settings-icon.png')}
                style={{ width: 26, height: 26, tintColor: backgroundColor }}
            />
        );
        return {drawerLabel, drawerIcon};
    }
    render() {
        return (<View style={{
            flex: 1,
            flexDirection: 'column',
        }}>  
           <HeaderComponent {...this.props} title={"Logout"} />    
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
        </View>);
    }
}


  const mapDispatchToProps = (dispatch) => {
    return { 
      signOut: () => { dispatch(signOutReducer()) },
    };
  }
  
  
  export default connect(null,mapDispatchToProps)(withNavigation(LogoutComponent));
  
  
  