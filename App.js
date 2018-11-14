import React from 'react';
import DrawerNavigatorComponent from './src/components/DrawerNavigator';
import { Font, AppLoading } from "expo";
import { Root} from 'native-base'; 

import { Provider } from 'react-redux'
import store from './src/store';
console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed','Setting a timer'];
  export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      loading: true,     
      
    };
  }
 
  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading:false });
  }
  
  
  render() {
    
   const MyApp = DrawerNavigatorComponent();
    
    if (this.state.loading) {
      return (
        <Root>
          <AppLoading/>
        </Root>
      );
    }
    return (
      <Provider store={store}>
        <MyApp/>
      </Provider>
    );
  }
}
