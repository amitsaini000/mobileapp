import { StyleSheet, Dimensions } from 'react-native';
const window = Dimensions.get('window');

export const IMAGE_HEIGHT = window.width / 4;
export const IMAGE_HEIGHT_SMALL = window.width /7;

export default StyleSheet.create({
  
    theme : {      flex: 1,
      flexDirection: "column",
  
  },
  color : {
    
    backgroundColor: "red",    

},

  dropdown_2: {
    width: "100%",
    marginTop: 25,
    //borderBottomWidth:1,
    borderColor:"red",
    borderWidth:0,
    backgroundColor:"white",
    height:48,
    paddingVertical: 10,
    marginBottom: 50,
  
    
  },
  dropdown_2_text: {
    //marginVertical: 10,
    marginHorizontal: 15,
    fontSize: 18,
    color: 'black',
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  dropdown_2_dropdown: {
    width: "90%",
    //height: "70%",
    borderColor: 'cornflowerblue',
    borderWidth: 2,
    borderRadius: 3,
  },
  dropdown_2_row: {
    flexDirection: 'row',
    height: 40,
    //alignItems: 'center',
  },
  dropdown_2_image: {
    marginLeft: 4,
    width: 30,
    height: 30,
  },
  dropdown_2_row_text: {
    marginHorizontal: 4,
    fontSize: 16,
    color: 'navy',
    textAlignVertical: 'center',
  },
  dropdown_2_separator: {
    height: 1,
    backgroundColor: 'cornflowerblue',
  }, 

  hideo_view :{
    flex: 1,
    flexDirection: 'row',
    alignItems: "flex-start",
    //height: 50
  }

});