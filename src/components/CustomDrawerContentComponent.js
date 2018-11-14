
import React, { Component } from "react";
import { Container, Content, Icon, Header, Body,Root } 
  from 'native-base'
  import { View,
    Text,
    Image,StyleSheet
 } from 'react-native'; 
 import { DrawerItems   } from 'react-navigation';

 
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation'

import {watchPersonData} from "../reducers/person"
import {headerColor} from "../components/data"

class CustomDrawerContentComponent extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
        user:{
          name:"",
          mobile:""
        }      
    };
    //console.log("customDrawerCopnent constructor props :",props.navigation);
    
  }

  componentWillMount() {
    console.log("CustomDrawerContentComponent componentWillMount :");
    
  }
  
  componentWillUnmount(){
    this._isMounted = false;
    console.log("CustomDrawerContentComponent componentWillUnmount :");   
  }
  
  componentDidMount() {
    this._isMounted = true;
    console.log("CustomDrawerContentComponent componentDidMount :");      
  }
 
  
  

  render() {
    

    return (
        <Container>
        <Header style={styles.drawerHeader}>
          <Body style= {styles.bodyContainer}>
            <Image
              style={styles.drawerImage}
              source={{
                uri:
                  "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
              }} 
              />
             <View style={{
               flex:1,
               //flexDirection:"row",
               justifyContent:"center",
               marginLeft:25,
              
    
             }}> 
               <Text style={{color:"white",fontWeight:"bold"}} >{this.props.person.name || "" }</Text>
               <Text style={{color:"white",fontWeight:"bold",marginTop:5}}>
               {this.props.person.mobile || "" }
               </Text>
             </View>
          </Body>
        </Header>
        <Content>
          
        <DrawerItems {...this.props} />
        </Content>
    
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      person: state.person
  }
}
const mapDispatchToProps = (dispatch) => {
  return { 
    watchPersonData: () => { dispatch(watchPersonData()) },
  };
}


export default connect(mapStateToProps,mapDispatchToProps)(withNavigation(CustomDrawerContentComponent));

const styles = StyleSheet.create({

    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      
    },
    drawerHeader: {
      height: 150,
      //marginLeft: 10,
      //backgroundColor: 'grey'
      backgroundColor:headerColor
    },
    drawerImage: {
      height: 80,
      width: 80,
      borderRadius: 20,
      margin: 4
    },
    bodyContainer:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection:"row"
    }})