import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,Dimensions
} from "react-native";

import { Header, Body, Title, Content, Left, Icon, Right } from 'native-base';
import Logo from "./Logo";
const window = Dimensions.get('window');

//export const IMAGE_HEIGHT = window.width / 4;  </Right>
class CustomHeader extends Component {
    render() {
        return (
            <Header style={{marginTop:2,height:90,width:window.width}}>  
                <Left >
                    <View style={{ flexDirection: 'row'}}>
                    <Icon name="ios-menu" 

                        onPress={() => {
                            this.props.navigation.openDrawer();
                            
                        }} />
                        <Logo style={{marginRight: 20,}} 
                        /> 
                    </View>
                    
                </Left>
                <Body>
                  
                    <Title style={{textAlign:"center"}}
                    onPress={() => {
                        this.props.navigation.openDrawer();                        
                    }}
                    >  {this.props.title}</Title>
                </Body>
                
            </Header>
        );
    }
}
export default CustomHeader