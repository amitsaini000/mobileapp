import { db,firebase } from "../db/config";

export const sendMessageTemplate =
 [
  {"name": "Rex", "age": 30},
  {"name": "Mary", "age": 25},
  {"name": "John", "age": 41},
  {"name": "Jim", "age": 22},
  {"name": "Susan", "age": 52},
  {"name": "Brent", "age": 33},
  {"name": "Alex", "age": 16},
  {"name": "Ian", "age": 20},
  {"name": "Phil", "age": 24},
];

export const replayMessageTemplate =
 [
  
  {"name": "Alex", "age": 16},
  {"name": "Ian", "age": 20},
  {"name": "Phil", "age": 24},
];

export  async function handleRightElementPress(label,uid,blockuid) {
  console.log("block user",label);
  console.log("block useruid",uid);
  console.log("block userblo",blockuid);
  if(label.index ==0  &&  label.result == "itemSelected" ){
    blockUser(uid,blockuid);
  }
  if(label.index == 1  &&  label.result == "itemSelected" ){
    unBlockUser(uid,blockuid);
  }

}
async function unBlockUser(uid,unblockuid) { 
  let user =await getUserInfo(uid);
  let blockusers =[];
  if(user.blockuser){
    blockusers = deleteFromArray(user.blockuser,unblockuid);
    console.log(blockusers);
    db.collection("users").doc(uid).update({blockuser:blockusers}).then(function() {        
      return ({success:"Document successfully updated!"});
    }).catch(function(error) {
      return ({error:"Error getting documents"}); 
    });
  }

}
export async function deleteFiled(uid,num,field){
  console.log(uid,num);
  console.log("index ,",field);
  switch(field) { 
   case "mobile1": { 
       db.collection("users").doc(uid).update({
        mobile1: firebase.firestore.FieldValue.delete()
      });
      break; 
   } 
   case "mobile2": { 
    db.collection("users").doc(uid).update({
        mobile2: firebase.firestore.FieldValue.delete()
      }); 
      break; 
   }
   case "vehicle1": { 
     db.collection("users").doc(uid).update({
      vehicle1: firebase.firestore.FieldValue.delete()
      });
      deleteVehicle(num) 
      break; 
   }
   case "vehicle2": { 
      db.collection("users").doc(uid).update({
      vehicle2: firebase.firestore.FieldValue.delete()
      });
      deleteVehicle(num);
      break; 
   }
   default: { 
      //statements; 
      break; 
   }  
  
  
  }
}
function deleteFromArray(array,element){ 
  filtered = array.filter(function(value, index, arr){
    return value != element;
  });
  return filtered;
}
export function findFromArray(array,element){ 
  //console.log("find from arrat",array)
  filtered = array.filter(function(value, index){
    return value == element;
  });
  return filtered;
}
 async function blockUser(uid,blockuid) {
 
  let user =await getUserInfo(uid);
  let blockusers =[];
  if(user.blockuser){
    blockusers = user.blockuser;
  }
  blockusers.push(blockuid);
  db.collection("users").doc(uid).update({blockuser:blockusers}).then(function() {        
    return ({success:"Document successfully updated!"});
  }).catch(function(error) {
    return ({error:"Error getting documents"}); 
  });

}
export async function UpdateVehicle(uid,message) {
  var statusMessage = vechileDetails ={};
  var vehicleData = {
    vehicle1:message.vehicle1
   
   }
   if(message.vehicle2){
    vehicleData.vehicle2 = message.vehicle2;
   }
  console.log("UpdateVehicle",message);
   
    statusMessage = await db.collection("users").doc(uid).update(vehicleData).then(function() {
        
      return ({success:"Document successfully updated!"});      

    }).catch(function(error) {
      return ({error:"Error getting documents"}); 
    });

    const vehicleDb = db.collection("vehicle");  
    
    if( message.vehicle1 && message.vehicle1 != message.oldVehicle1){
        vechileDetails[message.vehicle1.replace(/[\. ,:-]+/g, "") + ""] = {
        vehicle: message.vehicle1.replace(/[\. ,:-]+/g, ""),
        name: message.name,
        token: message.token,
        uid: uid
      };
      var vehicleStatus = await addData(vehicleDb.doc(message.vehicle1.replace(/[\. ,:-]+/g, "")), vechileDetails);
      deleteVehicle(message.oldVehicle1);
   }   
     
   if( message.vehicle2 && message.vehicle2 != message.oldVehicle2){
      vechileDetails ={}
      vechileDetails[message.vehicle1.replace(/[\. ,:-]+/g, "") + ""] = {
      vehicle: message.vehicle2.replace(/[\. ,:-]+/g, ""),
      name: message.name,
      token: message.token,
      uid: uid
    };
    var vehicleStatus = await addData(vehicleDb.doc(message.vehicle2.replace(/[\. ,:-]+/g, "")), vechileDetails);
    deleteVehicle(message.oldVehicle2)
 
  }
  
  return statusMessage;

}
function deleteVehicle(oldVehicle){
   
    db.collection("vehicle").doc(oldVehicle).delete().then(function() {
        console.log("Document successfully deleted!");
        return ({success:"Document successfully updated!"});   
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    }); 
    
}
export async function addData(doc, data, cb) {
  doc
    .get()
    .then(
      function(snapshot) {
        if (snapshot.exists) {
          console.log("Document already exist:", snapshot.data());
        } else {
          console.log("No such document!");
          doc
            .set(data)
            .then(function(snapshot) {
              console.log("saveInfo  added successfully ");
              console.log("prop", this.props);
              if (cb) {
                //navigate(Home);
              }
            })
            .catch(function(error) {
              console.error("saveInfo Error adding document: ", error);
            });
        }
      }.bind(this)
    )
    .catch(function(error) {
      console.log("Error getting document:", error);
    });
};
export async function UpdateEmergencyNumber(uid,message) {
  var statusMessage ={} 
  console.log("UpdateEmergencyNumber",message);
   
    statusMessage = await db.collection("users").doc(uid).update({mobile1:message.mobile1,mobile2:message.mobile2}).then(function() {
        return ({success:"Document successfully updated!"});      
    }).catch(function(error) {
      return ({error:"Error getting documents"}); 
    });
  
  return statusMessage;

}

