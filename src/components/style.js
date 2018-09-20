import { StyleSheet, Dimensions } from 'react-native';
const window = Dimensions.get('window');

export const IMAGE_HEIGHT = window.width / 4;
export const IMAGE_HEIGHT_SMALL = window.width /7;

export default StyleSheet.create({
  dropdown_2: {
    width: "90%",
    marginTop: 7,
    borderBottomWidth:1,
    borderColor:"white"
  },
  dropdown_2_text: {
    //marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 18,
    color: 'white',
    textAlign: 'left',
    //textAlignVertical: 'center',
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

});