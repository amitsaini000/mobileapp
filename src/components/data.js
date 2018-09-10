import { db } from "../db/config";
import Expo from "expo";
import t from "tcomb-form-native"; // 0.6.11



export async function UpdateVehicle(uid,message) {
  var statusMessage = vechileDetails ={};
  var vehicleData = {
    vehicle1:message.vehicle1
   
   }
   if(message.vehicle2){
    vehicleData. vehicle2 = message.vehicle2;
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
    statusMessage =  await db.collection("users").doc(uid).update({name:message.name}).then(function() {
        return ({success:"Document successfully updated!"});      
    }).catch(function(error) {
      return ({error:"Error getting documents"}); 
    });
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
      
          let waitForStatus =  await db.collection("vehicle").doc(message.vehicle.replace(/[\. ,:-]+/g, ""))
          .set(vechileDetails).then(function() {
          console.log("Vehicle successfully updated!");
          return db.collection("vehicle").doc(message.oldVehicle).delete().then(function() {
                console.log("Document successfully deleted!");
                //if(message.oldName !== message.name)
                {
                  statusMessage =  db.collection("users").doc(uid).update({vehicle:message.vehicle}).then(function() {
                      return ({success:"Document successfully updated!"});      
                  }).catch(function(error) {
                    return ({error:"Error getting documents"}); 
                  });
                 }
                return statusMessage;//({success:"Document successfully updated!"});   
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            }); 
          }).catch(function(error) {
            console.log("Error getting documents: ", error);
            return ({error:"Error getting documents"});
          });

          console.log("waitForStatus::",waitForStatus);
          return waitForStatus;
        
      }
      else{
        return ({error:"Error getting documents"});
      }      
   }
   return  statusMessage;    

}
export function updateReceivedMsg(message){
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
       cb(msg);
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
  console.log("user info object::");
  return dataSnapShot.data();
}

export function sendMsg(token, title, body,dataObj) {
  console.log(token + "-sendMsg--" + title + "----" + body);
  return fetch("https://exp.host/--/api/v2/push/send", {
    body: JSON.stringify({
      to: token,
      title: title,
      body: body,
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


/*


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
