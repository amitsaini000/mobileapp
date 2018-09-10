
class valid {
    validation(e) {
        console.log("validation validation"+this.isRequired);
        console.log(e)
        console.log(this);        
    
    function NumberValidation(value) { 
        console.log("NumberValidation")
        const re = /^[0-9\b]+$/;
        if (value == '' || re.test(value)) {
            console.log("yes number")
        }
        else {
            console.log("Not number")
        }
    }
    function emailValidation() {


    }

    function MaxLengthValidation() {
    }
    
    if (this.isRequired) {
       
        NumberValidation(e); 
        this.style.color="red";
        // if (NumberValidation(e)){
        //    console.log("loda")
        // }

    }
  }
    
}
export default valid = new valid();