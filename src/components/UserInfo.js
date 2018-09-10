/*
Mr Nguyen Duc Hoang
https://www.youtube.com/c/nguyenduchoang
Email: sunlight4d@gmail.com
ProfileComponent 
*/
import React, { Component } from 'react';
import {
    Text, View, Image, TouchableHighlight,StyleSheet,KeyboardAvoidingView,ActivityIndicator
} from 'react-native';
import {Container,Content, Footer, Title, Button, Icon} from 'native-base';
import { Divider } from 'react-native-elements';
import { getUserStatus } from "../db/dbutil";
import { getUserInfo,UpdateUserNameVehicle, UpdateEmergencyNumber,UpdateVehicle } from './data';
import t from "tcomb-form-native"; // 0.6.11
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DropdownAlert from 'react-native-dropdownalert';

const Form = t.form.Form;
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
        color: "#000000",
        fontSize: 17,
        height: 36,
        padding: 10,
        // borderRadius: 4,
        borderColor: "#a94442", // <= relevant style here
        //borderWidth: 1,
        marginBottom: 5,
        width: 300,
        borderBottomWidth: 1,
        fontWeight: "bold"
      }
    }
  };
  const backgroundColor = "#0067a7";
  let options = {
    stylesheet: formStyles,
    order: [ "name", "vehicle"],
    fields: {
      name: {
        placeholder: "Name",
        auto: "none",
        returnKeyType: "next",
        autoCorrect: false,
        error: "Empty"
        // onSubmitEditing: {this.setFocus("otp")},
      },
      vehicle: {
        placeholder: "VECHILE",
        auto: "none",
        returnKeyType: "next",
        autoCorrect: false
      },
      vehicle1: {
        placeholder: "VECHILE",
        auto: "none",
        returnKeyType: "next",
        autoCorrect: false
      },
      vehicle2: {
        placeholder: "VECHILE",
        auto: "none",
        returnKeyType: "next",
        autoCorrect: false
      },
      mobile1: {
        placeholder: "mobile",
        auto: "none",
        returnKeyType: "next",
        autoCorrect: false
      },
      mobile2: {
        placeholder: "mobile",
        auto: "none",
        returnKeyType: "next",
        autoCorrect: false
      },
      mobile3: {
        placeholder: "mobile",
        auto: "none",
        returnKeyType: "next",
        autoCorrect: false
      }    
    }
  };
  
