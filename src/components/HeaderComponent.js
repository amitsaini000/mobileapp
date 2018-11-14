import React, { Component } from "react";
import { StyleSheet, Dimensions, Text, TouchableHighlight } from "react-native";

//import { Header, Body, Title,  Left, Icon, Right } from 'native-base';

import { Header, Icon } from "react-native-elements";
import Logo from "./Logo";
import { headerColor } from "./data";
const window = Dimensions.get("window");

//export const IMAGE_HEIGHT = window.width / 4;  </Right>
class CustomHeader extends Component {
  constructor(props) {
    super(props);
    console.log("title--Header---->",props.title)
  }
  componentWillReceiveProps(nextProps) {
    // console.log("title- nextProps-----",nextProps.title)
  }
  render() {
    const title =  this.props.title ? ("Welcome " +this.props.title) : ""
    
    return (
      <Header
        backgroundColor={headerColor}
        //leftComponent={{ icon: 'menu', color: '#fff' }}
        leftComponent={
          <TouchableHighlight
            style={{ width: 30 }}
            onPress={() => this.props.navigation.openDrawer()}
          >
            <Icon name="menu" color="#fff" />
          </TouchableHighlight>
        }
        centerComponent={{ text: title, style: { color: "#fff",fontWeight: "bold" } }}
        rightComponent={{ icon: "home", color: "#fff" }}
        statusBarProps={{ barStyle: "light-content" }}
        barStyle="light-content"
      />
    );
  }
}
export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontWeight: "bold",
    backgroundColor: headerColor
  }
});

/*

<Header style={{
                             marginTop:0,
                             height:100,
                             width:window.width,
                             backgroundColor:headerColor,
                             borderBottomWidth:2,
                             borderColor:"#334146",
                             borderBottomColor: headerColor,
                             //flex:1,
                             //alignItems:"flex-start"
                             //elevation:40,
                             }}>  
                <Left style={{marginLeft:15}} >
                    <View style={{ flexDirection: 'row',alignItems:"center",justifyContent:"center",
                                  flex:1, }}>
                     <Icon name="ios-menu"  style={{color:"white",fontWeight: 'bold',}}

                        onPress={() => {
                            this.props.navigation.openDrawer();
                            
                        }} />
                        <Logo style={{marginRight: 20,}} 
                         onPress={() => {
                            this.props.navigation.openDrawer();
                            
                        }}
                        /> 
                      <Title style={{textAlign:"left",marginLeft:10,color:"white",fontWeight: 'bold'}}
                    onPress={() => {
                        this.props.navigation.openDrawer();                        
                    }}
                    >  {this.props.title} </Title>   
                    </View>
                    
                </Left>
                <Body style={{flex:1, flexDirection: 'row',alignItems:"flex-start",
                              justifyContent:"center"}}>
                  
                   
                </Body>
                
            </Header>

*/
