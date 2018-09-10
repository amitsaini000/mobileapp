
import React, { Component } from 'react';
import { Asset, AppLoading } from 'expo';
import { View, StyleSheet, Linking, Text, KeyboardAvoidingView, ScrollView,Image } from 'react-native';
import { getAllChats } from './data';
import { getUserStatus } from "../db/dbutil";
import { List, ListItem } from 'react-native-elements';
import HeaderComponent from "./HeaderComponent";
import { UserNotification } from "../screens/screen";
import { StackNavigator } from 'react-navigation';

//import { ScrollView } from 'react-native-keyboard-aware-scroll-view'
const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: {
        //paddingVertical: 20 
    }
});
const backgroundColor = "#0067a7";
export default class NotificationHome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            list:[]
        }
        this.showConverssion = this.showConverssion.bind(this)
    }
    setList =(dataObj)=>{
        console.log("msggggggg: ",dataObj)
        this.setState({ list: dataObj, appIsReady: true }); 
      }
      setUser=(user)=>{ 
        console.log("setUser Notification Home",user.uid);
        if(user){
            this.setState({ uid: user.uid });
            getAllChats(user.uid,this.setList);            
        }
        else{
            const { navigate } = this.props.navigation;
                   navigate("Login");
        }
      }
    async componentWillMount() {
        console.log("componentWillMount user Notification Home") 
        getUserStatus(this.setUser);
    }
    showConverssion(data){ 
        try{
            console.log("showConverssion key",data);
            for(k in this.state.list){
               if(this.state.list[k].unreadMsg == data.unreadMsg && this.state.list[k].senderId == data.senderId ){
                this.state.list[k].unreadMsg = 0;

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
        <Image
            source={require("../../assets/home-icon.png")}
            style={{ width: 26, height: 26, tintColor: backgroundColor }}
        />
        );
        return {  drawerLabel 
                , drawerIcon,header
               };
    };
    render() {
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
                        alignContent: "stretch"
                    }}
                >
                    <ScrollView contentContainerStyle={styles.contentContainer}>

                        <List containerStyle={{ marginBottom: 20 }}>
                            {                                
                                this.state.list.map((l,i) => (
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