//import {editUser} from './EditUser';
export default class UserInfo extends Component {
    constructor(props) {
        super(props);
    
        this.state = {          
          uid: null,
          user:null,
          formValue:{},
          editUser:false,
          emergency:false,
          addVehicle:false,
          loading:false        
        };        
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
    checkLogin = async user => {
        console.log(" user Profile checkLogin:::");
        if (user) {
          this.setState({ uid: user.uid });
          let useerInfo = await getUserInfo(user.uid);
          this.setState({ user: useerInfo});
          
        } else {
          const { navigate } = this.props.navigation;
          navigate("Login");
        }
      };
      renderUser(){
        console.log(" user Profile :",this.state.user);   
        if(this.state.user){
            return(
                <Container style={{width:"100%",backgroundColor:backgroundColor,height:"50%",borderRadius: 5}}>                            

                <Content style={{}}>
                     <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                       <Image source={{ uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'}} style={styles.photo} />
                        <Text style={{  left: -45,
                                        fontSize: 15,
                                        fontWeight: 'bold',
                                        color:"white",
                                        padding:10}}>
                        {this.state.user.name}  {this.state.user.mobile} 
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between',margin:10 }}>
                        <Text style={{color:"white",fontWeight:"bold"}}>
                            Vehicle : {this.state.user.vehicle}  {this.state.user.vehicle1 || ""} {this.state.user.vehicle2 || ""}            
                        </Text>
                    </View> 
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between',margin:10 }}>
                    <Text style={{color:"white",fontWeight:"bold"}}>
                        Emergency Mobile : {this.state.user.mobile1}    {this.state.user.mobile2}              
                        </Text>
                    </View>    
                        
               
                
                        
                </Content> 
               
              </Container>
            );
        }   
          
      }
    updateUserNameAndVehicle = async ()=>{
        //this.setState({editUser:false});
        const value = this._form.getValue();
        console.log("value: ", value);  
        if (value) {
        this.setState({loading:true}) ;
        //this.setState({ mobile: value.mobile });
            var  dataObj = {
                name:value.name,
                vehicle:value.vehicle.replace(/[\. ,:-]+/g, "").toUpperCase(),
                oldName:this.state.user.name,
                oldVehicle : this.state.user.vehicle,
                token:this.state.user.token
            }
           console.log("dataObj: ", dataObj);
           console.log("uid current ",this.state.user.uid);       
           let status = await UpdateUserNameVehicle(this.state.user.uid, dataObj);
           console.log("status::",status);
            if(status.error){
                this.onError(status.error);
            }
            if(status.success){
                this.onSuccess(status.success);   
                this.setState({formValue:null});
                let useerInfo = await getUserInfo(this.state.user.uid);
                this.setState({ user: useerInfo,editUser:false});          
            }
            this.setState({loading:false}) ;
        }
    }
    updateEmergencyNumber = async()=>{
        const value = this._form.getValue();
        console.log("value: ", value);  
        if (value) {
        //this.setState({ mobile: value.mobile });
        this.setState({loading:true}) ;
            var  dataObj = {               
                mobile1:  value.mobile1,
                mobile2 : value.mobile2
            }
           console.log("dataObj: ", dataObj);        
           let status = await UpdateEmergencyNumber(this.state.user.uid, dataObj);
           console.log("status::",status);
            if(status.error){
                this.onError(status.error);
            }
            if(status.success){
                this.onSuccess(status.success);   
                this.setState({formValue:null});  
                let useerInfo = await getUserInfo(this.state.user.uid);
                this.setState({ user: useerInfo,emergency:false});        
            }
        }
        this.setState({loading:false}) ;

    }
    updateVehicle = async()=>{
        const value = this._form.getValue();
        console.log("value: ", value);          
        if (value) {
        //this.setState({ mobile: value.mobile });
        this.setState({loading:true}) ;
            var  dataObj = {               
                vehicle1:  value.vehicle1.replace(/[\. ,:-]+/g, "").toUpperCase(),
                vehicle2 : (value.vehicle2 ? value.vehicle2.replace(/[\. ,:-]+/g, "").toUpperCase() : null),
                token:this.state.user.token,
                name:this.state.user.name,
                oldVehicle1: this.state.user.vehicle1 || null,
                oldVehicle2: this.state.user.vehicle2 || null,

            }
           console.log("dataObj: ", dataObj);        
           let status = await UpdateVehicle(this.state.user.uid, dataObj);
           console.log("status::",status);
            if(status.error){
                this.onError(status.error);
            }
            if(status.success){
                this.onSuccess(status.success);   
                this.setState({formValue:null});
                let useerInfo = await getUserInfo(this.state.user.uid);
                this.setState({ user: useerInfo,addVehicle:false});        
            }
        }
        this.setState({loading:false});

    }
    updateCancel = ()=>{
        this.setState({editUser:false})
    }
    emergencyCancel = ()=>{
        this.setState({emergency:false})
    }
    addVehicleCancel = ()=>{
        this.setState({addVehicle:false})
    }
    editUserForm =()=>{
        let formValue1 ={
            name: this.state.user.name,
            vehicle:this.state.user.vehicle
        }
        let User = t.struct({
               name: t.String,
               vehicle: t.String,
               
           });
        options.order = [ "name", "vehicle"];
        //this.setState({formValue:formValue1})
        console.log("form value",this.state.formValue);
        return (<View style={{flex: 1,
            padding: 12,
            //flexDirection: 'row',
            alignItems: 'flex-start',
            //marginTop:10
            top:10
            }}>
           <Form
            ref={c => (this._form = c)}
            type={User}
            options={options}
            value={formValue1}
            //padding={50}                
           // onChange={formValue => this.setState({ formValue })}
        />
        <View style={{ flex: 1,
                       flexDirection: 'row'}}>
        <TouchableHighlight style={{ 
            margin: 20, 
            width: "30%", 
            height: 45,
            backgroundColor: 'darkviolet',
            padding: 10,
            alignItems: 'center',
         }}
         onPress={this.updateUserNameAndVehicle}
        >
        
        {this.state.loading? <ActivityIndicator  animating={true} size="large" color="#0000ff" />:<Text style={{color: 'white', fontSize: 18}}>Update  </Text>}
        </TouchableHighlight>
        <TouchableHighlight style={{ 
            margin: 20, 
            width: "30%", 
            height: 45,
            backgroundColor: 'darkviolet',
            padding: 10,
            alignItems: 'center',
         }}
         onPress={this.updateCancel}
        ><Text style={{color: 'white', fontSize: 18}}>Cancel </Text></TouchableHighlight>
        
        </View>
        
         </View>        
    )
    }
    addVehicleForm =()=>{
        let formValue1 ={
            vehicle1: this.state.user.vehicle1|| "",
            vehicle2: this.state.user.vehicle2 || "",
            
        }
        let User = t.struct({
               vehicle1: t.String,
               vehicle2: t.maybe(t.String),
           });
        options.order = [ "vehicle1", "vehicle2"];
        //this.setState({formValue:formValue1})
        console.log("form value",this.state.formValue);
        return (<View style={{flex: 1,
            padding: 12,
            //flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop:10}}>
           
           <Form
            ref={c => (this._form = c)}
            type={User}
            options={options}
            value={formValue1}
            padding={50}                
           // onChange={formValue => this.setState({ formValue })}
        />
        <View style={{ flex: 1,
                       flexDirection: 'row'}}>
        <TouchableHighlight style={{ 
            margin: 20, 
            width: "30%", 
            height: 45,
            backgroundColor: 'darkviolet',
            padding: 10,
            alignItems: 'center',
         }}
         onPress={this.updateVehicle}
        >
        {this.state.loading? <ActivityIndicator  animating={true} size="large" color="#0000ff" />:<Text style={{color: 'white', fontSize: 18}}>Add  </Text>}
        </TouchableHighlight>
        <TouchableHighlight style={{ 
            margin: 20, 
            width: "30%", 
            height: 45,
            backgroundColor: 'darkviolet',
            padding: 10,
            alignItems: 'center',
         }}
         onPress={this.addVehicleCancel}
        ><Text style={{color: 'white', fontSize: 18}}>Cancel </Text></TouchableHighlight>
        </View>
         </View>        
    )
    }
    emergencyForm=()=>{
        let formValue1 ={
            mobile1: this.state.user.mobile1 || "",
            mobile2: this.state.user.mobile2 || "",
            //mobile3: 9350268283//this.state.user.mobile3
        }
        let User = t.struct({
               mobile1: t.Number,
               mobile2: t.Number,
               //mobile3: t.Number,
             //password: t.String
           });
        options.order = [ "mobile1", "mobile2"];
        //this.setState({formValue:formValue1})
        console.log("form value",this.state.formValue);
        return (<View style={{flex: 1,
            padding: 12,
            //flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop:10}}>
           <Form
            ref={c => (this._form = c)}
            type={User}
            options={options}
            value={formValue1}
            padding={50}                
           // onChange={formValue => this.setState({ formValue })}
        />
        <View style={{ flex: 1,
                       flexDirection: 'row'}}>
        <TouchableHighlight style={{ 
            margin: 20, 
            width: "30%", 
            height: 45,
            backgroundColor: 'darkviolet',
            padding: 10,
            alignItems: 'center',
         }}
         onPress={this.updateEmergencyNumber}
        >
        {this.state.loading? <ActivityIndicator  animating={true} size="large" color="#0000ff" />:<Text style={{color: 'white', fontSize: 18}}>Add </Text>}
        </TouchableHighlight>
        <TouchableHighlight style={{ 
            margin: 20, 
            width: "30%", 
            height: 45,
            backgroundColor: 'darkviolet',
            padding: 10,
            alignItems: 'center',
         }}
         onPress={this.emergencyCancel}
        ><Text style={{color: 'white', fontSize: 18}}>Cancel </Text></TouchableHighlight>
        </View>
         </View>        
    )
    }
    renderEditUser(){
        console.log("renderEditUser :",this.state);  
        if(this.state.editUser){
           return this.editUserForm();
        }
        if(this.state.emergency){
            return this.emergencyForm();
        }
        if(this.state.addVehicle){
            return this.addVehicleForm();            
        }        
        return(<View></View>);
    }
    onSuccess = success => {
        if (success) {
          this.dropdown.alertWithType("success", "Success", success);          
        }
      };
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
    static navigationOptions = ({ navigation }) => {
        let drawerLabel = 'Profile';
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
        
        
        <KeyboardAwareScrollView
        style={{ backgroundColor: "#4c69a5" }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
        scrollEnabled={false}
        >    
            <View style={{
                flex: 1,
                backgroundColor: backgroundColor,
                alignItems: 'center',
                justifyContent: 'center'

            }}>
                {this.renderUser()}
                {this.renderEditUser()}
                
            </View>
            
            </KeyboardAwareScrollView>
            <KeyboardAvoidingView
            behavior={"padding"}
            keyboardVerticalOffset={50}
          />
            <Footer style={{}}>
                    

                    <Title style={{         margin: 13, 
                                            //width: "30%", 
                                            height: 55,
                                            fontSize:15,
                                            //backgroundColor: 'darkviolet',
                                            //padding: 10,
                                            alignItems: 'center',}} 
                                            onPress={() => {
                                                this.setState({editUser:true});
                                                this.setState({addVehicle:false});
                                                this.setState({emergency:false});
                                                //navigate(Home);                                             
                                            }}
                                            >
                        Edit |  
                        
                    </Title>
                    <Title style={{         margin: 13, 
                                            //width: "30%", 
                                            height: 55,
                                            fontSize:15,
                                            //backgroundColor: 'darkviolet',
                                            //padding: 10,
                                            alignItems: 'center',}} 
                                            onPress={() => {
                                                this.setState({editUser:false});
                                                this.setState({addVehicle:false});
                                                this.setState({emergency:true});
                                                //navigate(Home);                                             
                                            }}
                                            >
                        Add Emergency Number |
                    </Title>
                    <Title style={{         margin: 13, 
                                            //width: "30%", 
                                            height: 55,
                                            fontSize:15,
                                            //backgroundColor: 'darkviolet',
                                            //padding: 10,
                                            alignItems: 'center',}} 
                                            onPress={() => {
                                                this.setState({editUser:false});
                                                this.setState({addVehicle:true});
                                                this.setState({emergency:false});
                                                //navigate(Home);                                             
                                            }}
                                            >
                        Add Vehicle
                    </Title>

                    
                </Footer>
            <DropdownAlert ref={ref => this.dropdown = ref} onClose={data => this.onClose(data)} closeInterval ={10000}/> 
            
        </View>);
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop:10
    },
    text: {
      marginLeft: 20,
      fontSize: 15,
      fontWeight: 'bold',
      color:"white",
      padding:10
    },
    photo: {
      height: 60,
      width: 60,
      borderRadius: 20,
      margin:4
    },
  });