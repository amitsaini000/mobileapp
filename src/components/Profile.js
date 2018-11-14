
import React, { Component } from 'react';
import {
    Text, View, Image, TouchableHighlight
} from 'react-native';
import HeaderComponent from './HeaderComponent';

import { backgroundColor } from "./data";
export default class ProfileComponent extends Component {
    static navigationOptions = ({ navigation }) => {
        let drawerLabel = 'Profile';
        let drawerIcon = () => (
            <Image
                source={require('../../assets/settings-icon.png')}
                style={{ width: 26, height: 26, tintColor: backgroundColor }}
            />
        );
        return {drawerLabel, drawerIcon};
    }
    render() {
        return (<View style={{
            flex: 1,
            flexDirection: 'column',
        }}>      
            <HeaderComponent {...this.props} title="Profile" />      
            <View style={{
                flex: 1,
                backgroundColor: backgroundColor,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Text style={{ fontWeight: 'bold', fontSize: 22, color: 'white' }}>
                    This is Profile Screen
                </Text>
                <TouchableHighlight style={{ 
                                            margin: 20, 
                                            width: 200, 
                                            height: 45,
                                            backgroundColor: 'darkviolet',
                                            padding: 10,
                                            alignItems: 'center',
                                         }}
                    onPress={() => {
                        const { navigate } = this.props.navigation;
                        navigate(Home);                                             
                    }}>
                    <Text style={{color: 'white', fontSize: 18}}>Navigate to Info</Text>
                </TouchableHighlight>
            </View>
        </View>);
    }
}