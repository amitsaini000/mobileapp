import { getAllChats,getUserChat } from '../components/data';
import { fire,db } from "../db/config";

let initialState = {
  chats:[],
  conversion:[],
  updatedConversion:[]
};


export default userchat = (state = initialState, action) => {
  console.log("notification action-state--",action.type);  
 // console.log("notification action---",initialState);  
  switch (action.type) {
    case "getAllChats":        
        return {chats:action.payoload, conversion:state.conversion,updatedConversion:state.updatedConversion}
     case "getUserChat":        
        return {conversion : action.payoload, chats:state.chats ,updatedConversion:state.updatedConversion} 
    case "chatModified":      
      return {updatedConversion : action.payoload,chats:state.chats,conversion:[...state.conversion]}        
    default:
        return state;
  }
};
const setAction = (data,action) => {
     //console.log("watachUserChat----setaction---");
      return {
      type: action,
      payoload: data 
    };
  };

  
export const watchUserChat = (uid) => {    
    return async function(dispatch) {
        console.log("watachUserChat-------",uid); 
        const msg = await getAllChats(uid);
        dispatch(setAction(msg,"getAllChats"));       
    };
  };

  export const watchConversion = (uid,senderId) => {    
    return async function(dispatch) {
        console.log("watchConversion-------",uid); 
        const msg = await getUserChat(uid,senderId);
        dispatch(setAction(msg.reverse(),"getUserChat"));       
    };
  }; 

  export const updateChatListner = (uid) => {
    return function(dispatch){
        
        console.log("updateChatListner---eventListner---"); 
        db.collection("Notification").where(uid, "==", true)    
        .onSnapshot(function (snapshot) {
          let msg =[];
          snapshot.docChanges().forEach(function (change) {
            
            if (change.type === "added") {
              console.log("New city: ");
            }
            if (change.type === "modified") {
              console.log("Modified : ", change.doc.data());
              msg.push(change.doc.data());              
              dispatch(setAction(msg,"chatModified"));  
            }
            if (change.type === "removed") {
              console.log("Removed : ", change.doc.data());
            }
          });
        });
    } 
};




