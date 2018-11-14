
import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  Picker,
  TextInput,
  ScrollView,
  AppState
} from "react-native";
import {  Icon }   from 'native-base'
import { getUserInfo, getReceiverInfo, saveSendMsg, sendMsg,
         sendMessageTemplate,findFromArray,backgroundColor } from "./data";
import {  Login } from "../screens/screen";
import HeaderComponent from "./HeaderComponent";
import LoginCompenent from "./Login";

import { getUserStatus } from "../db/dbutil";
import { Expo, Notifications } from "expo";

import DropdownAlert from "react-native-dropdownalert";
import ModalDropdown from 'react-native-modal-dropdown';
import commonStyle from './style';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import Hideo  from './Hideo';
//import Person from '../Model/Person';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import {watchPersonData,updatePerson} from "../reducers/person";
import {  AppLoading } from "expo";
import {LoginUI} from "./UI";
const iconMessage = (<FontAwesomeIcon  size={25} name={'envelope'}  
               style={{color:"green",backgroundColor:"red",margin: 25}} 
               /> 
               );


 class HomeComponent extends Component {
  
  
  _dropdown_2_renderButtonText(rowData) {
    console.log("rowdata:" ,rowData)
    const {name} = rowData;
    this.setState({ language: name });
    return `${name}`;
  }
  
  _dropdown_2_renderRow(rowData, rowID, highlighted) {
    let evenRow = rowID % 2;
    return (
      <TouchableHighlight underlayColor='cornflowerblue'>
        <View style={[commonStyle.dropdown_2_row, {backgroundColor: evenRow ? 'lemonchiffon' : 'white'}]}>
          <FontAwesomeIcon  
          size={25} 
          name={'envelope'}  
          style={commonStyle.dropdown_2_image}
               />
               
          <Text style={[commonStyle.dropdown_2_row_text, highlighted && {color: 'mediumaquamarine'}]}>
            {`${rowData.name}`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
  
  _dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    if (rowID == sendMessageTemplate.length - 1) return;
    let key = `spr_${rowID}`;
    return (<View style={commonStyle.dropdown_2_separator}
                  key={key}
    />);
  }
  
  constructor(props) {
    super(props);
  
    this.state = {
      token: null,
      notification: null,
      body: "",
      title: props.person.name,
      formValue: {},
      uid: null,
      isSpinner: false,
      sentMsg: false,
      language: "",
      modalDropdownError :false,  
      appLoading:true,  
    };
    this.props.watchPersonData();  
    //console.log("Home init", this.state.personData);
    
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
   
  async componentDidMount() {
    console.log("componentDidMount--Hone.js------");
      //this.setState({appLoading:false});
      this.subscription = Notifications.addListener(this.handleNotification); 
   }
  
  static getDerivedStateFromProps(nextProps, state){
    console.log("getDerivedStateFromProps home.js---"); 
    if(nextProps.person && (nextProps.person.uid || nextProps.person.isUserLogin)){
      //console.log("getDerivedStateFromProps--Home.js-<><><>><>><><>>>><><>",nextProps.person);
      state.appLoading = false;
      return state;     
     }
     
     return null;

  }
   componentWillUnmount() {
    console.log("componentWillUnmount---Home.js-----");      
    this.subscription && this.subscription.remove();
  }
  

  handleNotification = ({ origin, data }) => {
    console.log(
      `Push notification ${origin} with data: ${JSON.stringify(
        data.senderInfo
      )}`
    );
    //console.log("Push notification Home.js", data.senderInfo);
    const { navigate } = this.props.navigation;
    const sendData = {
      senderId:data.senderInfo.senderId,
      receverId:data.senderInfo.receverId,
      name:data.senderInfo.name,
      senderToken:data.senderInfo.tokenSender
    }
    console.log("handleNotification notification Home.js", sendData);
    console.log("Push notification Home.js", AppState);
    navigate("UserNotification", { senderInfo: sendData });
  };
  
 
  sendPushNotification = async () => {
   
    try {
      let isError = false;
      const value = this.state.vehicleInput;
      if(!value ){
        this.setState({vehicleInput: true});
        isError = true;
      }
      if(!this.state.language){
         this.setState({modalDropdownError: true});
         isError = true;
      }
      else{
        this.setState({modalDropdownError: false});
      }
      if (!isError && value !== true) {
        this.setState({sentMsg:true});  
        const parseVehicleField  = value.replace(/[\. ,:-]+/g, "").toUpperCase();  
        const vehicleData = await getReceiverInfo(parseVehicleField);
        if (vehicleData && (vehicleData.error ||  ! vehicleData.token)) {
          vehicleData.error = vehicleData.token ? vehicleData.error : `You can't send Message to  ${parseVehicleField} Notification Permission is not Granted` ;
          this.onError(vehicleData.error);
          this.setState({ formValue: {} });
          this.setState({sentMsg:false});
          return;
        }
        const uid = this.props.person.uid;
        const tokenSender = this.props.person.token;
        let getBlockUser = await getUserInfo(vehicleData.uid);
        if(getBlockUser.blockuser && getBlockUser.blockuser.length >0){

          isUserBlock = findFromArray(getBlockUser.blockuser,uid);
        
          if(isUserBlock && isUserBlock.length >0){
            this.onError(`You are blocked by ${parseVehicleField} User You can't send the message`);
            this.setState({sentMsg:false});
            return;
          }
        }
        
        saveSendMsg({
          senderUid: uid,
          receverId: vehicleData.uid,
          text: this.state.language,
          token: vehicleData.token,
          name: this.props.person.name,
          tokenSender: tokenSender
        });
      let status = await sendMsg(vehicleData.token, this.props.person.name, this.state.language, {
          senderId:  uid,
          receverId: vehicleData.uid,
          tokenSender: tokenSender
        });
        if(status.ok){
          this.onSuccess('Message sent Successfully ');
          this.setState({sentMsg:false});          
        }
        else{
          this.onSuccess('OPPS Some Error Please try again');
          this.setState({sentMsg:false}); 

        }
      }
    } catch (e) {
      console.log(e);
      this.onError(e);
      this.setState({sentMsg:false});
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
  
  chatUi = ()=>{
   return( 
   <KeyboardAvoidingView style={[{alignItems:"center"}]} behavior="padding">
          <Hideo
            iconClass={FontAwesomeIcon}
            iconClass={MaterialsIcon}
            iconName={'directions-bus'} 
            iconColor={'white'}
            iconBackgroundColor={'#f2a59d'}
            
            style={[
              {borderWidth:2,borderColor:"grey"}
          ] }
            placeholder = "Enter Mobile Number"            
            onChangeText={(text) => this.setState({vehicleInput: text})}             
            vehicleInputError =  {this.state.vehicleInput}       
          />
         <ModalDropdown ref="dropdown_2"
                style={[ commonStyle.dropdown_2,
                         this.state.modalDropdownError ? { borderWidth: 2 } : {  borderWidth : 1,borderColor:"grey" }
                        ] 
                      }
                textStyle={commonStyle.dropdown_2_text}                
                dropdownStyle={commonStyle.dropdown_2_dropdown}
                options={sendMessageTemplate}
                defaultValue={"Please Select Message"}
                
                renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
                renderRow={this._dropdown_2_renderRow.bind(this)}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                
          >
          
          </ModalDropdown>
          <TouchableHighlight
            style={{
              marginTop: 20,
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
    </KeyboardAvoidingView>)
  }
  LoginUi = ()=>{
    return  LoginUI(this.props);
  }
  render() {
   // console.log("state home",this.state);
    if(this.state.appLoading){
      return( 
      <View 
        style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: backgroundColor,
        alignItems:"center",
        justifyContent:"center"  
      }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>)
    }
    
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: backgroundColor 
        }}
      >
        <HeaderComponent {...this.props} title={this.props.person.name} />
        
         <ScrollView 
         contentContainerStyle={{
           flexGrow : 1, 
          //justifyContent : 'center', 
         //alignItems:"flex-start",
          width:"90%",
         marginLeft:10,
         marginTop:50
        }}
         //style={{ flex: 1,marginTop:10,width:"92%" ,text,}
        
         >
          {this.props.person.name ? this.chatUi(): this.LoginUi()}
          
          </ScrollView>
          <KeyboardAvoidingView
            behavior={"padding"}
            keyboardVerticalOffset={50}
          />
        
        <DropdownAlert
          ref={ref => (this.dropdown = ref)}
          onClose={data => this.onClose(data)}
          closeInterval ={10000}
          //elevation={12} 
          startDelta ={0}
          endDelta = {78}
        />
      </View>
    );
  }
}



const mapStateToProps = (state) => {
  console.log("mapStateToProps-Home.js--",state)
  return {
      person: state.person
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
     
     watchPersonData: () => { dispatch(watchPersonData()) },
     updatePerson: () => { dispatch(updatePerson()) },
  };
}


export default connect(mapStateToProps,mapDispatchToProps)(withNavigation(HomeComponent));


