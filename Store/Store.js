import { configureStore } from '@reduxjs/toolkit';

import signupReducer from './Signup-slice';
import searchReducer from './Search-slice';
import userReducer from './user-slice';
import utilityReducer from './Utility-slice';
import socketReducer from './Socket-slice';



const store = configureStore({
  reducer: {
    signup: signupReducer,
    user: userReducer,
    search: searchReducer,
    utility: utilityReducer,
    socketRedux: socketReducer
  }
})

export default store;
