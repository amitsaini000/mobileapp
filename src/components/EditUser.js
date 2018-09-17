import t from "tcomb-form-native"; // 0.6.11

const Form = t.form.Form;

const Mobile = t.refinement(t.Number, function(n) {
  return n == 10;
});
Mobile.getValidationErrorMessage = function() {
  return "Invalid Number";
};

t.Number.getValidationErrorMessage = function(value) {
  if (!value) return "empty number";
  else if (!Number.isInteger(value)) return "Invalid Number";
};

const User = t.struct({
  mobile: t.Number,
  name: t.String,
  //otp: t.Number,
  vechile: t.String,
  password: t.String
});

const formStyles = {
  ...Form.stylesheet,
  formGroup: {
    normal: {
      marginBottom: 10
    }
  },
  controlLabel: {
    normal: {
      color: "blue",
      fontSize: 18,
      marginBottom: 7,
      fontWeight: "600"
    },
    // the style applied when a validation error occours
    error: {
      color: "red",
      fontSize: 18,
      marginBottom: 7,
      fontWeight: "600"
    }
  },
  textbox: {
    // the style applied wihtout errors
    normal: {
      color: "white",
      fontSize: 17,
      height: 40,
      //padding: 15,
      // borderRadius: 4,
      borderColor: "#cccccc", // <= relevant style here
      //borderWidth: 1,
      marginBottom: 8,
      width: 300,
      borderBottomWidth: 1,
      fontWeight: "bold"
    },

    // the style applied when a validation error occours
    error: {
      color: "#000000",
      fontSize: 17,
      height: 36,
      padding: 10,
      // borderRadius: 4,
      borderColor: "#a94442", // <= relevant style here
      //borderWidth: 1,
      marginBottom: 5,
      width: 300,
      borderBottomWidth: 1,
      fontWeight: "bold"
    }
  }
};
const options = {
  stylesheet: formStyles,
  order: ["mobile", "name",  "vechile", "password"],
  fields: {
    // email: {
    //   placeholder: 'email@mail.com',
    //   error: 'email is empty?',
    //   auto: "none",
    // },
    mobile: {
      placeholder: "Mobile",
      auto: "none",
      returnKeyType: "next",
      autoCorrect: false,
      maxLength: 10
      //onSubmitEditing: () => this.setFocus("name"),
      // onSubmitEditing: this.setFocus,
    },

    name: {
      placeholder: "Name",
      auto: "none",
      returnKeyType: "next",
      autoCorrect: false,
      error: "Empty"
      // onSubmitEditing: {this.setFocus("otp")},
    },

   
    vechile: {
      placeholder: "VECHILE",
      auto: "none",
      returnKeyType: "next",
      autoCorrect: false
    },
    password: {
      placeholder: "Password",
      auto: "none",
      returnKeyType: "send",
      autoCorrect: false
      //secureTextEntry:true
    }
  }
};
const value = {
  
};
// optional rendering options (see documentation)

/*


 <Form
            ref={c => (this._form = c)}
            type={User}
            options={options}
            value={}
            padding={35}
            //onChange={formValue => this.setState({ formValue })}
          />

*/


  export  function editUser() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#4c69a5",
          alignItems: "center"
        }}
      >
     
          <TouchableHighlight
            style={{
              width: 200,
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              backgroundColor: "#ffae",
              marginTop: 20,
              marginBottom: 40
            }}
            //onPress={this.handleSubmit}
            // onPress={signInWithGoogleAsync.bind(this)}

            //underlayColor="#99d9f4"
          >
            <Text style={styles.buttonText}>Update</Text>
          </TouchableHighlight>
      
      </View>
    );
  }

