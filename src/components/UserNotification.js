import React, { Component } from "react";
import { Asset, AppLoading, Notifications } from "expo";

import {
  View,
  StyleSheet,
  Linking,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
  Picker,
  BackHandler,
  DeviceEventEmitter,
  ToolbarAndroid,
  Image,
  AppState 
  
} from "react-native";
import { Icon, Right } from 'native-base'
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { headerColor,backgroundColor,saveSendMsg,getUserChat, 
        sendMsg, updateReceivedMsg,handleRightElementPress,
        replayMessageTemplate,getUserInfo } from "./data";
import NavBar from "./NavBar";
import CustomView from "./CustomView";
import { getUserStatus } from "../db/dbutil";
import TextComponent from "./TextComponent";
import ModalDropdown from 'react-native-modal-dropdown';
import { Toolbar } from 'react-native-material-ui';
import commonStyle from './style';
import {LoginUI} from "./UI";

import {
  MenuContext,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,Renderers 
} from 'react-native-popup-menu';

import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import {watchConversion,updateChatListner} from "../reducers/userchat";

const filterBotMessages = message =>
  !message.system && message.user && message.user._id && message.user._id === 2;
const findStep = step => (_, index) => index === step - 1;

class UserNotification extends Component {
  constructor(props) {
    super(props);
   // console.log( "UserNotification Conctructor :",this.props.navigation.state.params.senderInfo);
    this.state = {
      messages: [],
      step: 0,
      appIsReady: false,
      senderInfo: this.props.navigation.state.params.senderInfo,
      language: "ruby",
      isHidden: true,
      headerTitle:"",

      uid:   props.person.uid,
      title: props.person.name, 
      token: props.person.token 
    };
    this.setUser(props);
    this.props.updateChatListner(props.person.uid);
    this.onSend = this.onSend.bind(this);
    this.parsePatterns = this.parsePatterns.bind(this);
    
    this.backPressSubscriptions = new Set()
  }
  _dropdown_2_renderButtonText(rowData) {
    console.log("rowdata:" ,rowData)
    const {name} = rowData;
    this.setState({ language: name , isHidden: false })
    return `${name}`;
  }
  
