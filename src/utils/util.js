export function sendRequest(url,cb,er) {
    console.log("url",url);
    return fetch(url,{ method: 'GET'})
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("responseJson");
        console.log(responseJson);
        if(cb){
            cb();
        }
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
        if(er){
            er();
        } 
      });
  }

 
  