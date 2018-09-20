import React from 'react';
import { AppRegistry, Dimensions,View,
  Text,
  StyleSheet,
  ScrollView,
  Image } from 'react-native';
import { createDrawerNavigator,DrawerItems,createStackNavigator,createBottomTabNavigator,createMaterialTopTabNavigator   } from 'react-navigation';
import { Container, Content, Icon, Header, Body,Root } 
  from 'native-base'
// import App from './App';
//Components
import HomeComponent from './src/components/Home';
import ProfileComponent from './src/components/Profile';
import RegisterComponent from './src/components/Register';
import LoginComponent from './src/components/Login';
import UserNotificationComponent from './src/components/UserNotification';
import NotificationHomeComponent from './src/components/NotificationHome';
import UserProfileComponent from './src/components/UserInfo';
import HeaderComponent from './src/components/HeaderComponent';
import LogoutComponent from './src/components/LogoutComponent';
import {getUserStatus} from './src/db/dbutil';


//Screen names
//import { Home, Login, Register, Profile,UserNotification,NotificationHome } from './src/screens/screen';
import { Font, AppLoading } from "expo";

//Screen size
var {height, width} = Dimensions.get('window');
/*
const CustomDrawerContentComponent = (props) => (

  <Container>
    <Header style={styles.drawerHeader}>
      <Body>
        <Image
          style={styles.drawerImage}
          source={require('./assets/home.png')} />
      </Body>
    </Header>
    <Content>
      <DrawerItems {...props} />
    </Content>

  </Container>

);
*/
//const MyApp = createDrawerNavigator(routeConfigs, drawerNavigatorConfig);

console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed','Setting a timer'];

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

const LoginStack = createStackNavigator(
  { 
     
    UserLogin: { screen: LoginComponent },
    Register: { screen: RegisterComponent },
  }, 
  {
    initialRouteName: 'UserLogin',
    //headerMode: 'none',
       
    /* The header config from HomeScreen is now here */
    /*navigationOptions: {
      headerTitle:<HeaderComponent/>,
      headerStyle: {
        backgroundColor: 'blue',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }*/
  });
  
  const ProfileTabs = createMaterialTopTabNavigator ({
    Login:  { screen: LoginComponent },
    Signup: { screen: RegisterComponent },
    //Logout: { screen: LogoutComponent},
    Profile:{ screen: UserProfileComponent}
  },{
      tabBarOptions: {
      labelStyle: {
        fontSize: 15,
        marginTop:30
      },
      tabStyle: {
        width: 100,
      },
      style: {
        height:80,
        
      },
    }
  },
   {
    order: ["Profile",'Signup','Login'],    
    swipeEnabled: true,
    shifting: true,
    initialRouteName: 'Profile'
    
  }) 
const MyApp = createDrawerNavigator({

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
    // Register: {
    //     screen: RegisterComponent,
    // }, 
    Profile: {
        screen: ProfileTabs,
        navigationOptions: {
          drawerLabel :"Profile", 
          drawerIcon :<Image  source={require("./assets/settings-icon.png")} style={{ width: 26, height: 26 }} />
      } 
    },
    UserNotification: {
      screen: UserNotificationComponent,
    },
          
    ReceivedMessages: {
    screen: ChatStack,
    navigationOptions: {
        drawerLabel :"Received Message", 
        drawerIcon :<Image  source={require("./assets/msg.jpg")} style={{ width: 26, height: 26 }} />
    } 
   }
    
},


  
{
    initialRouteName: "SendMessages",
    //backBehavior: 'none',
    drawerPosition: 'left',
  //  contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    contentOptions: {
        activeTintColor: 'red',
    },    
    order: ["SendMessages","ReceivedMessages","Profile","Logout"]
  });


  export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      loading: true,
      uid:null
      
    };
  }
  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }
  componentDidMount(){
    getUserStatus(this.checkLogin); 
  }
  checkLogin =async(user)=> {
    if (user) { 
      console.log(" app.js user:::",user.uid)      
      this.setState({ uid: user.uid });        
    }
}
  render() {
    if (this.state.loading) {
      return (
        <Root>
          <AppLoading />
        </Root>
      );
    }
    return (
        <MyApp />
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawerHeader: {
    height: 50,
    //backgroundColor: 'white'
  },
  drawerImage: {
    height: 26,
    width: 26,
    borderRadius: 75
  }

});