import { configureStore } from '@reduxjs/toolkit';

import signupReducer from './Signup-slice';
import searchReducer from './Search-slice';
import userReducer from './user-slice';
import utilityReducer from './Utility-slice';

const store = configureStore({
  reducer: {
    signup: signupReducer,
    user: userReducer,
    search:searchReducer,
    utility:utilityReducer
  }
})

export default store;