export async function UpdateUserNameVehicle(uid,message) {
  var statusMessage ={} 
  console.log("UpdateUserNameVehicle",message);
  
  if(message.oldName !== message.name){    
    statusMessage =  await  updateName(uid,message.name)
   }
   if(message.oldVehicle !== message.vehicle ){
      let  vechileDetails = {}; 
      let updatedVehicle =  await getReceiverInfo(message.vehicle);
        console.log("vehicleuser details",updatedVehicle);
        if(updatedVehicle.uid == uid || updatedVehicle.error)
        {
          console.log("check both uid is same  my uid is "+uid + "; vehicle uid is " +updatedVehicle.uid )
          updatedVehicle.name=message.name
          updatedVehicle.vehicle = message.vehicle;      
          vechileDetails[message.vehicle.replace(/[\. ,:-]+/g, "") + ""] = {
            name:message.name,
            vehicle:message.vehicle,
            uid:uid,
            token:message.token
          };
          var batch = db.batch();
          batchUpdate(batch,"vehicle",message.vehicle.replace(/[\. ,:-]+/g, ""),vechileDetails,"set");
          batchUpdate(batch,"vehicle",message.oldVehicle,{},"delete");

          let waitForStatus = await batch.commit().then(function () {
            return ({success:"Document successfully updated!"});  
          }).catch(function(error) {
            console.log("batch Error getting documents: ", error);
            return ({error:"Error getting documents"});
          });
          return waitForStatus;
          // let waitForStatus =  await db.collection("vehicle").doc(message.vehicle.replace(/[\. ,:-]+/g, ""))
          // .set(vechileDetails).then(function() {
          // console.log("Vehicle successfully updated!");
          // return db.collection("vehicle").doc(message.oldVehicle).delete().then(function() {
          //       console.log("Document successfully deleted!");
          //       //if(message.oldName !== message.name)
          //       {
          //         statusMessage =  db.collection("users").doc(uid).update({vehicle:message.vehicle}).then(function() {
          //             return ({success:"Document successfully updated!"});      
          //         }).catch(function(error) {
          //           return ({error:"Error getting documents"}); 
          //         });
          //        }
          //       return statusMessage;//({success:"Document successfully updated!"});   
          //   }).catch(function(error) {
          //       console.error("Error removing document: ", error);
          //   }); 
          // }).catch(function(error) {
          //   console.log("Error getting documents: ", error);
          //   return ({error:"Error getting documents"});
          // });

          //console.log("waitForStatus::",waitForStatus);
          //return waitForStatus;
        
      }
      else{
        return ({error:"Error getting documents"});
      }      
   }
   return  statusMessage;    

}
export function updateReceivedMsg(message){
  //todo impelent batch update here
  console.log("updateReceivedMsg",message);
  for(var i=0;i<message.length;i++){
    if(message[i].cloudReceived != true) {
      console.log( message[i].cloudReceived)
      db.collection("Notification").doc(message[i].docId).update({received:true,cloudReceived:true}).then(function() {
        console.log("Document successfully updated!");
     }).catch(function(error) {
       console.log("Error getting documents: ", error);
     });
    }
    
  }

}

