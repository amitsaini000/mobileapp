import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,Dimensions
} from "react-native";

import { Header, Body, Title, Content, Left, Icon, Right } from 'native-base'
const window = Dimensions.get('window');

//export const IMAGE_HEIGHT = window.width / 4;
class CustomHeader extends Component {
    render() {
        return (
            <Header style={{marginTop:2,height:90,width:window.width}}>  
                <Left ><Icon name="ios-menu" 

                onPress={() => {
                    this.props.navigation.openDrawer();
                    
                }} /></Left>
                <Body>
                    <Title
                    onPress={() => {
                        this.props.navigation.openDrawer();                        
                    }}
                    >{this.props.title}</Title>
                </Body>
                <Right />
            </Header>
        );
    }
}
export default CustomHeader