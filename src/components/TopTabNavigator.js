
import RegisterComponent from './Register';
import UserProfileComponent from './UserInfo';
import LoginComponent from './Login';
import LogoutComponent from './LogoutComponent';
import AuthComponent from './AuthComponent';
import {  createMaterialTopTabNavigator,createSwitchNavigator   } from 'react-navigation';

 const switchNavigator = createSwitchNavigator(
  {
     Login: LoginComponent,
     Auth: AuthComponent,
     Signup: RegisterComponent,
     //Logout: LogoutComponent,
  },
  {
    initialRouteName: 'Auth',
  }
);

const ProfileTabs = createMaterialTopTabNavigator (
    {
    //Logout: { screen: LogoutComponent},
    Profile:{ screen: UserProfileComponent},
    //Signup: { screen: RegisterComponent },
    //Login:  { screen: LoginComponent }    
    Account: switchNavigator
  },
  {
      tabBarOptions: {
      labelStyle: {
        fontSize: 15,
        marginTop:30
      },
      tabStyle: {
        
      },
      style: {
        height:80,
        marginTop:0,
        //width:window.width,
        backgroundColor:"#334146",
        borderBottomWidth:2,
        borderColor:"#334146"
        
      },
    }
  },
   {
    order: ["Profile",'Signup','Login'],    
    swipeEnabled: true,
    shifting: false,
    initialRouteName: 'Profile'
    
  }) 

export default TopTabNavigator = function(){
    return ProfileTabs;
}

