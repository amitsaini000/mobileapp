/*
Mr Nguyen Duc Hoang
https://www.youtube.com/c/nguyenduchoang
Email: sunlight4d@gmail.com
ProfileComponent 
*/
import React, { Component } from "react";
import {
  Text,
  View,
  Image,  
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator
} from "react-native";

import { getUserStatus } from "../db/dbutil";
import {
  getUserInfo,
  UpdateUserNameVehicle,
  UpdateEmergencyNumber,
  UpdateVehicle,
  deleteFiled
} from "./data";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DropdownAlert from "react-native-dropdownalert";
import BottomNavigation, {
  FullTab
} from "react-native-material-bottom-navigation";

import { Login } from "../screens/screen";
import DisplayUser from "./DisplayUser";
import EditUserForm from "./EditUserForm";
import EmergencyForm from "./EmergencyForm";
import AddMoreVehicle from "./AddMoreVehicle";
import LoginCompenent from "./Login";
import { backgroundColor,headerColor } from "./data";

import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import {watchPersonData} from "../reducers/person";

import { Icon } from "react-native-vector-icons/FontAwesome";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';

const barColor = headerColor;
const iconMessage = (<FontAwesomeIcon  size={25} name={'ambulance'}  
               style={{color:"green",backgroundColor:"red",margin: 25}} 
               /> 
               );