export function getUserChat(uid, senderuid, cb) {
  var msg = [];
  var senderData = {};

  //senderuid = "akTzpEREogQRuKm2ovGFEjBeRRY2";

  console.log("data uid:::", uid);
  console.log("data sender:::", senderuid);
  db.collection("Notification")
    .where(senderuid, "==", true)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        if (doc.data()[uid]) {
          var data = {};
          data = doc.data();
          data.senderId = doc.data().user._id,
          data.avatar_url =  "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg";
          data.createdAt = new Date(parseInt(doc.data().createdAt));
          data.docId= doc.id;
          data.received = true;
          data.cloudReceived = data.cloudReceived || false;
          msg.push(data);
        }
      });
      
       msg.sort(sortByProperty('createdAt'));
       //console.log(" sort=> ", msg);
       if(cb){
        console.log(" getUserChat=> ", cb);
         cb(msg);
        }
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
}
export function getAllChats(uid, cb) {
  var msg = [];
  var senderData = {};
  console.log("getAllChats:::", uid);
  db.collection("Notification")
    .where(uid, "==", true)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        //console.log(new Date(parseInt(data.createdAt))+ " => ", doc.data());
        //if (doc.data().user._id != uid) 
        {
          var data = {};
          var count = 0;

          console.log(doc.id, " inside if=> ", doc.data().user.name);
            (data.name = doc.data().user.name),
            (data.token = doc.data().token),
            (data.senderId = doc.data().user._id),
            (data.avatar_url =
              "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg");
          count =
            senderData[doc.data().user._id] &&
            senderData[doc.data().user._id].unreadMsg
              ? senderData[doc.data().user._id].unreadMsg
              : 0;
          if (doc.data().received == "false") {
            count =
              senderData[doc.data().user._id] &&
              senderData[doc.data().user._id].unreadMsg
                ? senderData[doc.data().user._id].unreadMsg + 1
                : 1;
          }
          senderData[doc.data().user._id] = data;
          senderData[doc.data().user._id].unreadMsg = count;
        }
      });
      console.log(" unread msg=> ", senderData);
      //msg.push(senderData)
      var dataArray = convertJsonTOArray(senderData);
      dataArray.sort(sortByProperty('unreadMsg'));
      cb(dataArray.reverse());
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
}

function convertJsonTOArray(obj) {
  var array = [];
  for (k in obj) {
    array.push(obj[k]);
  }
  return array;
}

export async function getReceiverInfo(vehicle) {
  try{
    console.log("form value: ", vehicle);
     var dataSnapShot = await db
    .collection("vehicle")
    .doc( (vehicle))
    .get();
  console.log("vehicle object::", dataSnapShot.data()[dataSnapShot.id]);

  return dataSnapShot.data()[dataSnapShot.id];

  }
  catch(e){
    return {error:`Sorry User ${vehicle} is Not Register with us`}

  }
  
}

export async function getUserInfo(uid) {
  console.log("getUserInfo: ", uid);
  var dataSnapShot = await db
    .collection("users")
    .doc(uid)
    .get();
  return dataSnapShot.data();
}

export function sendMsg(token, title, body,dataObj) {
  console.log(token + "-sendMsg--" + title + "----" + body);
  dataObj.name = title;
  console.log("dataObj notification:",dataObj)
  return fetch("https://exp.host/--/api/v2/push/send", {
    body: JSON.stringify({
      to: token,
      title: title,
      body: body,
      badge: 4,
     // data: { message: `${title} - ${body} -  ${dataObj}` }
     data: { senderInfo: dataObj } 
    }),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST"
  });
}


export function saveSendMsg(senderObj) {
  console.log("saveSendMsg sender:::", senderObj);
  console.log("saveSendMsg receverId:::", senderObj.receverId);
  var msg = {
    _id: Math.round(Math.random() * 1000000),
    text: senderObj.text,
    token: senderObj.token,
    createdAt: new Date().getTime(),
    sent: true,
    received: false,
    user: { _id: senderObj.senderUid, name: senderObj.name }
  };
    msg[senderObj.senderUid] = true;
    msg[senderObj.receverId] = true;
  
  
  
   db.collection("Notification")
    .add(msg)
    .then(function(docRef) {
      console.log(" saveSendMsg Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error(" saveSendMsg Error adding document: ", error);
    });
  
    return msg;
}
function sortByProperty(property) {
   //someArray.sort(sortByProperty('id'));
    return function (x, y) {

        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));

    };

};

export async function getDbDoc(dbname,docid) {
  var dataSnapShot = await 
    db
    .collection(dbname)
    .doc(docid)
    .get();
  console.log("getDbDoc info object::", dataSnapShot.data());
  return dataSnapShot.data();  
}

async function getDocID(dbname,uid) {
  var msg = [];
  
   var docids  = await db.collection(dbname)
    .where(uid, "==", true)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        {
          msg.push(doc.id);
        }       
      });      
      return(msg);      
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
    return docids;
}

