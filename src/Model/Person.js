import { getUserStatusAsync,getUserStatus } from "../db/dbutil";
import { getUserInfo } from "../components/data";

let instance;
// name: "",
// mobile: "",
// mobile1: "",
// mobile2: "",
// vehicle: "",
// vehicle1: "",
// vehicle2: "",
// token: ""
class Person {
    static login = false;
    constructor() {
        if (instance) {
            console.log("person instance already  exist")
            return instance;
        }
        console.log("person instance not exist")
        this.person = {
           
        };
        this.init(); 
        instance = this;
    }
    init = async () => { 
     var user =  await  getUserStatus(this.checkLogin)   
     console.log("init Person after wait",user);
     return user;     
        
    }
    checkLogin = async user => {
        if (user) {
            console.log("init Person checkLogin user",user.uid) 
            if(!this.person.name){
                const useerInfo = await getUserInfo(user.uid);
                console.log("init Person checkLogin",useerInfo) 
                this.setPerson(useerInfo);
                return useerInfo;
            }
        }
        else{
            console.log(" checkLogin init Person not found user"); 
            return null;
        }
       
      };

    setPerson(user) {
        this.person = user;
    }

    async getPerson() {
        console.log("getPerson name-->",this.person);
        if(this.person.name){
           return instance; 
        }
        else{
           this.init();  
           return instance;
        }

    }
    updatePerson() {
        this.person ={};
        this.init();
    }
}

export default (Person = instance || new Person());


