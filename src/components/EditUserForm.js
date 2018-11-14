/*
Mr Nguyen Duc Hoang
https://www.youtube.com/c/nguyenduchoang
Email: sunlight4d@gmail.com
ProfileComponent 
*/
import React, { Component } from 'react'; import {

  TouchableHighlight,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  View,
  Image,
  Text,
  StyleSheet
} from "react-native";
import commonStyle from './style';
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import MaterialsIcon from "react-native-vector-icons/MaterialIcons";
import Hideo from "./Hideo";
import {
  backgroundColor,
  getUserInfo, UpdateUserNameVehicle
} from "./data";

//export const IMAGE_HEIGHT = window.width / 4;  </Right>
class EditUserForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props.user
    };
    console.log("edit user form new  prop:", this.state);
  }

  componentWillReceiveProps(newProps) {
    console.log("edit user form new  userprops:", newProps);
    this.setState({ ...newProps.user })
  }
  updateUser = () => {

    this.props.updateUserNameAndVehicle({ name: this.state.name, vehicle: this.state.vehicle })
  }
  cancel = () => {
    this.props.cancel();
  }
  render() {
    return (
      <View
      style={{
       // flex: 1,
       // padding: 12,
        //flexDirection: 'row',
       // alignItems: "flex-start",
        //justifyContent:"flex-start",
        marginTop: 4,        
        height:200
      }}
      >
        <View  style={commonStyle.hideo_view}>
          <Hideo
            iconClass={FontAwesomeIcon}
            iconName={"user-o"}
            iconColor={"white"}
            iconBackgroundColor={"#f2a59d"}
            placeholder="Enter Name"
            onChangeText={text => this.setState({ name: text, nameError: text })}
            vehicleInputError={this.state.nameError}
            defaultValue={this.state.user.name}
            returnKeyType="next"
            ref="nameInput"
          />
        </View>
        <View  style={[commonStyle.hideo_view,{marginTop:-10}]}>
          <Hideo
            //style={{ width: "94%" }}
            //iconClass={FontAwesomeIcon}
            iconClass={MaterialsIcon}
            //iconName={'directions-bus'} //class not need
            iconName={"directions-bus"}
            iconColor={"white"}
            // this is used as backgroundColor of icon container view.
            iconBackgroundColor={"#f2a59d"}
            placeholder="Vehicle Number"
            onChangeText={text =>
              this.setState({ vehicle: text, vehicleError: text })
            }
            vehicleInputError={this.state.vehicleError}
            defaultValue={this.state.user.vehicle}
            ref="vehicleInput"
          />
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent:"center",
            alignItems:"center"
          }}
        >
          <TouchableHighlight
            style={{
              margin: 10,
              width: "30%",
              height: 45,
              backgroundColor: "darkviolet",
              padding: 10,
              alignItems: "center"
            }}
            onPress={this.updateUser}
          >
            {this.state.loading ? (
              <ActivityIndicator
                animating={true}
                size="large"
                color="#0000ff"
              />
            ) : (
                <Text style={{ color: "white", fontSize: 18 }}>Update </Text>
              )}
          </TouchableHighlight>
          <TouchableHighlight
            style={{
              margin: 10,
              width: "30%",
              height: 45,
              backgroundColor: "darkviolet",
              padding: 10,
              alignItems: "center"
            }}
            onPress={this.props.cancel}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Cancel </Text>
          </TouchableHighlight>
        </View>
      </View>

    );
  }
}



export default EditUserForm