function batchUpdate(batch,dbName,docId,prop,cmd){
  var dbref =db.collection(dbName).doc(docId);
  if(cmd && cmd == "delete"){
    batch[cmd](dbref);
  }
  else{
    batch[cmd](dbref,prop);
  }  
     
}
async function updateName(uid,newName){  
    
  var batch = db.batch();
  var status ={}
  batchUpdate(batch,"users",uid,{name:newName},"update");

  var NotificationDocids =  await getDocID("Notification",uid);
  const map1 = NotificationDocids.map(x => db.collection("Notification").doc(x));  
  const map2 = map1.map(x =>  batch.update(x, { 'user.name': newName }));

  const userData = await getUserInfo(uid);
   if(userData.vehicle){     
     batchUpdate(batch,"vehicle",userData.vehicle,{name:newName},"update");
   }
   if(userData.vehicle1){     
    batchUpdate(batch,"vehicle",userData.vehicle1,{name:newName},"update");    
   }
   if(userData.vehicle2){     
    batchUpdate(batch,"vehicle",userData.vehicle2,{name:newName},"update");    
   }

   status = await batch.commit().then(function () {
    return ({success:"Document successfully updated!"});  
  }).catch(function(error) {
    console.log("Error getting documents: ", error);
    return ({error:"Error getting documents"});
  });
  return status;
  
}
/*

<Toolbar
        leftElement="menu"
        centerElement="Searchable"
        searchable={{
          autoFocus: true,
          placeholder: 'Search',
        }}
        rightElement={{
            menu: {
                icon: "more-vert",
                labels: ["item 1", "item 2"]
            }
        }}
        onRightElementPress={ (label) => { console.log(label) }}
      />
<MenuContext style={{padding:5,right: -70}}>
        <Menu onSelect={value => alert(`Selected number: ${value}`)}
          //renderer={Renderers.SlideInMenu}
          style={{width:100}}
        >
          <MenuTrigger text={<Icon name="ios-menu"  />}  />
          <MenuOptions customStyles={optionsStyles}>
            <MenuOption value={1} >
            <Text style={{color: 'red'}}>Two</Text>
            </MenuOption>
            <MenuOption value={2}>
              <Text style={{color: 'red'}}>Two</Text>
            </MenuOption>
            <MenuOption value={3} disabled={true} text='Three' />
          </MenuOptions>
        </Menu>
        </MenuContext>
<Picker
           selectedValue={this.state.language}
            style={{
              height: 50,
              //color: "#ffffff",
              width: 300,
              //borderBottomWidth: 1,
              borderStyle:"solid",
              color:"red",
              borderBottomColor:"green",
              borderColor:"white",
              borderRightColor:"grey"
            }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ language: itemValue })
            }
            
          >
            <Picker.Item label="Please Select The Message" value="" />
            <Picker.Item label="JavaScript" value="js" />
            <Picker.Item label="C" value="c" />
            <Picker.Item label="C++" value="c++" />
            <Picker.Item label="Java" value="Java" />
          </Picker>

const list = [
  {
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President'
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  },
 
]
export default [
    {
      _id:1,
      text: '#awesome 11',
      createdAt: new Date(),
      name: 'Developer',
    //   user: {
    //     _id: 1,
       
    //   },
    },
    {
      _id: 2,
      text: 'Text here 227',
      createdAt: new Date(),
      name: 'React Native', 
    //   user: {
    //     _id: 2,
       
    //     avatar: require('../../assets/avatar.png'),
    //   },
      image: 'https://lh3.googleusercontent.com/-uXipYA5hSKc/VVWKiFIvo-I/AAAAAAAAAhQ/vkjLyZNEzUA/w800-h800/1.jpg',
      sent: true,
      //received: true,
    }
  ];

  */

//   {
//     _id: Math.round(Math.random() * 1000000),
//     text: '#awesome',
//     createdAt: new Date(),
//     user: {
//       _id: 1,
//       name: 'Developer',
//     },
//     sent:true
//   }

/*
  
  ,
    {
      _id: Math.round(Math.random() * 1000000),
      text: 'Send me a picture!',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'Developer',
      },
    },
    {
      _id: Math.round(Math.random() * 1000000),
      text: '',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'React Native',
        avatar: require('../../assets/avatar.png'),
      },
      sent: true,
      received: true,
      location: {
        latitude: 48.864601,
        longitude: 2.398704,
      },
    }, 
    {
      _id: Math.round(Math.random() * 1000000),
      text: 'Where are you?',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'Developer',
      },
    },
    {
      _id: Math.round(Math.random() * 1000000),
      text: 'Yes, and I use #GiftedChat!',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'React Native',
        avatar: require('../../assets/avatar.png'),
      },
      sent: true,
      received: true,
    },
    {
      _id: Math.round(Math.random() * 1000000),
      text: 'Are you building a chat app?',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'Developer',
      },
    }
  
  */
