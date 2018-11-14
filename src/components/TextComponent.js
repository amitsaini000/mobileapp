import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class TextComponent extends Component {
    constructor(props){
        super(props)
    }
    render() {
    return (
        <View style= {{flex:1 ,flexDirection: "row", alignItems:"center",justifyContent:"center"}}>
        
        <Text style= {{fontWeight:"bold",color:"white"}}>{this.props.text}</Text>
        
        </View>

    )
  }
}