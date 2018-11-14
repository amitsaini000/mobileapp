import React, { Component } from 'react';
import { View, StyleSheet,  ScrollView,Image } from 'react-native';
import { getAllChats } from './data';
import { getUserStatus } from "../db/dbutil";
import { List, ListItem } from 'react-native-elements';
import HeaderComponent from "./HeaderComponent";

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';

import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: {
        //paddingVertical: 20 
    }
});
import { backgroundColor } from "./data";
import {LoginUI} from "./UI";

import {watchUserChat} from "../reducers/userchat";
class NotificationHome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            list:props.userchat||[],
            uid :props.person.uid
        }
       // props.list= []
       this.setUser();         
        this.showConverssion = this.showConverssion.bind(this)
    }
    setUser=()=>{
        const user = this.props.person 
        //console.log("setUser Notification Home :",user);
        console.log("setUser Notification Home :",user.uid);
        if(user.name){           
           
            //getAllChats(user.uid,this.setList);
           // this.setState({ uid: user.uid });
            this.props.watchUserChat(user.uid);              
        }
        else{
            const { navigate } = this.props.navigation;
                   navigate("Login"); 
        }
      }

     static getDerivedStateFromProps(nextProps, state){
        console.log("getDerivedStateFromProps--Notifi.js-<><><>><>><><>>>><><>",nextProps.list);
        if(nextProps.list && nextProps.list.length){
          //console.log("getDerivedStateFromProps--Notifi.js-<><><>><>><><>>>><><>");
          //state.list = nextProps.chat;
          return {list:nextProps.list};     
         }
         return null;
    
    }
     /*  setList =(dataObj)=>{
       // console.log("msggggggg: ",dataObj)
        this.setState({ list: dataObj, appIsReady: true }); 
      }
      
        async componentWillMount() {
        console.log("componentWillMount user Notification Home",this.props.person);
        if(this.props.person.name)
        {      
         this.setUser(this.props.person);
        }
        if(!this._isMounted ){
            this._isMounted = true; 
            //getUserStatus(this.setUser);      
          }
        
    }
    */
    componentWillUnmount(){
        this._isMounted = false; 
    }
    async componentDidUpdate(prevProps) {
         console.log("componentDidUpdate user Notification Home") 
      // getUserStatus(this.setUser);   
               
  }

    showConverssion(data){ 
        try{
            console.log("showConverssion key",data);
            for(k in this.props.list){
               if(this.props.list[k].unreadMsg == data.unreadMsg && this.props.list[k].senderId == data.senderId ){
                this.props.list[k].unreadMsg = 0;

               }
            }
            const { navigate } = this.props.navigation;
            navigate("UserNotification",{senderInfo:data});
        
        }
        catch(e){
            console.log("showConverssion key",e);  
        
        }
        //console.log("showConverssion key",obj); 
        
                       
    }
    static navigationOptions = ({ navigation }) => {
        let header= null;
        header:null;
        let drawerLabel = "Received Message";
        let drawerIcon = () => (
             <FontAwesomeIcon  size={25} name={'envelope-o'}  
             style={{ width: 26, height: 26, tintColor: backgroundColor }}
            />
        );
        return {  drawerLabel 
                , drawerIcon,header
               };
    };
    render() {
        if(!this.props.person.name){
         return LoginUI(this.props);
        }
        //console.log(this.state.messages);
        return (
            <View
                style={{
                    flex: 1,
                    //backgroundColor: "#4c69a5",
                    //alignItems: "stretch"
                    //alignContent: "stretch"
                }}
            >
                <HeaderComponent {...this.props} title="Notification" />
                <View
                    style={{
                        flex: 1,
                        //backgroundColor: "#4c69a5",
                        //alignItems: "stretch"  9582645795
                        alignContent: "flex-start"
                    }}
                >
                    <ScrollView contentContainerStyle={styles.contentContainer}>

                        <List containerStyle={{ marginBottom: 20 }}>
                            {                                
                                this.props.list.map((l,i) => (
                                    <ListItem
                                        roundAvatar
                                        avatar={{ uri: l.avatar_url }}
                                        key={i}
                                        title={l.name} 
                                        badge={{ value: l.unreadMsg, textStyle: { color: 'orange' }, 
                                        containerStyle: {top: (l.unreadMsg > 0 ? -15 : -15000 ),position:"absolute",left:-30}  
                                      }}                                        
                                      // rightTitle={"hello right"}
                                       button 
                                    
                                    onPress={this.showConverssion.bind(this,l)} 
                                    />
                                ))
                            }
                        </List>
                    </ScrollView >
                </View></View>
        );
    }

}


const mapStateToProps = (state) => {
    console.log("mapStateToProps-NotificationHome.js--");
    return {
        person:state.person,
        list:state.userchat.chats,
    }
  }
  const mapDispatchToProps = (dispatch) => {
    return {       
       watchUserChat: (uid) => { dispatch(watchUserChat(uid)) },       
    };
  }
  
 
  
  
  export default connect(mapStateToProps,mapDispatchToProps)(withNavigation(NotificationHome));
  
  
  