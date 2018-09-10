import {fire} from "./config";
import { Login } from "../screens/screen";

var  isUser;
export function getUserStatus(cb) {
    
   //console.log("getUserStatus",isUser) 
    if(!isUser){
        var user = fire.auth().currentUser;
        //console.log("getUserStatus",user)
        fire.auth().onAuthStateChanged(    
            function(user) {
            if (user) {
                console.log("getUserStatus user exist")
                isUser = user;
                cb(user);      
            }
            else {
                console.log("getUserStatus Not exist")            
                cb(null)
            }
        }
        );
        
    }
    else{
        cb(isUser)
    }    
}
export function signOut(){
    fire
    .auth()
    .signOut()
    .then(function() {
        console.log("signout");
        isUser = null;
    })
    .catch(function(error) {
        console.log("signout error");
    });
 } 
 export function signIn(email,password,cb){

    fire.auth().signInWithEmailAndPassword(email, password)
      .then((u) => {
       console.log("Sucess",u);
       isUser = u;
       cb(isUser);
       
      }) 
      .catch((u) => {
        console.log("Failed",u)
        isUser =null;
        cb(isUser);
        
      });
 }

//export  user = getUserStatus(); 