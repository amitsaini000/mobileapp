import React, {Component} from 'react';
import { createDrawerNavigator,DrawerItems,createStackNavigator,
    createMaterialTopTabNavigator   } from 'react-navigation';


import {Image } from 'react-native';
import { Icon } from 'native-base' 
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';

import HomeComponent from './Home';

import LogoutComponent from './LogoutComponent';

import UserNotificationComponent from './UserNotification';
import TopTabNavigatorComponent from './TopTabNavigator';
import NotificationHomeComponent from './NotificationHome';
import DrawerContentComponent from './CustomDrawerContentComponent';



const iconMessage = (<FontAwesomeIcon  size={25} name={'envelope'}  
               style={{color:"black"}} 
               /> 
               );

const ChatStack = createStackNavigator({ 
    // Home: { 
    //   screen: Purgatory,
    //   headerMode: 'none',
    //   header: null,
    //   navigationOptions: {
    //       header: null
    //   }    
    // },
    ChatHome: NotificationHomeComponent, 
    UserNotification: UserNotificationComponent 
  },
  {
     //headerMode: 'none',
     initialRouteName: 'ChatHome',
    //navigationOptions: {}
  });
const ProfileTabs = TopTabNavigatorComponent();
const drawerNavigator = createDrawerNavigator(
{

    // For each screen that you can navigate to, create a new entry like this:
    SendMessages: {
          screen: HomeComponent
      },
      Logout: {
          screen: LogoutComponent,
          navigationOptions: {
            drawerLabel :"Logout", 
            drawerIcon :<Icon  name="log-out" />
        } 
      },
       
      Profile: {
          screen: ProfileTabs,
          navigationOptions: {
            drawerLabel :"Profile", 
            drawerIcon :<Icon  name="settings"  />
        } 
      },
      
      UserNotification: {
        screen: UserNotificationComponent,
      },
            
      ReceivedMessages: {
      screen: ChatStack,
      navigationOptions: {
          drawerLabel :"Received Message", 
          drawerIcon :iconMessage
      } 
     }
      
},  
    
   {
      initialRouteName: "SendMessages",
      //backBehavior: 'none',
      drawerPosition: 'left',
     // contentComponent: customDrawerContentComponent,
      contentComponent: props => <DrawerContentComponent {...props}  
                                   mobile={"this.state.user.mobile"}  
                                   name={"this.state.user.name"}   />,
      
      drawerOpenRoute: 'DrawerOpen',
      drawerCloseRoute: 'DrawerClose',
      drawerToggleRoute: 'DrawerToggle',
      contentOptions: {
          activeTintColor: 'red',
      },    
      order: ["SendMessages","ReceivedMessages","Profile","Logout"]
    });

 export default DrawerNavigatorComponent = function(){

    return drawerNavigator;
}
/*
export default class DrawerNavigatorComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          user:{
            name:"",
            mobile:""
          }
          
        };
      }
    render() {
      return (
        drawerNavigator
      );
    }
}*/


/* 
title

header

headerTitle

headerBackTitle

headerTruncatedBackTitle

headerRight

headerLeft

headerStyle

headerTitleStyle

headerBackTitleStyle

headerTintColor

headerPressColorAndroid

gesturesEnabled

*/

