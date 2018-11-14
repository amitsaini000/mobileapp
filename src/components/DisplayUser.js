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
    Image,
    Text,
    StyleSheet
  } from "react-native";
  import { Container, Content, Footer, Title, Button, Icon } from "native-base";
  import {
    backgroundColor,
    deleteFiled
  } from "./data";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
const icondelete = (<FontAwesomeIcon  size={15} name={'trash'}  
                     style={{color:"red",marginTop: -10,marginLeft:15,paddingLeft:20}} 
               /> 
               );

const iconVehicle = (<FontAwesomeIcon  size={25} name={'car'}  
style={{color:"black",marginLeft:7,marginTop:-10}} 
/> 
);               

const iconEmergency = (<FontAwesomeIcon  size={25} name={'medkit'}  
style={{color:"black",marginLeft:7}} 
/> 
);
//export const IMAGE_HEIGHT = window.width / 4;  </Right>
class DisplayUser extends Component {
  
  constructor(props){
    super(props);
    
    this.state = { 
         user:{...this.props.parentState}   
     
    };
    
    console.log("DisplayUser  prop:",props.parentState);
   }
    componentWillReceiveProps(newProps) {
        
        console.log("display new  userprops --->:",newProps.parentState);        
        if(newProps.parentState){
          this.props = newProps.parentState ;
          this.setState({user:this.props})       
        }
        //this.setState({user:newProps.parentState.user});
    }
    deleteFileds = (num, field) => {        
      this.props.deleteFileds(num,field);
    };
    render() {
      //  if(this.props.parentState){
      //    this.setState({user:this.props.parentState})
      //  }
        return (
          <View style={styles.container}>
          <View style={styles.profile}> 
          <View style={styles.photo}>
          <Image style={{color:"black",fontWeight: 'bold'}}
                source={{
                  uri:
                    "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                }}
                style={styles.photo}
              />
          </View>
          <View style={styles.profileText}>
          <Text style={styles.text}>{this.state.user.name}</Text>
          <Text style={styles.text}> {this.state.user.mobile}</Text>
          <Text style={styles.text}>{this.state.user.vehicle} </Text>
          
          <Text style={styles.text}>{ iconEmergency}  {this.state.user.mobile1 || ""}  {this.state.user.mobile2 || ""}</Text>
          <Text style={styles.text}>{iconVehicle}   { this.state.user.vehicle1 || ""}  {this.state.user.vehicle2 || ""}</Text>
          </View>
          
          
          </View>
            
          </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 2,
      width:"100%",
     // backgroundColor:"red",
     
    },
    profile:{
      flex:1,
      flexDirection:"row",
      flexWrap:"wrap",
     // backgroundColor:"blue"
    },
    profileText:{
      flex:1,
      alignContent:"flex-start",
     // backgroundColor:"green",
      flexWrap:"wrap",
    },
    text: {
      //marginLeft:5,
      fontSize: 12,
      fontWeight: "bold",
      color: "black",
      padding: 5
    },
    photo: {
      height: 60,
      width: 60,
      borderRadius: 50,
      margin: 4
    },
    textColor:{
      color:"black",
      fontWeight:"bold"
    }
  });
  
export default DisplayUser