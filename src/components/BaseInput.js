import { Component } from 'react';
import PropTypes from 'prop-types';

import { Animated, Text, View, ViewPropTypes } from 'react-native';

export default class BaseInput extends Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    style: ViewPropTypes ? ViewPropTypes.style : View.propTypes.style,
    inputStyle: Text.propTypes.style,
    labelStyle: Text.propTypes.style,
    easing: PropTypes.func,
    animationDuration: PropTypes.number,
    useNativeDriver: PropTypes.bool,

    editable: PropTypes.bool,

    /* those are TextInput props which are overridden
     * so, i'm calling them manually
     */
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    this._onLayout = this._onLayout.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this.focus = this.focus.bind(this);

    const value = props.value || props.defaultValue;

    this.state = {
      value,
      focusedAnim: new Animated.Value(value ? 1 : 0),
      error: props.vehicleInputError
    };
    //console.log("baseInput",props);
  }

  componentWillReceiveProps(newProps) {
    const newValue = newProps.value;
    if (newProps.hasOwnProperty('value') && newValue !== this.state.value) {
      this.setState({
        value: newValue
      });

      // animate input if it's active state has changed with the new value
      // and input is not focused currently.
      const isFocused = this.refs.input.isFocused();
      if (!isFocused) {
        const isActive = Boolean(newValue);
        if (isActive !== this.isActive) {
          this._toggle(isActive);
        }
      }
    }
    if(newProps.vehicleInputError === true){
      this.setState({error: newProps.vehicleInputError });
    }
    
    //console.log("baseInputwill receive props",newProps);
    //console.log("baseInputwill receive props state",this.state);
  }

  _onLayout(event) {
    this.setState({
      width: event.nativeEvent.layout.width,
    });
  }

  _onChange(event) {
    this.setState({
      value: event.nativeEvent.text,
      error:false
    });

    const onChange = this.props.onChange;
    if (onChange) {
      onChange(event);
    }
    
    //this.setState({error:false});
    //console.log("onchange",this.state)
    //console.log("onchange",event.nativeEvent)
  }

  _onBlur(event) {
    if (!this.state.value) {
      this._toggle(false);
    }

    const onBlur = this.props.onBlur;
    if (onBlur) {
      onBlur(event);
    }
    
    if(!this.state.value ){
      this.setState({error:true});
    }else{
      this.setState({error:false});
    }
    //console.log("_onBlur",this.state);
  }

  _onFocus(event) {
    this._toggle(true);

    const onFocus = this.props.onFocus;
    if (onFocus) {
      onFocus(event);
    }
    if(!this.state.value ){
      this.setState({error:true});
    }else{
      this.setState({error:false});
    }
   // console.log("_onFocus",this.state);
  }

  _toggle(isActive) {
    const { animationDuration, easing, useNativeDriver } = this.props;
    this.isActive = isActive;
    Animated.timing(this.state.focusedAnim, {
      toValue: isActive ? 1 : 0,
      duration: animationDuration,
      easing,
      useNativeDriver,
    }).start();
  }

  // public methods

  inputRef() {
    return this.refs.input;
  }

  focus() {
    if (this.props.editable !== false) {
      this.inputRef().focus();
    }
  }

  blur() {
    this.inputRef().blur();
  }

  isFocused() {
    return this.inputRef().isFocused();
  }

  clear() {
    this.inputRef().clear();
  }
}