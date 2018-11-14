import { getUserStatus, getUserStatusAsync } from "../db/dbutil";
import { getUserInfo,isEqual } from "../components/data";
import { fire,db } from "../db/config";
import {signOut} from '../db/dbutil';
//const loading =true;
let initialState = {
};
//let isUserLogin = false;
const person = (state = initialState, action) => {
  console.log("action- person------------------->", action.type);
  //console.log("action---state----------------->", initialState);
  switch (action.type) {
    case "setPersonData":        
        return (initialState.name? initialState:{isUserLogin :"false"}); 
    case "isUserLogin":
        return true;    

    default:
        return state;
  }
};

const setPerson = user => {
 // initialState.loading =false;   
  initialState = { ...user };
};

export const updatePerson = () => {
    return function(dispatch){
        console.log("updatePerson---eventListner---"); 
        db.collection("users").doc(initialState.uid)
        .onSnapshot(function(doc) {
            
            let isChange = isEqual(initialState,doc.data())
            if(!isChange){
                console.log("Current data is changed: ", doc.data());
                dispatch(setPersonData(doc.data()));
            }            
        });
    } 
};

const setPersonData = (data) => {
  if(data){
      initialState = {...data}
  }
    return {
    type: "setPersonData"
  };
};

function addEvent()
{
  
   db.collection("Notification").where("UqonunZqnkZAom3aVprIIFINnEv2", "==", true)
    // .onSnapshot(function(querySnapshot) {
    //     var cities = [];
    //     querySnapshot.forEach(function(doc) {
    //         cities.push(doc.data().text);
    //     });
    //     console.log("Current cities in CA: ", cities.join(", "));
    // });
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                console.log("New city: ", change.doc.data());
            }
            if (change.type === "modified") {
                console.log("Modified city: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed city: ", change.doc.data());
            }
        });
    });
}
export const signOutReducer = ()=>{
    return function(dispatch){
        initialState = {}
        //initialState.loading = true;
        signOut();
        dispatch(setPersonData());
    }
    
}


export const isUserLogin = (dta) => {
  
    return {
        type: "isUserLogin"
      };
  };

export const watchPersonData = (data) => {
  
  return function(dispatch) {
    if(initialState.name){
        console.log("init Person user we have- already data-->");
        dispatch(setPersonData());           
    } 
    else{
        fire.auth().onAuthStateChanged(function(user) {
            if (user) { 
                console.log("init Person got user we have--->", user.uid);
                getUserInfo(user.uid, function(useerInfo) {
                setPerson(useerInfo);
                dispatch(setPersonData());
              });
            }
            else{
                dispatch(setPersonData());
            }
          });
    }     
  };
};
async function getUid() {
    let user = await fire.auth().currentUser;
    let uid = await user.uid; 
    return uid;
}

export default person;