//import {editUser} from './EditUser';
class UserInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editUser: false,
      emergency: false,
      addVehicle: false,
      loading: false,      
      uid: null,
      user: null,
      formValue: {},
      vehicle: "",
      vehicle1: "",
      vehicle2: "",
      mobile1: 0,
      mobile2: 0,
      name: "",
      mobile: 0,
      appLoading:true
    };   

  }

  deleteFileds = (num, field) => {
    if (num == "" || !num) {
      return;
    }
    console.log("delet", num);
    Alert.alert(
      " Delete Action",
      `Are You Want  to delete this ${num}  `,
      [
        //{text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            deleteFiled(this.props.person.uid, num, field);
            const updatedOne = { ...this.props.person };
            updatedOne[field] = "";
            this.setState({ user: updatedOne });
          }
        }
      ],
      { cancelable: false }
    );
  };
  tabs = [
    {
      key: "editUser",
      icon: "user",
      label: "Edit",
      barColor: barColor,
      pressColor: "rgba(255, 255, 255, 0.16)"
    },
    {
      key: "emergency",
      icon: "ambulance",
      label: "Emergency Number",
      barColor: barColor,
      pressColor: "rgba(255, 255, 255, 0.16)"
    },
    {
      key: "addVehicle",
      icon: "car",
      label: "Add",
      barColor: barColor,
      pressColor: "rgba(255, 255, 255, 0.16)"
    }
  ];
  renderIcon = icon => ({ isActive }) => <FontAwesomeIcon size={isActive ? 30 : 27}  
                                          name={icon}  
                                          color={ isActive ?"white":"grey"} />;
 
  renderTab = ({ tab, isActive }) => (
    <FullTab
      isActive={isActive}
      key={tab.key}
      label={tab.label}
      barColor={"red"}
      renderIcon={this.renderIcon(tab.icon)}
    />
  );
  static getDerivedStateFromProps(nextProps, state){
    console.log("getDerivedStateFromProps userInfo.js---");
    if(nextProps.person){
      console.log("getDerivedStateFromProps---<><><>><>><><>>>><><>",nextProps.person);
      //this.props.person = nextProps.person
      //this.setState({...nextProps.person})
      state = {
       name :nextProps.person.name,
       mobile :nextProps.person.mobile || 0,
       mobile1 :nextProps.person.mobile1 || 0,
       mobile2 :nextProps.person.mobile2 || 0,
       vehicle :nextProps.person.vehicle,
       vehicle1 :nextProps.person.vehicle1 || "",
       vehicle2 :nextProps.person.vehicle2 || "",
       uid :nextProps.person.uid,
       user:nextProps.person,
       appLoading:false
     };
     return state;
      
     }
     return null;
  }
  componentDidUpdate(nextProps) {
    console.log("componentDidUpdate userInfo.js---");    
 }
  componentDidMount() {
    this._isMounted = true;    
  }
  componentWillUnmount() {
   // console.log(" userInfo getUser willmount:::");
    this._isMounted = false;
  }
  /*
  componentWillReceiveProps(nextProps){
      if(nextProps.person){
       console.log("componentWillReceiveProps---<><><>><>><><>>>><><>",nextProps.person);
       this.props.person = nextProps.person
       //this.setState({...nextProps.person})
       this.setState ( {
        name :nextProps.person.name,
        mobile :nextProps.person.mobile || 0,
        mobile1 :nextProps.person.mobile1 || 0,
        mobile2 :nextProps.person.mobile2 || 0,
        vehicle :nextProps.person.vehicle,
        vehicle1 :nextProps.person.vehicle1 || "",
        vehicle2 :nextProps.person.vehicle2 || "",
        uid :nextProps.person.uid,
        user:nextProps.person
      })
       
      }    
        
  }*/
  
 
  updateUserNameAndVehicle = async formValue => {
    //this.setState({editUser:false});
    let isError = false;
    const { name, vehicle } = formValue;

    if (!name) {
      this.setState({ nameError: true });
      isError = true;
    }

    if (!vehicle) {
      this.setState({ vehicleError: true });
      isError = true;
    }

     console.log("name:", formValue);

    if (
      !isError &&
      this.state.nameError !== true &&
      this.state.vehicleError !== true
    ) {
      console.log("name in:", name);
      console.log("vehicle inside:", vehicle);
      this.setState({ loading: true });
      //this.setState({ mobile: value.mobile });
      var dataObj = {
        name: name,
        vehicle: vehicle.replace(/[\. ,:-]+/g, "").toUpperCase(),
        oldName: this.props.person.name,
        oldVehicle: this.props.person.vehicle,
        token: this.props.person.token
      };
      console.log("dataObj: ", dataObj);
      console.log("uid current ", this.props.person.uid);
      let status = await UpdateUserNameVehicle(this.props.person.uid, dataObj);
      console.log("status::", status);
      if (status.error) {
        this.onError(status.error);
      }
      if (status.success) {
        this.onSuccess(status.success);
        this.setState({
          name: this.props.person.name,
          vehicle: this.props.person.vehicle
        });
        let useerInfo = await getUserInfo(this.props.person.uid);
        this.setState({ user: useerInfo, editUser: false });
      }
      this.setState({ loading: false });
    }
  };
  updateEmergencyNumber = async formValue => {
    const value = {
      mobile1: formValue.mobile1,
      mobile2: formValue.mobile2
    };
    console.log("value: ", value);
    if (value.mobile1 || value.mobile2) {
      //this.setState({ mobile: value.mobile });
      this.setState({ loading: true });
      var dataObj = {
        mobile1: value.mobile1,
        mobile2: value.mobile2
      };
      console.log("dataObj: ", dataObj);
      let status = await UpdateEmergencyNumber(this.props.person.uid, dataObj);
      console.log("status::", status);
      if (status.error) {
        this.onError(status.error);
      }
      if (status.success) {
        this.onSuccess(status.success);
        let useerInfo = await getUserInfo(this.props.person.uid);
        this.setState({ user: useerInfo, emergency: false });
        this.setState({
          mobile1: useerInfo.mobile1,
          mobile2: useerInfo.mobile2
        });
      }
    }
    this.setState({ loading: false });
  };
  updateVehicle = async value => {
    console.log("value: ", value);
    if (value.vehicle1 || value.vehicle2) {
      //this.setState({ mobile: value.mobile });
      this.setState({ loading: true });
      var dataObj = {
        vehicle1: value.vehicle1.replace(/[\. ,:-]+/g, "").toUpperCase(),
        vehicle2: value.vehicle2
          ? value.vehicle2.replace(/[\. ,:-]+/g, "").toUpperCase()
          : null,
        token: this.props.person.token,
        name: this.props.person.name,
        oldVehicle1: this.props.person.vehicle1 || null,
        oldVehicle2: this.props.person.vehicle2 || null
      };
      console.log("dataObj: ", dataObj);
      let status = await UpdateVehicle(this.props.person.uid, dataObj);
      console.log("status::", status);
      if (status.error) {
        this.onError(status.error);
      }
      if (status.success) {
        this.onSuccess(status.success);

        let useerInfo = await getUserInfo(this.props.person.uid);
        this.setState({
          user: useerInfo,
          addVehicle: false,
          vehicle1: useerInfo.vehicle1,
          vehicle2: useerInfo.vehicle2
        });
      }
    }
    this.setState({ loading: false });
  };
  updateCancel = () => {
    this.setState({ editUser: false });
  };
  emergencyCancel = () => {
    this.setState({ emergency: false });
  };
  addVehicleCancel = () => {
    this.setState({ addVehicle: false });
  };

  renderEditUser() {   
    
    console.log("renderEditUser :",this.state);    
    if (this.state.editUser) {
      return (
        <EditUserForm
          user={this.state}
          cancel={this.updateCancel}
          updateUserNameAndVehicle={this.updateUserNameAndVehicle}
        />
      );
    }
    if (this.state.emergency) {
      return (
        <EmergencyForm
          user={this.state}
          cancel={this.emergencyCancel}
          updateEmergencyNumber={this.updateEmergencyNumber}
        />
      );
    }
    if (this.state.addVehicle) {
      return (
        <AddMoreVehicle
          user={this.state}
          cancel={this.addVehicleCancel}
          updateVehicle={this.updateVehicle}
        />
      );
    }
    return <View />;
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
    // data = {type, title, message, action}
    // action means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
  }
  static navigationOptions = ({ navigation }) => {
   
    let drawerLabel = "Profile";
    let drawerIcon = () => (
      <Image
        source={require("../../assets/settings-icon.png")}
        style={{ width: 26, height: 26, tintColor: backgroundColor }}
      />
    );
    return { drawerLabel, drawerIcon };
  };

  
  render() {   
    
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
    console.log(this.props.person.isUserLogin+"<------->"+this.state.appLoading)
    if(this.props.person.isUserLogin == "false" && this.state.appLoading == false){      
      return (<LoginCompenent/>)
    }
    
    
    return (
      <View
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: backgroundColor,
      }}
    >
      
        <View
          style={{
            flex: 1,
            backgroundColor: backgroundColor,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
        <View style={{height:"32%",width:"100%"}}>
         <DisplayUser
              deleteFileds = {this.deleteFileds} 
              parentState= {this.state.user || this.props.person}                           
            />
           </View>
           <View style={{height:"60%",width:"100%"}}> 
              {this.renderEditUser()}
          </View>
        </View>
    
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={50}
      />

      <BottomNavigation style={{}}
        onTabPress={newTab => {
          this.setState({ activeTab: newTab.key });

          if (newTab.key == "addVehicle") {
            this.setState({ editUser: false });
            this.setState({ addVehicle: true });
            this.setState({ emergency: false });
          }
          if (newTab.key == "editUser") {
            this.setState({ editUser: true });
            this.setState({ addVehicle: false });
            this.setState({ emergency: false });
          }
          if (newTab.key == "emergency") {
            this.setState({ editUser: false });
            this.setState({ addVehicle: false });
            this.setState({ emergency: true });
          }
        }}
        renderTab={this.renderTab}
        tabs={this.tabs}
        style={ {
        margin:2,
        borderWidth:1,
        borderColor:"#334146",  
        alignContent:"center",
        borderBottomWidth:0      
      }}
      />
      <DropdownAlert
        ref={ref => (this.dropdown = ref)}
        onClose={data => this.onClose(data)}
        closeInterval={10000}
      />
    </View>
      
    )
  }
}

const mapStateToProps = (state) => {
  console.log("mapStateToProps-userInfo.js.js--",state)
  return {
      person: state.person
  }
}
const mapDispatchToProps = (dispatch) => {
  return { 
    watchPersonData: () => { dispatch(watchPersonData()) },
  };
}


export default connect(mapStateToProps,mapDispatchToProps)(withNavigation(UserInfo));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10
  },
  text: {
    marginLeft: 20,
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    padding: 10
  },
  photo: {
    height: 60,
    width: 60,
    borderRadius: 20,
    margin: 4
  }
});
