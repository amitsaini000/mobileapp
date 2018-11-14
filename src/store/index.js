
import { createStore, combineReducers,applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import person from "../reducers/person";
import userchat from "../reducers/userchat";


export default store = createStore(combineReducers({person,userchat}),{},applyMiddleware(thunk));

