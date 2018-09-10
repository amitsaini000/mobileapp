//getNotification.js

export default function handleNotification({ origin, data }){

    //handleNotification = ({ origin, data }) => {
        console.log(
        `Push notification ${origin} with class data: ${JSON.stringify(data)}`
        );
        //Push notification received with data: {"message":"user1 - Hello"}
   // };
    
}