  _dropdown_2_renderRow(rowData, rowID, highlighted) {
    let icon =require('../../assets/avatar.png');
    let evenRow = rowID % 2;
    return (
      <TouchableHighlight underlayColor='cornflowerblue'>
        <View style={[commonStyle.dropdown_2_row, {backgroundColor: evenRow ? 'lemonchiffon' : 'white'}]}>
          <Image style={commonStyle.dropdown_2_image}
                 mode='stretch'
                 source={icon}
          />
          <Text style={[commonStyle.dropdown_2_row_text, highlighted && {color: 'mediumaquamarine'}]}>
            {`${rowData.name}`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
  
  _dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    if (rowID == replayMessageTemplate.length - 1) return;
    let key = `spr_${rowID}`;
    return (<View style={commonStyle.dropdown_2_separator}
                  key={key}
    />);
  }
  static rightElementPress = (label)=>{
    console.log("label");

  }
  
  static navigationOptions =({navigation}) =>  {
    return{
          headerTitle:<TextComponent text={navigation.state.params.senderInfo.name}/>,
          headerStyle: {
            backgroundColor: headerColor,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerRight:
        <Toolbar  style={{ container: { backgroundColor: headerColor } }}       
        rightElement={{
            menu: {
                icon: "more-vert",
                labels: ["Block", "Unblock"]
            }
        }}
        onRightElementPress={ (label) => { 
          //console.log(navigation.state.params);
          handleRightElementPress(label,navigation.state.params.uid,navigation.state.params.senderInfo.senderId);
        }}
      />
        

    }
    
    // drawer: () => ({
    //   label: 'Login',
    //   icon: () =><Image  source={require("../../assets/home-icon.png")}
    //                 style={{ width: 26, height: 26, }}
    //             />
    // })
  }
  setMsg =(msg) => {
    console.log("user chat received",msg);
    try {
      
      if(msg && msg.length >0){
       // console.log("state,",this.state);
        this.setState({messages: msg, appIsReady: true,headerTitle:msg[0].user.name });
        updateReceivedMsg(msg);
      }
      
    } catch (error) {
      console.log("setMsg Error------>",error)
    }    
  }
  setUser = async (props) => {
    console.log("setUser user Notification screen");

    if (props.person.name) {
     // this.setState({ uid: user.uid,title: user.name, token:user.token  });
       props.watchConversion(props.person.uid, this.state.senderInfo.senderId);
      // const chat = await getUserChat(user.uid, this.state.senderInfo.senderId);
      //this.setMsg(chat);
      this.props.navigation.setParams({uid: props.person.uid});
    }
  };

  handleNotification = ({ origin, data }) => {  
    console.log(
      `Push notification userNotification.js  ${origin} with data: ${JSON.stringify(
        data.senderInfo
      )}`
    );
    console.log("Push notification usernotification.js", AppState);
    //const { navigate } = this.props.navigation;
    const sendData = {
      senderId:data.senderInfo.senderId,
      receverId:data.senderInfo.receverId,
      name:data.senderInfo.name,
      senderToken:data.senderInfo.tokenSender
    }

    this.setState({senderInfo: sendData})
    //getUserChat(this.state.uid, sendData.senderId, this.setMsg);
    this.props.watchConversion(this.props.person.uid, sendData.senderId);
    console.log("handleNotification notification UseNotification.js", sendData);
    //navigate("UserNotification", { senderInfo: sendData });
  };

  componentWillUnmount() {
    this.NotificationSubscription && this.NotificationSubscription.remove();
    DeviceEventEmitter.removeAllListeners('hardwareBackPress')
    this.backPressSubscriptions.clear();
  }
  
   /*
   componentWillMount() {
    console.log("componentWillMount user Notification Home",this.props.person);
        if(this.props.person.name)
        {      
         this.setUser(this.props.person);
        }
        
   }  */

  static getDerivedStateFromProps(nextProps, state){
   // console.log("getDerivedStateFromProps--UserNotifi.js-<><><>><>><><>>>><><>");
     if(nextProps.updatedConversion && nextProps.updatedConversion.length){
      for(let i= nextProps.updatedConversion.length-1; i>=0 ;i--){
        for(let j= nextProps.conversion.length-1; j>=0 ;j--){
          if(nextProps.updatedConversion[i]._id == nextProps.conversion[j]._id){
          //  console.log("notification.js match data", nextProps.updatedConversion[i]);
            nextProps.conversion[j].text = nextProps.updatedConversion[i].text;
            nextProps.conversion[j].received = nextProps.updatedConversion[i].received;
            //console.log("notification.js match data", nextProps.conversion[j]);
            break;
          }
        }  
        
      }
      return {messages :nextProps.conversion}; 
    }
    if(nextProps.conversion && nextProps.conversion.length){
     // console.log("nextProps getDerivedStateFromProps--UserNotifi.js-<><><>><>><><>>>><><>");
     // state.messages = nextProps.conversion; 
      updateReceivedMsg(nextProps.conversion,nextProps.person.uid);      
      return {messages :nextProps.conversion}; 
     }
     return null;

}
  
  
  
  
  componentDidMount() {
    //
    console.log("componentDidMount usernotification.js")
    // updateReceivedMsg(this.state.messages);
    DeviceEventEmitter.removeAllListeners('hardwareBackPress')
    DeviceEventEmitter.addListener('hardwareBackPress', () => {
      let invokeDefault = true;
      const subscriptions = [];

      this.backPressSubscriptions.forEach(sub => subscriptions.push(sub))

      for (let i = 0; i < subscriptions.reverse().length; i += 1) {
        console.log(subscriptions[i]);
        if (subscriptions[i]()) {
          invokeDefault = false
          break
        }
      }
      if (invokeDefault) {
         //BackHandler.exitApp();        
      }
    })
       
    this.backPressSubscriptions.add(this.handleHardwareBack)
    this.NotificationSubscription = Notifications.addListener(this.handleNotification); 
  }
  handleHardwareBack  = () => {
    console.log("handle press",this.props.navigation);
    try{
      this.props.navigation.goBack();   
     //this.props.navigation.popToTop();    
  
  }
  catch(e){
      console.log("error",e);  
  
  }
  };
  onSend = () => {
    try {
      const newMessage = []; //this._form.getValue();
      const uid = this.state.uid;
      const token = this.state.token;
      const vehicleData = this.state.senderInfo;
      const step = this.state.step + 1;
      const msg = {
        senderUid: uid,
        receverId: vehicleData.senderId,
        text: this.state.language,
        token: vehicleData.senderToken,
        name: this.state.title,
        tokenSender: token
      };
      
      newMessage.push(saveSendMsg(msg));
      newMessage[0]["createdAt"] = new Date(
        parseInt(newMessage[0]["createdAt"])
      );

      sendMsg(vehicleData.senderToken,this.state.title,this.state.language,{
        senderId: uid, // to do check again
        receverId: vehicleData.senderId,
        tokenSender: token

      });
      
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages,  [{ ...newMessage[0], sent: true }]),
      }));
      
    } catch (e) {
      console.log(e);
    }
    
  };

  botSend(step = 0) {
    
    const newMessage = this.state.messages
      .reverse()
      .filter(filterBotMessages)
      .find(findStep(step));
    console.log(step, newMessage);
    if (newMessage) {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, newMessage)
      }));
    }
  }

  parsePatterns(linkStyle) {
    return [
      {
        pattern: /#(\w+)/,
        style: { ...linkStyle, color: "darkorange" }
        //onPress: () => Linking.openURL('http://gifted.chat'),
      }
    ];
  }
  renderInputToolbar(props) {
    //return <InputToolbar {...props} containerStyle={{borderTopWidth: 1.5, borderTopColor: '#333'}} />
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        
        <ModalDropdown ref="dropdown_2"
               
                style={[
                  commonStyle.dropdown_2,
                  {position: 'absolute'},
                  { flex:0.1},
                   {left: 2},
                  //{ right: 0},
                  {bottom: -50},
                  
                  //{backgroundColor:'green'},
                  {flexDirection:'row'},
                  {height:50},
                  {alignItems:'center'},
                  this.state.isHidden ? { width: "100%" } : { width: "65%" },
                  {borderWidth : 2},
                  {borderColor:"grey",}
                  
                ]}
                textStyle={[commonStyle.dropdown_2_text,{color:"black"}]}
                dropdownStyle={commonStyle.dropdown_2_dropdown}
                options={replayMessageTemplate}
                defaultValue={"Please Select The Message"}
                renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
                renderRow={this._dropdown_2_renderRow.bind(this)}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                
            />
        

        <TouchableHighlight
          style={[
            this.state.isHidden ? { position: "absolute", bottom: -15000 } : {},
            {
              marginTop: -5,
              width: "32%",
              height: 50,
              backgroundColor: "darkviolet",
              paddingBottom:10,
              alignItems: "center",
              right: 3,            
              position:"absolute",
              borderWidth:2,borderColor:"grey"
            }
          ]}
          onPress={this.onSend}
        >
          <Text style={{ color: "white", fontSize: 18,textAlign:"center",position:"relative",top:10 }}>Reply</Text>
        </TouchableHighlight>
      </View>
    );
  }
  render() {
    if(!this.props.person.name){
      return LoginUI(this.props);
     }
   // console.log("renser user notification--state----",this.state.messages);
    return (
      <View
        style={{
          flex: 1
          //backgroundColor: "#4c69a5",
          //alignItems: "stretch"
          //alignContent: "stretch"  <NavBar />
        }}
      >
       
        <View
          style={styles.container}
          accessible
          accessibilityLabel="main"
          testID="main"
        >
          <GiftedChat
            messages={this.state.messages || []}
            onSend={this.onSend}
            renderCustomView={CustomView}
            user={{ _id: this.props.person.uid.toString() }}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
          />
        </View>
        <KeyboardAvoidingView
          behavior={"padding"}
          keyboardVerticalOffset={20}
        />
        
      </View>
    );
  }
}


const mapStateToProps = (state) => {
  //console.log("mapStateToProps-UserNotification.js--",state)
  return {
      person: state.person,
      conversion:state.userchat.conversion,
      updatedConversion : state.userchat.updatedConversion

  }
}
const mapDispatchToProps = (dispatch) => {
  return {       
    watchConversion: (uid,senderId) => { dispatch(watchConversion(uid,senderId)) }, 
    updateChatListner:(uid,senderId)=>{dispatch(updateChatListner(uid,senderId))} 
         
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(withNavigation(UserNotification));


const styles = StyleSheet.create({
  container: { flex: 1 },
  sendButtonContainer: { color: "red" },
  menu_text: {
    marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 18,
    //color: 'white',
    //textAlign: 'center',
    textAlignVertical: 'center',
  },

  

});