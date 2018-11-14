/* 
Mr Nguyen Duc Hoang
https://www.youtube.com/c/nguyenduchoang
Email: sunlight4d@gmail.com
ProfileComponent 
*/
import React, { Component } from 'react';import {
   
    TouchableHighlight,  
    KeyboardAvoidingView,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    View,
   
    Text,
    StyleSheet
  } from "react-native";
  import commonStyle from './style';  
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import MaterialsIcon from "react-native-vector-icons/MaterialIcons";
  import Hideo from "./Hideo";
  import {
    backgroundColor,
    getUserInfo,UpdateUserNameVehicle
  } from "./data";

//export const IMAGE_HEIGHT = window.width / 4;  </Right>
class EmergencyForm extends Component {
    constructor(props){
     super(props);
     
    this.state = {     
      ...props.user    
    };
    console.log("edit EmergencyForm new  prop:",this.state);
    }

    componentWillReceiveProps(newProps) {
        console.log("edit EmergencyFormnew  userprops:",newProps);
        this.setState({...newProps.user})
    }
    updateEmergencyNumber =()=>{

        this.props.updateEmergencyNumber({mobile1:this.state.mobile1,mobile2:this.state.mobile2})
     }
     cancel =()=>{
      this.setState({ loading: false }); 
      this.props.cancel();
    } 
    
    render() {
        return (
            <View
             style={{
              //flex: 1,
              //padding: 12,
              //flexDirection: 'row',
              //alignItems: "flex-start",
              marginTop: 4,        
              height:200
            }}
          >  
          <View  style={commonStyle.hideo_view}>
            <Hideo
              style={{ width: "94%" }}
              iconClass={FontAwesomeIcon}
              //iconClass={MaterialsIcon}
              //iconName={'directions-bus'} //class not need
              iconName={"phone"}
              iconColor={"white"}
              // this is used as backgroundColor of icon container view.
              iconBackgroundColor={"#f2a59d"}
              keyboardType="numeric"
              placeholder="Emergency Contact"
              onChangeText={text => this.setState({ mobile1: text })}
              vehicleInputError={this.state.mobile1Error}
              defaultValue={`${this.state.user.mobile1 || ""}`}
              maxLength={10}
            />
            </View>
            <View  style={commonStyle.hideo_view}>
            <Hideo
              style={{ width: "94%" }}
              iconClass={FontAwesomeIcon}
              //iconClass={MaterialsIcon}
              //iconName={'directions-bus'} //class not need
              iconName={"phone"}
              iconColor={"white"}
              // this is used as backgroundColor of icon container view.
              iconBackgroundColor={"#f2a59d"}
              keyboardType="numeric"
              placeholder="Emergency Contact"
              onChangeText={text => this.setState({ mobile2: text })}
              vehicleInputError={this.state.mobile2Error}
              defaultValue={`${this.state.user.mobile2 || ""}`}
              maxLength={10}
            />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row"
              }}
            >
              <TouchableHighlight
                style={{
                  margin: 20,
                  width: "30%",
                  height: 45,
                  backgroundColor: "darkviolet",
                  padding: 10,
                  alignItems: "center"
                }}
                onPress={this.updateEmergencyNumber}
              >
                {this.state.loading ? (
                  <ActivityIndicator
                    animating={true}
                    size="large"
                    color="#0000ff"
                  />
                ) : (
                  <Text style={{ color: "white", fontSize: 18 }}>Add </Text>
                )}
              </TouchableHighlight>
              <TouchableHighlight
                style={{
                  margin: 20,
                  width: "30%",
                  height: 45,
                  backgroundColor: "darkviolet",
                  padding: 10,
                  alignItems: "center"
                }}
                onPress={this.cancel}
              >
                <Text style={{ color: "white", fontSize: 18 }}>Cancel </Text>
              </TouchableHighlight>
            </View>
          </View>
        
        );
    }
}
  
export default EmergencyForm