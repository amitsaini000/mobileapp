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
  DeviceEventEmitter 
} from "react-native";

import { GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { getUserChat, saveSendMsg, sendMsg, updateReceivedMsg } from "./data";
import NavBar from "./NavBar";
import CustomView from "./CustomView";
import { getUserStatus } from "../db/dbutil";
import HeaderComponent from "./HeaderComponent";

const styles = StyleSheet.create({
  container: { flex: 1 },
  sendButtonContainer: { color: "red" }
});

const filterBotMessages = message =>
  !message.system && message.user && message.user._id && message.user._id === 2;
const findStep = step => (_, index) => index === step - 1;
const backgroundColor = "#0067a7";
export default class UserNotification extends Component {
  constructor(props) {
    super(props);
    console.log(
      "UserNotification Conctructor :",
      this.props.navigation.state.params.senderInfo
    );
    this.state = {
      messages: [],
      step: 0,
      appIsReady: false,
      senderInfo: this.props.navigation.state.params.senderInfo,
      language: "ruby",
      isHidden: true,
      uid: null,
      headerTitle:""
    };

    this.onSend = this.onSend.bind(this);
    this.parsePatterns = this.parsePatterns.bind(this);
    this.setMsg = this.setMsg.bind(this);
    this.backPressSubscriptions = new Set()
  }

  static navigationOptions =({navigation}) =>  {
    return{
        headerTitle:navigation.state.params.senderInfo.name,
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
      },

    }
    
    // drawer: () => ({
    //   label: 'Login',
    //   icon: () =><Image  source={require("../../assets/home-icon.png")}
    //                 style={{ width: 26, height: 26, }}
    //             />
    // })
  }
  setMsg(msg) {
    console.log("user chat received");
    this.setState({ messages: msg, appIsReady: true });
    if(msg.length >0){
      this.setState({headerTitle:msg[0].user.name});
    }
    
    updateReceivedMsg(msg);
  }
  setUser = user => {
    console.log("setUser user Notification screen");

    if (user) {
      this.setState({ uid: user.uid });
      getUserChat(user.uid, this.state.senderInfo.senderId, this.setMsg);
      console.log("user chat request sent");
    }
  };

  componentWillUnmount() {}
  componentWillMount() {
    // init with only system messages
    //await Asset.fromModule(require('../../assets/avatar.png')).downloadAsync();
    DeviceEventEmitter.removeAllListeners('hardwareBackPress')
    this.backPressSubscriptions.clear();
    getUserStatus(this.setUser);
    //this.setState({ messages: messagesData.filter((message) => message.system), appIsReady: true });
  }
  componentDidMount() {
    //
    //console.log("componentDidMount update receive msg")
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
      const vehicleData = this.state.senderInfo;
      const step = this.state.step + 1;
      const msg = {
        senderUid: uid,
        receverId: vehicleData.senderId,
        text: this.state.language,
        token: vehicleData.token,
        name: vehicleData.name
      };
      // console.log("onsend  old mesg :::::::",this.state.messages);
      newMessage.push(saveSendMsg(msg));
      newMessage[0]["createdAt"] = new Date(
        parseInt(newMessage[0]["createdAt"])
      );

      // sendMsg(vehicleData.token,vehicleData.name,this.state.language);

      //this.state.messages.push(newMessage[0])
      this.setState(previousState => {
        // return {step: prevState.step + step};
        return {
          messages: GiftedChat.append(
            [{ ...newMessage[0], sent: true }],
            this.state.messages
          )
        };
      });
      console.log("onsend  added one mesg :::::::", newMessage);
      //   this.setState((previousState) => {
      //     return {
      //         messages: GiftedChat.append([{ ...newMessage[0], sent: true, received: true }], this.state.messages)
      //     };
      // });
      // this.botSend(step)
    } catch (e) {
      console.log(e);
    }
    // this.setState((previousState) => ({
    //   messages: GiftedChat.append(previousState.messages, [{ ...messages[0], sent: true, received: true }]),
    //   step,
    // }));
    // setTimeout(() => this.botSend(step), 1200 + Math.round(Math.random() * 1000));
  };

  botSend(step = 0) {
    // return;
    // getUserChat(this.state.uid,this.setMsg);
    //
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
        <Picker 
          selectedValue={this.state.language}
          style={[
            {
              height: 50,
              color: "#000000",
              borderBottomWidth: 1
            },
            this.state.isHidden ? { width: "100%" } : { width: "70%" }
          ]}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ language: itemValue, isHidden: false })
          }
        >
          <Picker.Item label="Please Select The Message" value="" />
          <Picker.Item label="JavaScript" value="js" />
          <Picker.Item label="C" value="c" />
          <Picker.Item label="C++" value="c++" />
          <Picker.Item label="Java" value="Java" />
        </Picker>

        <TouchableHighlight
          style={[
            this.state.isHidden ? { position: "absolute", bottom: -15000 } : {},
            {
              margin: 2,
              width: "30%",
              height: 40,
              backgroundColor: "darkviolet",
              padding: 10,
              alignItems: "center"
            }
          ]}
          onPress={this.onSend}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Reply</Text>
        </TouchableHighlight>
      </View>
    );
  }
  render() {
    //console.log(this.state.messages);
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
            messages={this.state.messages.reverse()}
            // onSend={this.onSend}
            renderCustomView={CustomView}
            //keyboardShouldPersistTaps="never"
            user={{ _id: this.state.uid }}
            //parsePatterns={this.parsePatterns}
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
